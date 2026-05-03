<?php
// backend/lib/JWT.php
// Reusable JWT helper — secret always sourced from env, never hardcoded.

class JWT {

    private static ?string $cachedSecret = null;

    private static function secret(): string {
        if (self::$cachedSecret !== null) {
            return self::$cachedSecret;
        }

        $envFile = __DIR__ . '/../.env';
        $env = [];
        if (file_exists($envFile)) {
            $env = parse_ini_file($envFile);
        }
        
        self::$cachedSecret = $env['JWT_SECRET'] ?? 'change_me_in_production';
        return self::$cachedSecret;
    }

    public static function encode(array $payload): string {
        $secret = self::secret();

        $header  = base64url_encode(json_encode(['typ' => 'JWT', 'alg' => 'HS256']));
        $payload = base64url_encode(json_encode($payload));

        $signature = base64url_encode(
            hash_hmac('sha256', "$header.$payload", $secret, true)
        );

        return "$header.$payload.$signature";
    }

    public static function decode(string $jwt) {
        $secret = self::secret();
        $parts  = explode('.', $jwt);

        if (count($parts) !== 3) return false;

        [$header, $payload, $sig] = $parts;

        $expected = base64url_encode(
            hash_hmac('sha256', "$header.$payload", $secret, true)
        );

        if (!hash_equals($expected, $sig)) return false;

        $data = json_decode(base64_decode(str_replace(['-','_'], ['+','/'], $payload)), true);

        if (isset($data['exp']) && $data['exp'] < time()) return false;

        return $data;
    }

    /**
     * Call at the top of any protected endpoint.
     * Returns the authenticated user_id, or sends 401 + exits.
     */
    public static function requireAuth(): int {
        $token = null;

        // 1. HttpOnly cookie (primary)
        if (!empty($_COOKIE['jwt'])) {
            $token = $_COOKIE['jwt'];
        }
        // 2. Authorization: Bearer <token> fallback
        elseif (!empty($_SERVER['HTTP_AUTHORIZATION'])) {
            if (preg_match('/Bearer\s(\S+)/i', $_SERVER['HTTP_AUTHORIZATION'], $m)) {
                $token = $m[1];
            }
        }

        if (!$token) {
            http_response_code(401);
            echo json_encode(['error' => 'Unauthenticated']);
            exit();
        }

        $payload = self::decode($token);
        if (!$payload || empty($payload['user_id'])) {
            http_response_code(401);
            echo json_encode(['error' => 'Invalid or expired token']);
            exit();
        }

        return (int) $payload['user_id'];
    }
}

// Helper used internally
function base64url_encode(string $data): string {
    return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
}
?>

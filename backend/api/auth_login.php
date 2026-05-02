<?php
// backend/api/auth_login.php
require_once __DIR__ . '/config.php';
require_once __DIR__ . '/../lib/JWT.php';

require_method('POST');

$input    = read_json_input();
$email    = strtolower(trim($input['email'] ?? ''));
$password = $input['password'] ?? '';

if (!$email || !$password) {
    json_response(['error' => 'Email and password are required.'], 422);
}

try {
    $stmt = $pdo->prepare("SELECT id, username, email, password_hash, created_at FROM users WHERE email = :email LIMIT 1");
    $stmt->execute([':email' => $email]);
    $user = $stmt->fetch();

    if (!$user || !password_verify($password, $user['password_hash'])) {
        json_response(['error' => 'Invalid email or password.'], 401);
    }

    $payload = [
        'user_id' => $user['id'],
        'email'   => $user['email'],
        'exp'     => time() + 86400, // 1 day
    ];
    $token = JWT::encode($payload);

    // Set HttpOnly cookie
    setcookie('jwt', $token, [
        'expires'  => time() + 86400,
        'path'     => '/',
        'httponly' => true,
        'samesite' => 'Lax',
        'secure'   => false, // false for localhost
    ]);

    // Return user (no token in body)
    unset($user['password_hash']);
    json_response(['success' => true, 'user' => $user]);

} catch (\PDOException $e) {
    json_response(['error' => $e->getMessage()], 500);
}
?>

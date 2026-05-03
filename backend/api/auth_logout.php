<?php
// backend/api/auth_logout.php
require_once __DIR__ . '/config.php';

require_method('POST');

// Expire the cookie immediately
$env = parse_ini_file(__DIR__ . '/../.env');
setcookie('jwt', '', [
    'expires'  => time() - 3600,
    'path'     => '/',
    'httponly' => true,
    'samesite' => 'Lax',
    'secure'   => ($env['COOKIE_SECURE'] ?? 'false') === 'true',
]);

json_response(['success' => true, 'message' => 'Logged out.']);
?>

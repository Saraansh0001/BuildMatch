<?php
// backend/api/auth_logout.php
require_once __DIR__ . '/config.php';

require_method('POST');

// Expire the cookie immediately
setcookie('jwt', '', [
    'expires'  => time() - 3600,
    'path'     => '/',
    'httponly' => true,
    'samesite' => 'Lax',
    'secure'   => false,
]);

json_response(['success' => true, 'message' => 'Logged out.']);
?>

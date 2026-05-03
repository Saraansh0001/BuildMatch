<?php
// backend/api/auth_me.php
require_once __DIR__ . '/config.php';
require_once __DIR__ . '/../lib/JWT.php';

require_method('GET');

$userId = JWT::requireAuth();

try {
    $stmt = $pdo->prepare("SELECT user_id, name, email, phone, created_at FROM users WHERE user_id = :id LIMIT 1");
    $stmt->execute([':id' => $userId]);
    $user = $stmt->fetch();

    if (!$user) {
        json_response(['error' => 'User not found.'], 404);
    }

    json_response(['success' => true, 'user' => $user]);

} catch (\PDOException $e) {
    json_response(['error' => $e->getMessage()], 500);
}
?>

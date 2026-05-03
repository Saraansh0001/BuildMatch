<?php
// backend/api/auth_register.php
require_once __DIR__ . '/config.php';
require_once __DIR__ . '/../lib/JWT.php';

require_method('POST');

$input    = read_json_input();
$name     = trim($input['name'] ?? '');
$email    = strtolower(trim($input['email'] ?? ''));
$password = $input['password'] ?? '';

if (!$name || !$email || !$password) {
    json_response(['error' => 'name, email, and password are required.'], 422);
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    json_response(['error' => 'Invalid email address.'], 422);
}
if (strlen($password) < 6) {
    json_response(['error' => 'Password must be at least 6 characters.'], 422);
}

try {
    // Check for duplicate email or name
    $check = $pdo->prepare("SELECT user_id FROM users WHERE email = :email LIMIT 1");
    $check->execute([':email' => $email]);
    if ($check->fetch()) {
        json_response(['error' => 'Email already in use.'], 409);
    }

    $hash = password_hash($password, PASSWORD_BCRYPT);
    $stmt = $pdo->prepare("INSERT INTO users (name, email, password_hash) VALUES (:n, :e, :h)");
    $stmt->execute([':n' => $name, ':e' => $email, ':h' => $hash]);

    json_response(['success' => true, 'message' => 'Account created. Please log in.'], 201);

} catch (\PDOException $e) {
    json_response(['error' => $e->getMessage()], 500);
}
?>

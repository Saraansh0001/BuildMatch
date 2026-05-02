<?php
require_once __DIR__ . '/config/db.php';
try {
    $db = $pdo; // $pdo is defined in config/db.php
    echo "SUCCESS: Database connected.\n";
    
    $stmt = $db->query("SELECT COUNT(*) FROM users");
    $count = $stmt->fetchColumn();
    echo "SUCCESS: Found $count users in database.\n";
    
    $stmt = $db->prepare("SELECT * FROM users WHERE email = ?");
    $stmt->execute(['demo@foliovault.app']);
    $user = $stmt->fetch();
    if ($user) {
        echo "SUCCESS: Demo user exists.\n";
    } else {
        echo "ERROR: Demo user NOT found. Did you seed the database?\n";
    }
} catch (Exception $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
}

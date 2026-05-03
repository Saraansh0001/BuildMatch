<?php

require_once __DIR__ . '/../backend/config/db.php';

try {
    $sql = file_get_contents(__DIR__ . '/../db/schema.sql');
    // Remove USE statement to avoid issues if we are already connected to the right DB
    $sql = preg_replace('/USE `[^`]+`;/', '', $sql);

    $queries = explode(';', $sql);
    foreach ($queries as $query) {
        $q = trim($query);
        if ($q) {
            $pdo->exec($q);
            echo "Executed: " . substr($q, 0, 50) . "...\n";
        }
    }
    echo "Migration complete.\n";
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
?>
<?php
// scratch/check_columns.php
require_once __DIR__ . '/../backend/config/db.php';

$sql = "DESCRIBE assets";
$stmt = $pdo->query($sql);
$columns = $stmt->fetchAll();

echo json_encode($columns, JSON_PRETTY_PRINT);
?>

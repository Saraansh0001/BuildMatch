<?php

require_once __DIR__ . '/../backend/config/db.php';

$typeFilter = 'Stock';
$where = ["a.type = :type"];
$params = [':type' => $typeFilter];
$whereClause = 'WHERE ' . implode(' AND ', $where);

$sql = "
    SELECT a.id, a.symbol, a.name, a.current_price, a.type AS asset_type
    FROM assets a
    $whereClause
    ORDER BY a.type, a.symbol
";

$stmt = $pdo->prepare($sql);
$stmt->execute($params);
$assets = $stmt->fetchAll();

echo json_encode($assets, JSON_PRETTY_PRINT);
?>
<?php
// backend/api/get_assets.php
// Returns the full asset catalog (for dropdown selects in forms)
require_once __DIR__ . '/config.php';

require_method('GET');

try {
    $typeFilter = isset($_GET['type']) ? $_GET['type'] : null;

    $where = [];
    $params = [];

    if ($typeFilter) {
        $where[] = "at.name = :type";
        $params[':type'] = $typeFilter;
    }

    $whereClause = !empty($where) ? 'WHERE ' . implode(' AND ', $where) : '';

    $sql = "
        SELECT a.id, a.symbol, a.name, a.current_price, at.name AS asset_type
        FROM assets a
        JOIN asset_types at ON a.type_id = at.id
        $whereClause
        ORDER BY at.name, a.symbol
    ";
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $assets = $stmt->fetchAll();

    foreach ($assets as &$row) {
        $row['current_price'] = (float) $row['current_price'];
    }

    json_response(["success" => true, "assets" => $assets]);
} catch (\PDOException $e) {
    json_response(["error" => $e->getMessage()], 500);
}
?>

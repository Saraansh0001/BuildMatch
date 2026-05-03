<?php
// backend/api/get_assets.php
// Returns the full asset catalog — stocks and mutual_funds from separate tables.
// Query param: ?type=stock | ?type=mutual_fund (omit for all)
require_once __DIR__ . '/config.php';
require_once __DIR__ . '/../lib/JWT.php';

require_method('GET');

try {
    JWT::requireAuth();
    $typeFilter = strtolower(trim($_GET['type'] ?? ''));

    $stocks      = [];
    $mutualFunds = [];

    if ($typeFilter !== 'mutual_fund') {
        $search = trim($_GET['search'] ?? '');
        $sql = "SELECT stock_id AS id, symbol, stock_name AS name, current_price, 'Stock' AS asset_type, sector
                FROM stocks";
        $params = [];
        if ($search !== '') {
            $sql .= " WHERE symbol LIKE :s OR stock_name LIKE :s2";
            $params[':s']  = '%' . $search . '%';
            $params[':s2'] = '%' . $search . '%';
        }
        $sql .= " ORDER BY symbol";
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        $stocks = $stmt->fetchAll();
        foreach ($stocks as &$row) {
            $row['current_price'] = (float) $row['current_price'];
        }
        unset($row);
    }

    if ($typeFilter !== 'stock') {
        $search = trim($_GET['search'] ?? '');
        $sql = "SELECT mf_id AS id, symbol, mf_name AS name, nav AS current_price, 'Mutual Fund' AS asset_type,
                       fund_house, category
                FROM mutual_funds";
        $params = [];
        if ($search !== '') {
            $sql .= " WHERE symbol LIKE :s OR mf_name LIKE :s2";
            $params[':s']  = '%' . $search . '%';
            $params[':s2'] = '%' . $search . '%';
        }
        $sql .= " ORDER BY symbol";
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        $mutualFunds = $stmt->fetchAll();
        foreach ($mutualFunds as &$row) {
            $row['current_price'] = (float) $row['current_price'];
        }
        unset($row);
    }

    // Return unified flat list (for backward compat) + typed sub-arrays
    $assets = array_merge($stocks, $mutualFunds);

    json_response([
        "success"      => true,
        "assets"       => $assets,
        "stocks"       => $stocks,
        "mutual_funds" => $mutualFunds,
    ]);
} catch (\PDOException $e) {
    json_response(["error" => $e->getMessage()], 500);
}
?>
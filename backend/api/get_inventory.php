<?php
// backend/api/get_inventory.php
// Returns holdings grouped by asset type (Stock / Mutual Fund etc.)
require_once __DIR__ . '/config.php';
require_once __DIR__ . '/../lib/JWT.php';

require_method('GET');

try {
    $userId = JWT::requireAuth();

    $sql = "
        SELECT
            a.id AS asset_id,
            a.symbol,
            a.name AS asset_name,
            at.name AS asset_type,
            a.current_price,
            COALESCE(buys.total_qty, 0) - COALESCE(sells.total_qty, 0) AS net_quantity,
            COALESCE(buys.avg_price, 0) AS average_buy_price,
            (COALESCE(buys.total_qty, 0) - COALESCE(sells.total_qty, 0)) * a.current_price AS current_value,
            ((a.current_price - COALESCE(buys.avg_price, 0)) / NULLIF(COALESCE(buys.avg_price, 0), 0)) * 100 AS gain_pct
        FROM assets a
        JOIN asset_types at ON a.type_id = at.id
        LEFT JOIN (
            SELECT asset_id,
                   SUM(quantity) AS total_qty,
                   SUM(quantity * price_per_unit) / SUM(quantity) AS avg_price
            FROM transactions
            WHERE user_id = :uid AND transaction_type = 'BUY'
            GROUP BY asset_id
        ) buys ON buys.asset_id = a.id
        LEFT JOIN (
            SELECT asset_id, SUM(quantity) AS total_qty
            FROM transactions
            WHERE user_id = :uid2 AND transaction_type = 'SELL'
            GROUP BY asset_id
        ) sells ON sells.asset_id = a.id
        WHERE (COALESCE(buys.total_qty, 0) - COALESCE(sells.total_qty, 0)) > 0
        ORDER BY at.name, a.symbol
    ";

    $stmt = $pdo->prepare($sql);
    $stmt->execute([':uid' => $userId, ':uid2' => $userId]);
    $rows = $stmt->fetchAll();

    $stocks = [];
    $mutualFunds = [];
    $others = [];

    foreach ($rows as $row) {
        $row['net_quantity']       = (float) $row['net_quantity'];
        $row['current_price']      = (float) $row['current_price'];
        $row['average_buy_price']  = (float) $row['average_buy_price'];
        $row['current_value']      = (float) $row['current_value'];
        $row['gain_pct']           = $row['gain_pct'] !== null ? round((float) $row['gain_pct'], 2) : 0;

        if ($row['asset_type'] === 'Stock') {
            $stocks[] = $row;
        } elseif ($row['asset_type'] === 'Mutual Fund') {
            $mutualFunds[] = $row;
        } else {
            $others[] = $row;
        }
    }

    json_response([
        "success"      => true,
        "stocks"       => $stocks,
        "mutual_funds" => $mutualFunds,
        "others"       => $others,
    ]);
} catch (\PDOException $e) {
    json_response(["error" => $e->getMessage()], 500);
}
?>

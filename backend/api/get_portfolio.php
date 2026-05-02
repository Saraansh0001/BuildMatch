<?php
// backend/api/get_portfolio.php
// Returns total portfolio value + breakdown by asset type
require_once __DIR__ . '/config.php';
require_once __DIR__ . '/../lib/JWT.php';

require_method('GET');

try {
    $userId = JWT::requireAuth();

    // Total portfolio value = SUM of (current holdings quantity * current_price)
    // Holdings are derived dynamically: net quantity = sum(BUY) - sum(SELL)
    $sql = "
        SELECT
            at.name AS asset_type,
            SUM(
                (COALESCE(buys.total_qty, 0) - COALESCE(sells.total_qty, 0)) * a.current_price
            ) AS total_value
        FROM assets a
        JOIN asset_types at ON a.type_id = at.id
        LEFT JOIN (
            SELECT asset_id, SUM(quantity) AS total_qty
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
        GROUP BY at.name
    ";

    $stmt = $pdo->prepare($sql);
    $stmt->execute([':uid' => $userId, ':uid2' => $userId]);
    $breakdown = $stmt->fetchAll();

    $totalValue = 0;
    foreach ($breakdown as $row) {
        $totalValue += (float) $row['total_value'];
    }

    // Recent 5 transactions
    $recentSql = "
        SELECT t.id, t.transaction_type, t.quantity, t.price_per_unit,
               t.transaction_date, a.symbol, a.name AS asset_name, at.name AS asset_type
        FROM transactions t
        JOIN assets a ON t.asset_id = a.id
        JOIN asset_types at ON a.type_id = at.id
        WHERE t.user_id = :uid
        ORDER BY t.transaction_date DESC
        LIMIT 5
    ";
    $recentStmt = $pdo->prepare($recentSql);
    $recentStmt->execute([':uid' => $userId]);
    $recentActivity = $recentStmt->fetchAll();

    json_response([
        "success"         => true,
        "total_value"     => round($totalValue, 2),
        "breakdown"       => $breakdown,
        "recent_activity" => $recentActivity,
    ]);
} catch (\PDOException $e) {
    json_response(["error" => $e->getMessage()], 500);
}
?>

<?php
// backend/api/get_portfolio.php
// Returns total portfolio value + breakdown by asset type + recent activity
require_once __DIR__ . '/config.php';
require_once __DIR__ . '/../lib/JWT.php';

require_method('GET');

try {
    $userId = JWT::requireAuth();

    // ---- Stocks value ----
    $stockValueSql = "
        SELECT COALESCE(SUM(hs.quantity * s.current_price), 0) AS stock_value
        FROM holds_stock hs
        JOIN stocks s ON s.stock_id = hs.stock_id
        WHERE hs.user_id = :uid AND hs.quantity > 0
    ";
    $svStmt = $pdo->prepare($stockValueSql);
    $svStmt->execute([':uid' => $userId]);
    $stockValue = (float) $svStmt->fetchColumn();

    // ---- Mutual funds value ----
    $mfValueSql = "
        SELECT COALESCE(SUM(mfh.quantity * mf.nav), 0) AS mf_value
        FROM mf_holdings mfh
        JOIN mutual_funds mf ON mf.mf_id = mfh.mf_id
        WHERE mfh.user_id = :uid AND mfh.quantity > 0
    ";
    $mvStmt = $pdo->prepare($mfValueSql);
    $mvStmt->execute([':uid' => $userId]);
    $mfValue = (float) $mvStmt->fetchColumn();

    $totalValue = round($stockValue + $mfValue, 2);

    $breakdown = [
        ['asset_type' => 'Stock',       'total_value' => round($stockValue, 2)],
        ['asset_type' => 'Mutual Fund', 'total_value' => round($mfValue, 2)],
    ];

    // ---- Stats: total invested and total sold ----
    $stockStatsSql = "
        SELECT
            COALESCE(SUM(CASE WHEN transaction_type='BUY'  THEN quantity * price ELSE 0 END), 0) AS invested,
            COALESCE(SUM(CASE WHEN transaction_type='SELL' THEN quantity * price ELSE 0 END), 0) AS sold
        FROM stock_transactions WHERE user_id = :uid
    ";
    $ssStmt = $pdo->prepare($stockStatsSql);
    $ssStmt->execute([':uid' => $userId]);
    $ss = $ssStmt->fetch();

    $mfStatsSql = "
        SELECT
            COALESCE(SUM(CASE WHEN transaction_type='BUY'  THEN quantity * average_nav ELSE 0 END), 0) AS invested,
            COALESCE(SUM(CASE WHEN transaction_type='SELL' THEN quantity * average_nav ELSE 0 END), 0) AS sold
        FROM mf_transactions WHERE user_id = :uid
    ";
    $msStmt = $pdo->prepare($mfStatsSql);
    $msStmt->execute([':uid' => $userId]);
    $ms = $msStmt->fetch();

    $totalInvested = (float) $ss['invested'] + (float) $ms['invested'];
    $totalSold     = (float) $ss['sold']     + (float) $ms['sold'];

    // ---- Recent 5 transactions (UNION) ----
    $recentSql = "
        SELECT * FROM (
            SELECT
                st.transaction_id AS id,
                st.transaction_type,
                st.quantity,
                st.price          AS price_per_unit,
                st.transaction_date,
                s.symbol,
                s.stock_name      AS asset_name,
                'Stock'           AS asset_type
            FROM stock_transactions st
            JOIN stocks s ON s.stock_id = st.stock_id
            WHERE st.user_id = :uid
            UNION ALL
            SELECT
                mft.transaction_id AS id,
                mft.transaction_type,
                mft.quantity,
                mft.average_nav    AS price_per_unit,
                mft.transaction_date,
                mf.symbol,
                mf.mf_name         AS asset_name,
                'Mutual Fund'      AS asset_type
            FROM mf_transactions mft
            JOIN mutual_funds mf ON mf.mf_id = mft.mf_id
            WHERE mft.user_id = :uid2
        ) AS combined
        ORDER BY transaction_date DESC
        LIMIT 5
    ";
    $recentStmt = $pdo->prepare($recentSql);
    $recentStmt->execute([':uid' => $userId, ':uid2' => $userId]);
    $recentActivity = $recentStmt->fetchAll();

    json_response([
        "success"         => true,
        "total_value"     => $totalValue,
        "total_invested"  => $totalInvested,
        "total_sold"      => $totalSold,
        "breakdown"       => $breakdown,
        "recent_activity" => $recentActivity,
    ]);
} catch (\PDOException $e) {
    json_response(["error" => $e->getMessage()], 500);
}
?>

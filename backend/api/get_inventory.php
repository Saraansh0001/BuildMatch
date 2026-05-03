<?php
// backend/api/get_inventory.php
// Returns holdings split into stocks and mutual_funds
require_once __DIR__ . '/config.php';
require_once __DIR__ . '/../lib/JWT.php';

require_method('GET');

try {
    $userId = JWT::requireAuth();

    // ---- STOCKS: join holds_stock + stocks ----
    $stockSql = "
        SELECT
            s.stock_id,
            s.symbol,
            s.stock_name,
            s.sector,
            s.current_price,
            hs.quantity,
            hs.average_price,
            (hs.quantity * s.current_price)                                               AS current_value,
            ROUND(((s.current_price - hs.average_price) / NULLIF(hs.average_price, 0)) * 100, 2) AS gain_pct
        FROM holds_stock hs
        JOIN stocks s ON s.stock_id = hs.stock_id
        WHERE hs.user_id = :uid
          AND hs.quantity > 0
        ORDER BY s.symbol
    ";
    $stockStmt = $pdo->prepare($stockSql);
    $stockStmt->execute([':uid' => $userId]);
    $stocks = $stockStmt->fetchAll();

    foreach ($stocks as &$row) {
        $row['stock_id']      = (int)   $row['stock_id'];
        $row['current_price'] = (float) $row['current_price'];
        $row['quantity']      = (float) $row['quantity'];
        $row['average_price'] = (float) $row['average_price'];
        $row['current_value'] = (float) $row['current_value'];
        $row['gain_pct']      = (float) $row['gain_pct'];
    }
    unset($row);

    // ---- MUTUAL FUNDS: join mf_holdings + mutual_funds ----
    $mfSql = "
        SELECT
            mf.mf_id,
            mf.symbol,
            mf.mf_name,
            mf.fund_house,
            mf.category,
            mf.nav,
            mfh.quantity,
            mfh.average_nav,
            (mfh.quantity * mf.nav)                                                        AS current_value,
            ROUND(((mf.nav - mfh.average_nav) / NULLIF(mfh.average_nav, 0)) * 100, 2)     AS gain_pct
        FROM mf_holdings mfh
        JOIN mutual_funds mf ON mf.mf_id = mfh.mf_id
        WHERE mfh.user_id = :uid
          AND mfh.quantity > 0
        ORDER BY mf.symbol
    ";
    $mfStmt = $pdo->prepare($mfSql);
    $mfStmt->execute([':uid' => $userId]);
    $mutualFunds = $mfStmt->fetchAll();

    foreach ($mutualFunds as &$row) {
        $row['mf_id']       = (int)   $row['mf_id'];
        $row['nav']         = (float) $row['nav'];
        $row['quantity']    = (float) $row['quantity'];
        $row['average_nav'] = (float) $row['average_nav'];
        $row['current_value'] = (float) $row['current_value'];
        $row['gain_pct']    = (float) $row['gain_pct'];
    }
    unset($row);

    json_response([
        "success"      => true,
        "stocks"       => $stocks,
        "mutual_funds" => $mutualFunds,
    ]);
} catch (\PDOException $e) {
    json_response(["error" => $e->getMessage()], 500);
}
?>

<?php
require_once __DIR__ . '/config.php';
require_once __DIR__ . '/../lib/JWT.php';
require_method('GET');
try {
    $userId = JWT::requireAuth();

    // 1. Sector breakdown (JOIN + GROUP BY + HAVING > 0)
    $sector = $pdo->prepare("
        SELECT s.sector,
               COUNT(DISTINCT s.stock_id) AS stocks_held,
               SUM(hs.quantity * s.current_price) AS sector_value
        FROM holds_stock hs
        JOIN stocks s ON s.stock_id = hs.stock_id
        WHERE hs.user_id = :uid AND hs.quantity > 0
        GROUP BY s.sector
        HAVING sector_value > 0
        ORDER BY sector_value DESC
    ");
    $sector->execute([':uid' => $userId]);
    $sectorData = $sector->fetchAll();

    // 2. Most traded stocks (GROUP BY + HAVING)
    $traded = $pdo->prepare("
        SELECT s.symbol, s.stock_name,
               COUNT(*) AS txn_count,
               SUM(st.quantity) AS total_qty_traded
        FROM stock_transactions st
        JOIN stocks s ON s.stock_id = st.stock_id
        WHERE st.user_id = :uid
        GROUP BY s.stock_id, s.symbol, s.stock_name
        HAVING txn_count >= 1
        ORDER BY txn_count DESC
    ");
    $traded->execute([':uid' => $userId]);
    $tradedData = $traded->fetchAll();

    // 3. Full P&L per holding (multi-table JOIN)
    $pl = $pdo->prepare("
        SELECT s.symbol, s.stock_name, s.sector,
               hs.quantity, hs.average_price, s.current_price,
               (hs.quantity * hs.average_price) AS invested,
               (hs.quantity * s.current_price) AS current_value,
               (hs.quantity * (s.current_price - hs.average_price)) AS unrealized_pl
        FROM holds_stock hs
        JOIN stocks s ON s.stock_id = hs.stock_id
        WHERE hs.user_id = :uid AND hs.quantity > 0
        ORDER BY unrealized_pl DESC
    ");
    $pl->execute([':uid' => $userId]);
    $plData = $pl->fetchAll();

    // 4. Monthly stock investment summary (GROUP BY + HAVING)
    $monthly = $pdo->prepare("
        SELECT DATE_FORMAT(transaction_date, '%Y-%m') AS month,
               SUM(quantity * price) AS total_invested,
               COUNT(*) AS num_buys
        FROM stock_transactions
        WHERE user_id = :uid AND transaction_type = 'BUY'
        GROUP BY DATE_FORMAT(transaction_date, '%Y-%m')
        ORDER BY month DESC
    ");
    $monthly->execute([':uid' => $userId]);
    $monthlyData = $monthly->fetchAll();

    // 5. Stocks NOT held by user (NOT IN subquery)
    $notHeld = $pdo->prepare("
        SELECT s.symbol, s.stock_name, s.sector, s.current_price
        FROM stocks s
        WHERE s.stock_id NOT IN (
            SELECT hs.stock_id FROM holds_stock hs WHERE hs.user_id = :uid
        )
    ");
    $notHeld->execute([':uid' => $userId]);
    $notHeldData = $notHeld->fetchAll();

    // 6. MF holdings with gain% (JOIN)
    $mf = $pdo->prepare("
        SELECT mf.symbol, mf.mf_name, mf.fund_house, mf.category,
               mfh.quantity, mfh.average_nav, mf.nav,
               (mfh.quantity * mf.nav) AS current_value,
               ROUND(((mf.nav - mfh.average_nav) / NULLIF(mfh.average_nav,0)) * 100, 2) AS gain_pct
        FROM mf_holdings mfh
        JOIN mutual_funds mf ON mf.mf_id = mfh.mf_id
        WHERE mfh.user_id = :uid AND mfh.quantity > 0
        ORDER BY gain_pct DESC
    ");
    $mf->execute([':uid' => $userId]);
    $mfData = $mf->fetchAll();

    json_response([
        'success'       => true,
        'sector'        => $sectorData,
        'most_traded'   => $tradedData,
        'pl_breakdown'  => $plData,
        'monthly'       => $monthlyData,
        'not_held'      => $notHeldData,
        'mf_breakdown'  => $mfData,
    ]);
} catch (\PDOException $e) {
    json_response(['error' => $e->getMessage()], 500);
}
?>

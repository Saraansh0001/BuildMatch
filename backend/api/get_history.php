<?php
// backend/api/get_history.php
// Returns paginated, filterable transaction history (UNION of stock + MF transactions)
require_once __DIR__ . '/config.php';
require_once __DIR__ . '/../lib/JWT.php';

require_method('GET');

try {
    $userId     = JWT::requireAuth();
    $typeFilter = isset($_GET['type'])       ? strtoupper($_GET['type']) : null;
    $assetType  = isset($_GET['asset_type']) ? $_GET['asset_type']       : null;
    $raw        = $_GET['search'] ?? '';
    $escaped    = str_replace(['\\', '%', '_'], ['\\\\', '\\%', '\\_'], $raw);
    $search     = $raw !== '' ? '%' . $escaped . '%' : null;
    $page       = max(1, (int) ($_GET['page'] ?? 1));
    $limit      = 20;
    $offset     = ($page - 1) * $limit;

    // ---- Build per-branch WHERE fragments ----
    // Both branches filter on user_id. Type and search filters are added inline.
    $typeClause   = ($typeFilter && in_array($typeFilter, ['BUY', 'SELL']))
                    ? "AND transaction_type = :type" : "";
    $stockSearchClause = $search
                        ? "AND (s.symbol LIKE :search OR s.stock_name LIKE :search2)" : "";
    $mfSearchClause    = $search
                        ? "AND (mf.symbol LIKE :search OR mf.mf_name LIKE :search2)" : "";

    // asset_type filter: 'Stock' or 'Mutual Fund' (values used in UNION label)
    $stockBranchEnabled = true;
    $mfBranchEnabled    = true;
    if ($assetType === 'Stock')       $mfBranchEnabled    = false;
    if ($assetType === 'Mutual Fund') $stockBranchEnabled = false;

    $params = [':uid' => $userId];
    if ($mfBranchEnabled) $params[':uid2'] = $userId;
    if ($typeFilter && in_array($typeFilter, ['BUY', 'SELL'])) {
        $params[':type'] = $typeFilter;
    }
    if ($search) {
        $params[':search']  = $search;
        $params[':search2'] = $search;
    }

    // Build UNION — always select same column list
    $branches = [];

    if ($stockBranchEnabled) {
        $branches[] = "
            SELECT
                st.transaction_id AS id,
                st.transaction_type,
                st.quantity,
                st.price              AS price_per_unit,
                (st.quantity * st.price) AS total_amount,
                st.transaction_date,
                s.symbol,
                s.stock_name          AS asset_name,
                'Stock'               AS asset_type
            FROM stock_transactions st
            JOIN stocks s ON s.stock_id = st.stock_id
            WHERE st.user_id = :uid
              $typeClause
              $stockSearchClause
        ";
    }

    if ($mfBranchEnabled) {
        $branches[] = "
            SELECT
                mft.transaction_id AS id,
                mft.transaction_type,
                mft.quantity,
                mft.average_nav        AS price_per_unit,
                (mft.quantity * mft.average_nav) AS total_amount,
                mft.transaction_date,
                mf.symbol,
                mf.mf_name             AS asset_name,
                'Mutual Fund'          AS asset_type
            FROM mf_transactions mft
            JOIN mutual_funds mf ON mf.mf_id = mft.mf_id
            WHERE mft.user_id = :uid2
              $typeClause
              $mfSearchClause
        ";
    }

    // If both branches disabled (shouldn't happen), return empty
    if (empty($branches)) {
        json_response([
            "success"      => true,
            "transactions" => [],
            "total"        => 0,
            "page"         => $page,
            "limit"        => $limit,
            "pages"        => 0,
        ]);
        exit;
    }

    $unionSql = implode(" UNION ALL ", $branches);

    // Count total
    $countSql = "SELECT COUNT(*) FROM ($unionSql) AS combined";
    $countStmt = $pdo->prepare($countSql);
    foreach ($params as $k => $v) {
        $countStmt->bindValue($k, $v);
    }
    $countStmt->execute();
    $total = (int) $countStmt->fetchColumn();

    // Fetch page
    $sql = "SELECT * FROM ($unionSql) AS combined ORDER BY transaction_date DESC LIMIT :lim OFFSET :off";
    $stmt = $pdo->prepare($sql);
    foreach ($params as $k => $v) {
        $stmt->bindValue($k, $v);
    }
    $stmt->bindValue(':lim',  $limit,  PDO::PARAM_INT);
    $stmt->bindValue(':off',  $offset, PDO::PARAM_INT);
    $stmt->execute();
    $transactions = $stmt->fetchAll();

    foreach ($transactions as &$row) {
        $row['quantity']       = (float) $row['quantity'];
        $row['price_per_unit'] = (float) $row['price_per_unit'];
        $row['total_amount']   = (float) $row['total_amount'];
    }
    unset($row);

    json_response([
        "success"      => true,
        "transactions" => $transactions,
        "total"        => $total,
        "page"         => $page,
        "limit"        => $limit,
        "pages"        => (int) ceil($total / $limit),
    ]);
} catch (\PDOException $e) {
    json_response(["error" => $e->getMessage()], 500);
}
?>

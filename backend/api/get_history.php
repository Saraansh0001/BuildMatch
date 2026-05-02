<?php
// backend/api/get_history.php
// Returns paginated, filterable transaction history
require_once __DIR__ . '/config.php';
require_once __DIR__ . '/../lib/JWT.php';

require_method('GET');

try {
    $userId = JWT::requireAuth();
    $typeFilter = isset($_GET['type']) ? strtoupper($_GET['type']) : null;
    $assetType  = isset($_GET['asset_type']) ? $_GET['asset_type'] : null;
    $search     = isset($_GET['search']) ? '%' . $_GET['search'] . '%' : null;
    $page       = max(1, (int) ($_GET['page'] ?? 1));
    $limit      = 20;
    $offset     = ($page - 1) * $limit;

    $where = ["t.user_id = :uid"];
    $params = [':uid' => $userId];

    if ($typeFilter && in_array($typeFilter, ['BUY', 'SELL'])) {
        $where[] = "t.transaction_type = :type";
        $params[':type'] = $typeFilter;
    }
    if ($assetType) {
        $where[] = "at.name = :atype";
        $params[':atype'] = $assetType;
    }
    if ($search) {
        $where[] = "(a.symbol LIKE :search OR a.name LIKE :search2)";
        $params[':search']  = $search;
        $params[':search2'] = $search;
    }

    $whereClause = implode(' AND ', $where);

    // Count total
    $countSql = "
        SELECT COUNT(*) FROM transactions t
        JOIN assets a ON t.asset_id = a.id
        JOIN asset_types at ON a.type_id = at.id
        WHERE $whereClause
    ";
    $countStmt = $pdo->prepare($countSql);
    $countStmt->execute($params);
    $total = (int) $countStmt->fetchColumn();

    // Fetch rows
    $sql = "
        SELECT
            t.id, t.transaction_type, t.quantity, t.price_per_unit,
            (t.quantity * t.price_per_unit) AS total_amount,
            t.transaction_date,
            a.symbol, a.name AS asset_name,
            at.name AS asset_type
        FROM transactions t
        JOIN assets a ON t.asset_id = a.id
        JOIN asset_types at ON a.type_id = at.id
        WHERE $whereClause
        ORDER BY t.transaction_date DESC
        LIMIT :lim OFFSET :off
    ";
    $stmt = $pdo->prepare($sql);
    foreach ($params as $k => $v) {
        $stmt->bindValue($k, $v);
    }
    $stmt->bindValue(':lim', $limit, PDO::PARAM_INT);
    $stmt->bindValue(':off', $offset, PDO::PARAM_INT);
    $stmt->execute();
    $transactions = $stmt->fetchAll();

    foreach ($transactions as &$row) {
        $row['quantity']      = (float) $row['quantity'];
        $row['price_per_unit'] = (float) $row['price_per_unit'];
        $row['total_amount']  = (float) $row['total_amount'];
    }

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

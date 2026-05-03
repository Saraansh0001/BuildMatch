<?php
// backend/api/add_transaction.php
// Inserts a BUY or SELL transaction and updates the appropriate holdings cache.
// Accepts asset_type: "stock" | "mutual_fund"
require_once __DIR__ . '/config.php';
require_once __DIR__ . '/../lib/JWT.php';

require_method('POST');

$input = read_json_input();

$userId          = JWT::requireAuth();
$assetType       = strtolower(trim($input['asset_type']       ?? ''));
$transactionType = strtoupper(trim($input['transaction_type'] ?? ''));
$quantity        = isset($input['quantity'])  ? (float) $input['quantity']  : null;
$price           = isset($input['price'])     ? (float) $input['price']     : null;

// asset_type-specific id
$stockId = isset($input['stock_id']) ? (int) $input['stock_id'] : null;
$mfId    = isset($input['mf_id'])    ? (int) $input['mf_id']    : null;

// Validation
$errors = [];
if (!in_array($assetType, ['stock', 'mutual_fund']))         $errors[] = "asset_type must be 'stock' or 'mutual_fund'.";
if (!in_array($transactionType, ['BUY', 'SELL']))            $errors[] = "transaction_type must be BUY or SELL.";
if (!$quantity || $quantity <= 0)                            $errors[] = "quantity must be a positive number.";
if ($price === null || $price <= 0)                          $errors[] = "price must be a positive number.";
if ($assetType === 'stock'       && !$stockId)               $errors[] = "stock_id is required for asset_type 'stock'.";
if ($assetType === 'mutual_fund' && !$mfId)                  $errors[] = "mf_id is required for asset_type 'mutual_fund'.";

if (!empty($errors)) {
    json_response(["error" => implode(' ', $errors)], 422);
}

try {
    $pdo->beginTransaction();

    // ==============================================================
    // STOCK path
    // ==============================================================
    if ($assetType === 'stock') {

        if ($transactionType === 'SELL') {
            $checkSql = "
                SELECT
                    COALESCE(SUM(CASE WHEN transaction_type='BUY'  THEN quantity ELSE 0 END), 0) -
                    COALESCE(SUM(CASE WHEN transaction_type='SELL' THEN quantity ELSE 0 END), 0) AS net_qty
                FROM stock_transactions
                WHERE user_id = :uid AND stock_id = :sid
            ";
            $checkStmt = $pdo->prepare($checkSql);
            $checkStmt->execute([':uid' => $userId, ':sid' => $stockId]);
            $netQty = (float) $checkStmt->fetchColumn();

            if ($quantity > $netQty) {
                $pdo->rollBack();
                json_response(["error" => "Insufficient stock holdings. Available: $netQty"], 400);
            }
        }

        // Insert into stock_transactions
        $pdo->prepare("
            INSERT INTO stock_transactions (user_id, stock_id, transaction_type, quantity, price)
            VALUES (:uid, :sid, :type, :qty, :price)
        ")->execute([
            ':uid'   => $userId,
            ':sid'   => $stockId,
            ':type'  => $transactionType,
            ':qty'   => $quantity,
            ':price' => $price,
        ]);
        $newId = $pdo->lastInsertId();

        // Update holds_stock cache
        if ($transactionType === 'BUY') {
            $pdo->prepare("
                INSERT INTO holds_stock (user_id, stock_id, quantity, average_price)
                VALUES (:uid, :sid, :qty, :price)
                ON DUPLICATE KEY UPDATE
                    average_price = (average_price * quantity + :price2 * :qty2) / (quantity + :qty3),
                    quantity      = quantity + :qty4
            ")->execute([
                ':uid'    => $userId,
                ':sid'    => $stockId,
                ':qty'    => $quantity,
                ':price'  => $price,
                ':price2' => $price,
                ':qty2'   => $quantity,
                ':qty3'   => $quantity,
                ':qty4'   => $quantity,
            ]);
        } else {
            $pdo->prepare("
                UPDATE holds_stock SET quantity = quantity - :qty
                WHERE user_id = :uid AND stock_id = :sid
            ")->execute([':qty' => $quantity, ':uid' => $userId, ':sid' => $stockId]);

            $pdo->prepare("
                DELETE FROM holds_stock WHERE user_id = :uid AND stock_id = :sid AND quantity <= 0
            ")->execute([':uid' => $userId, ':sid' => $stockId]);
        }

    // ==============================================================
    // MUTUAL FUND path
    // ==============================================================
    } elseif ($assetType === 'mutual_fund') {

        if ($transactionType === 'SELL') {
            $checkSql = "
                SELECT
                    COALESCE(SUM(CASE WHEN transaction_type='BUY'  THEN quantity ELSE 0 END), 0) -
                    COALESCE(SUM(CASE WHEN transaction_type='SELL' THEN quantity ELSE 0 END), 0) AS net_qty
                FROM mf_transactions
                WHERE user_id = :uid AND mf_id = :mid
            ";
            $checkStmt = $pdo->prepare($checkSql);
            $checkStmt->execute([':uid' => $userId, ':mid' => $mfId]);
            $netQty = (float) $checkStmt->fetchColumn();

            if ($quantity > $netQty) {
                $pdo->rollBack();
                json_response(["error" => "Insufficient mutual fund holdings. Available: $netQty"], 400);
            }
        }

        // Insert into mf_transactions (price submitted is used as average_nav)
        $pdo->prepare("
            INSERT INTO mf_transactions (user_id, mf_id, transaction_type, quantity, average_nav)
            VALUES (:uid, :mid, :type, :qty, :nav)
        ")->execute([
            ':uid'  => $userId,
            ':mid'  => $mfId,
            ':type' => $transactionType,
            ':qty'  => $quantity,
            ':nav'  => $price,
        ]);
        $newId = $pdo->lastInsertId();

        // Update mf_holdings cache
        if ($transactionType === 'BUY') {
            $pdo->prepare("
                INSERT INTO mf_holdings (user_id, mf_id, quantity, average_nav)
                VALUES (:uid, :mid, :qty, :nav)
                ON DUPLICATE KEY UPDATE
                    average_nav = (average_nav * quantity + :nav2 * :qty2) / (quantity + :qty3),
                    quantity    = quantity + :qty4
            ")->execute([
                ':uid'  => $userId,
                ':mid'  => $mfId,
                ':qty'  => $quantity,
                ':nav'  => $price,
                ':nav2' => $price,
                ':qty2' => $quantity,
                ':qty3' => $quantity,
                ':qty4' => $quantity,
            ]);
        } else {
            $pdo->prepare("
                UPDATE mf_holdings SET quantity = quantity - :qty
                WHERE user_id = :uid AND mf_id = :mid
            ")->execute([':qty' => $quantity, ':uid' => $userId, ':mid' => $mfId]);

            $pdo->prepare("
                DELETE FROM mf_holdings WHERE user_id = :uid AND mf_id = :mid AND quantity <= 0
            ")->execute([':uid' => $userId, ':mid' => $mfId]);
        }
    }

    $pdo->commit();
    json_response(["success" => true, "transaction_id" => (int) $newId]);

} catch (\PDOException $e) {
    $pdo->rollBack();
    json_response(["error" => $e->getMessage()], 500);
}
?>

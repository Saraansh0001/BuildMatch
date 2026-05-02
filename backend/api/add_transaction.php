<?php
// backend/api/add_transaction.php
// Inserts a BUY or SELL transaction and updates portfolio_holdings cache
require_once __DIR__ . '/config.php';
require_once __DIR__ . '/../lib/JWT.php';

require_method('POST');

$input = read_json_input();

$userId = JWT::requireAuth();
$assetId         = isset($input['asset_id'])         ? (int)   $input['asset_id']         : null;
$transactionType = isset($input['transaction_type'])  ? strtoupper(trim($input['transaction_type'])) : null;
$quantity        = isset($input['quantity'])          ? (float) $input['quantity']         : null;
$pricePerUnit    = isset($input['price_per_unit'])    ? (float) $input['price_per_unit']   : null;

// Validation
$errors = [];
if (!$assetId)         $errors[] = "asset_id is required.";
if (!in_array($transactionType, ['BUY', 'SELL'])) $errors[] = "transaction_type must be BUY or SELL.";
if (!$quantity || $quantity <= 0)   $errors[] = "quantity must be a positive number.";
if (!$pricePerUnit || $pricePerUnit <= 0) $errors[] = "price_per_unit must be a positive number.";

if (!empty($errors)) {
    json_response(["error" => implode(' ', $errors)], 422);
}

try {
    $pdo->beginTransaction();

    // For SELL: check if user has enough quantity
    if ($transactionType === 'SELL') {
        $checkSql = "
            SELECT
                COALESCE(SUM(CASE WHEN transaction_type='BUY' THEN quantity ELSE 0 END), 0) -
                COALESCE(SUM(CASE WHEN transaction_type='SELL' THEN quantity ELSE 0 END), 0) AS net_qty
            FROM transactions
            WHERE user_id = :uid AND asset_id = :aid
        ";
        $checkStmt = $pdo->prepare($checkSql);
        $checkStmt->execute([':uid' => $userId, ':aid' => $assetId]);
        $netQty = (float) $checkStmt->fetchColumn();

        if ($quantity > $netQty) {
            $pdo->rollBack();
            json_response(["error" => "Insufficient holdings. Available: $netQty"], 400);
        }
    }

    // Insert transaction
    $insertSql = "
        INSERT INTO transactions (user_id, asset_id, transaction_type, quantity, price_per_unit)
        VALUES (:uid, :aid, :type, :qty, :price)
    ";
    $insertStmt = $pdo->prepare($insertSql);
    $insertStmt->execute([
        ':uid'   => $userId,
        ':aid'   => $assetId,
        ':type'  => $transactionType,
        ':qty'   => $quantity,
        ':price' => $pricePerUnit,
    ]);
    $newId = $pdo->lastInsertId();

    // Update portfolio_holdings cache (UPSERT)
    if ($transactionType === 'BUY') {
        $upsertSql = "
            INSERT INTO portfolio_holdings (user_id, asset_id, total_quantity, average_buy_price)
            VALUES (:uid, :aid, :qty, :price)
            ON DUPLICATE KEY UPDATE
                average_buy_price = (average_buy_price * total_quantity + :price2 * :qty2) / (total_quantity + :qty3),
                total_quantity = total_quantity + :qty4
        ";
        $pdo->prepare($upsertSql)->execute([
            ':uid'    => $userId,
            ':aid'    => $assetId,
            ':qty'    => $quantity,
            ':price'  => $pricePerUnit,
            ':price2' => $pricePerUnit,
            ':qty2'   => $quantity,
            ':qty3'   => $quantity,
            ':qty4'   => $quantity,
        ]);
    } else {
        $sellSql = "
            UPDATE portfolio_holdings
            SET total_quantity = total_quantity - :qty
            WHERE user_id = :uid AND asset_id = :aid
        ";
        $pdo->prepare($sellSql)->execute([':qty' => $quantity, ':uid' => $userId, ':aid' => $assetId]);
    }

    $pdo->commit();
    json_response(["success" => true, "transaction_id" => $newId]);

} catch (\PDOException $e) {
    $pdo->rollBack();
    json_response(["error" => $e->getMessage()], 500);
}
?>

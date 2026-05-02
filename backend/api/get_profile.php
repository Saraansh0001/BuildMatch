<?php
// backend/api/get_profile.php
// Returns user profile details
require_once __DIR__ . '/config.php';
require_once __DIR__ . '/../lib/JWT.php';

require_method('GET');

try {
    $userId = JWT::requireAuth();

    $stmt = $pdo->prepare("SELECT id, username, email, created_at FROM users WHERE id = :id");
    $stmt->execute([':id' => $userId]);
    $user = $stmt->fetch();

    if (!$user) {
        json_response(["error" => "User not found"], 404);
    }

    // Portfolio stats
    $statsSql = "
        SELECT
            COUNT(DISTINCT asset_id) AS unique_assets,
            SUM(CASE WHEN transaction_type = 'BUY'  THEN quantity * price_per_unit ELSE 0 END) AS total_invested,
            SUM(CASE WHEN transaction_type = 'SELL' THEN quantity * price_per_unit ELSE 0 END) AS total_sold,
            COUNT(*) AS total_transactions
        FROM transactions
        WHERE user_id = :uid
    ";
    $statsStmt = $pdo->prepare($statsSql);
    $statsStmt->execute([':uid' => $userId]);
    $stats = $statsStmt->fetch();

    json_response([
        "success" => true,
        "user"    => $user,
        "stats"   => [
            "unique_assets"      => (int)   $stats['unique_assets'],
            "total_invested"     => (float) $stats['total_invested'],
            "total_sold"         => (float) $stats['total_sold'],
            "total_transactions" => (int)   $stats['total_transactions'],
        ],
    ]);
} catch (\PDOException $e) {
    json_response(["error" => $e->getMessage()], 500);
}
?>

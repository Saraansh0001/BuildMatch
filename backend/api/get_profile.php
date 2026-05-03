<?php
// backend/api/get_profile.php
// Returns user profile details + portfolio stats
require_once __DIR__ . '/config.php';
require_once __DIR__ . '/../lib/JWT.php';

require_method('GET');

try {
    $userId = JWT::requireAuth();

    $stmt = $pdo->prepare("SELECT user_id, name, email, phone, created_at FROM users WHERE user_id = :id");
    $stmt->execute([':id' => $userId]);
    $user = $stmt->fetch();

    if (!$user) {
        json_response(["error" => "User not found"], 404);
    }

    // Portfolio stats — combined from stock_transactions + mf_transactions
    $statsSql = "
        SELECT
            COUNT(DISTINCT stock_id) AS unique_stocks,
            SUM(CASE WHEN transaction_type = 'BUY'  THEN quantity * price  ELSE 0 END) AS total_invested,
            SUM(CASE WHEN transaction_type = 'SELL' THEN quantity * price  ELSE 0 END) AS total_sold,
            COUNT(*) AS total_transactions
        FROM stock_transactions
        WHERE user_id = :uid
    ";
    $statsStmt = $pdo->prepare($statsSql);
    $statsStmt->execute([':uid' => $userId]);
    $stockStats = $statsStmt->fetch();

    $mfStatsSql = "
        SELECT
            COUNT(DISTINCT mf_id) AS unique_mfs,
            SUM(CASE WHEN transaction_type = 'BUY'  THEN quantity * average_nav ELSE 0 END) AS mf_invested,
            SUM(CASE WHEN transaction_type = 'SELL' THEN quantity * average_nav ELSE 0 END) AS mf_sold,
            COUNT(*) AS mf_transactions
        FROM mf_transactions
        WHERE user_id = :uid
    ";
    $mfStatsStmt = $pdo->prepare($mfStatsSql);
    $mfStatsStmt->execute([':uid' => $userId]);
    $mfStats = $mfStatsStmt->fetch();

    $uniqueAssets      = (int)   $stockStats['unique_stocks']   + (int)   $mfStats['unique_mfs'];
    $totalInvested     = (float) $stockStats['total_invested']  + (float) $mfStats['mf_invested'];
    $totalSold         = (float) $stockStats['total_sold']      + (float) $mfStats['mf_sold'];
    $totalTransactions = (int)   $stockStats['total_transactions'] + (int) $mfStats['mf_transactions'];

    json_response([
        "success" => true,
        "user"    => $user,
        "stats"   => [
            "unique_assets"      => $uniqueAssets,
            "total_invested"     => $totalInvested,
            "total_sold"         => $totalSold,
            "total_transactions" => $totalTransactions,
        ],
    ]);
} catch (\PDOException $e) {
    json_response(["error" => $e->getMessage()], 500);
}
?>

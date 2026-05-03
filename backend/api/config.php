<?php
// backend/api/config.php

require_once __DIR__ . '/../config/db.php';
global $env;
$corsOrigin = $env['CORS_ORIGIN'] ?? 'http://localhost:5173';

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: " . $corsOrigin);
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once __DIR__ . '/_helpers.php';
?>

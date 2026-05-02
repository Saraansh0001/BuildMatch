<?php
// backend/api/_helpers.php

function json_response($data, $status = 200) {
    http_response_code($status);
    echo json_encode($data);
    exit();
}

function read_json_input() {
    return json_decode(file_get_contents('php://input'), true);
}

function require_method($method) {
    if ($_SERVER['REQUEST_METHOD'] !== strtoupper($method)) {
        json_response(["error" => "Method not allowed"], 405);
    }
}
?>

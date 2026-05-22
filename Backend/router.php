<?php

$requestPath = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH);
$publicPath = __DIR__ . '/public' . $requestPath;

if ($requestPath !== '/' && file_exists($publicPath) && !is_dir($publicPath)) {
    return false;
}

require __DIR__ . '/public/index.php';

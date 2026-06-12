<?php

declare(strict_types=1);

// ── Environment ───────────────────────────────────────────────────────────────
// Set DEGREE_GURU_ENV=production in your server environment to go live.
// Everything else defaults to development.
$env = getenv('DEGREE_GURU_ENV') ?: 'dev';
$isProd = ($env === 'production');

defined('YII_DEBUG') or define('YII_DEBUG', !$isProd);
defined('YII_ENV')   or define('YII_ENV',   $isProd ? 'prod' : 'dev');

// ── CORS — set before any output so headers survive PHP fatal errors ──────────
// Load allowed origins from params (no Yii needed — just plain require)
$params         = require __DIR__ . '/../config/params.php';
$allowedOrigins = $params['corsAllowedOrigins'] ?? [];

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if ($origin !== '' && in_array($origin, $allowedOrigins, true)) {
    header('Access-Control-Allow-Origin: ' . $origin);
    header('Access-Control-Allow-Methods: POST, GET, OPTIONS, PUT, DELETE');
    header('Access-Control-Allow-Headers: Content-Type, X-Requested-With, Authorization');
    header('Access-Control-Allow-Credentials: true');
}

// Handle OPTIONS preflight before Yii boots
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// ── Yii bootstrap ─────────────────────────────────────────────────────────────
require __DIR__ . '/../vendor/autoload.php';
require __DIR__ . '/../vendor/yiisoft/yii2/Yii.php';

$config = require __DIR__ . '/../config/web.php';

(new yii\web\Application($config))->run();

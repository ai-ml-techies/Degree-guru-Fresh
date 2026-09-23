<?php

// params-local.php is gitignored — create it on each server for overrides
$local = file_exists(__DIR__ . '/params-local.php')
    ? require __DIR__ . '/params-local.php'
    : [];

$productionCors = [
    'https://degreeguru.in',
    'https://www.degreeguru.in',
    'https://admin.degreeguru.in',
    'https://api.degreeguru.in',
    'http://degreeguru.in',
    'http://www.degreeguru.in',
    'http://admin.degreeguru.in',
    'http://api.degreeguru.in',
];

$defaultCors = array_merge([
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://localhost:8080',
    'http://127.0.0.1:8080',
    'http://localhost:8090',
    'http://127.0.0.1:8090',
    'http://localhost:8091',
    'http://127.0.0.1:8091',
    'http://localhost',
], $productionCors);

$envCors = getenv('CORS_ALLOWED_ORIGINS');
$corsOrigins = $envCors !== false
    ? array_unique(array_merge(array_values(array_filter(array_map('trim', explode(',', $envCors)))), $productionCors))
    : $defaultCors;

return array_merge([

    // Email
    'adminEmail'  => getenv('ADMIN_EMAIL') ?: 'admin@degreeguru.com',
    'senderEmail' => getenv('SENDER_EMAIL') ?: 'noreply@degreeguru.com',
    'senderName'  => getenv('SENDER_NAME') ?: 'Degree Guru',

    // CORS — add your production domain in params-local.php or via CORS_ALLOWED_ORIGINS
    'corsAllowedOrigins' => $corsOrigins,

    // Upload limits
    'maxResumeBytes' => 5 * 1024 * 1024, // 5 MB

], $local);

<?php

// params-local.php is gitignored — create it on each server for overrides
$local = file_exists(__DIR__ . '/params-local.php')
    ? require __DIR__ . '/params-local.php'
    : [];

$defaultCors = [
    'http://localhost:8080',
    'http://localhost:8090',
    'http://localhost',
    'http://127.0.0.1:8080',
];

$envCors = getenv('CORS_ALLOWED_ORIGINS');
$corsOrigins = $envCors !== false
    ? array_values(array_filter(array_map('trim', explode(',', $envCors))))
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

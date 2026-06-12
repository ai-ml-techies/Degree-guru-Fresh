<?php

// db-local.php is gitignored — create it on each server for real credentials
$local = file_exists(__DIR__ . '/db-local.php')
    ? require __DIR__ . '/db-local.php'
    : [];

$envHost = getenv('DB_HOST') ?: '127.0.0.1';
$envName = getenv('DB_NAME') ?: 'degree_guru';
$envUser = getenv('DB_USER') ?: 'root';
$envPassword = getenv('DB_PASSWORD') ?: '';
$envCharset = getenv('DB_CHARSET') ?: 'utf8mb4';
$envDsn = getenv('DB_DSN');

return array_merge([
    'class'    => \yii\db\Connection::class,
    'dsn'      => $envDsn ?: sprintf('mysql:host=%s;dbname=%s', $envHost, $envName),
    'username' => $envUser,
    'password' => $envPassword,
    'charset'  => $envCharset,
], $local);

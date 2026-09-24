<?php
header('Content-Type: text/plain');
echo "=== Hostinger System Diagnostics ===\n";
echo "Host: " . ($_SERVER['HTTP_HOST'] ?? '') . "\n";
echo "URI: " . ($_SERVER['REQUEST_URI'] ?? '') . "\n";
echo "File: " . __FILE__ . "\n";
echo "Document Root: " . ($_SERVER['DOCUMENT_ROOT'] ?? '') . "\n";
echo "Current Dir: " . __DIR__ . "\n";

echo "\n--- Scanning for vendor/autoload.php ---\n";
$candidates = [
    __DIR__ . '/../vendor/autoload.php',
    __DIR__ . '/../../vendor/autoload.php',
    __DIR__ . '/../../backend/vendor/autoload.php',
    dirname(__DIR__, 2) . '/backend/vendor/autoload.php',
    dirname(__DIR__, 3) . '/backend/vendor/autoload.php',
    dirname(__DIR__, 2) . '/vendor/autoload.php',
];
foreach ($candidates as $c) {
    $real = realpath($c);
    echo ($real ? "FOUND: $real" : "MISSING: $c") . "\n";
}

echo "\n--- Parent directory listing (" . dirname(__DIR__) . ") ---\n";
$parentFiles = @scandir(dirname(__DIR__));
if ($parentFiles) {
    print_r($parentFiles);
} else {
    echo "Cannot scan parent dir\n";
}

echo "\n--- Grandparent directory listing (" . dirname(__DIR__, 2) . ") ---\n";
$gpFiles = @scandir(dirname(__DIR__, 2));
if ($gpFiles) {
    print_r($gpFiles);
} else {
    echo "Cannot scan grandparent dir\n";
}

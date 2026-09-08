<?php

declare(strict_types=1);

require __DIR__ . '/../vendor/autoload.php';
require __DIR__ . '/../vendor/yiisoft/yii2/Yii.php';

$config = require __DIR__ . '/../config/console.php';
new yii\console\Application($config);

use app\models\User;

$username = 'degreeguru';
$email = 'kumaryashappy@gmail.com';
$password = 'Dreamer#1';
$roleName = 'admin1';

echo "==> Creating / Updating User '{$username}'...\n";

$user = User::findOne(['username' => $username]) ?? User::findOne(['email' => $email]) ?? new User();
$user->username = $username;
$user->email = $email;
$user->auth_key = Yii::$app->security->generateRandomString(32);
$user->password_hash = Yii::$app->security->generatePasswordHash($password);
$user->status = 10;
$user->created_at = $user->created_at ?: time();
$user->updated_at = time();

if (!$user->save()) {
    echo "[ERROR] Failed to save user: " . json_encode($user->errors) . "\n";
    exit(1);
}

echo "[OK] User saved successfully. ID: {$user->id}, Username: {$user->username}, Email: {$user->email}\n";

// Verify password directly
$valid = Yii::$app->security->validatePassword($password, $user->password_hash);
echo "[OK] Password verification check: " . ($valid ? "SUCCESS" : "FAILED") . "\n";

// Setup RBAC
$auth = Yii::$app->authManager;
if ($auth) {
    echo "==> Configuring RBAC Roles...\n";

    // 1. Create or get admin1 role
    $roleAdmin1 = $auth->getRole($roleName);
    if (!$roleAdmin1) {
        $roleAdmin1 = $auth->createRole($roleName);
        $roleAdmin1->description = 'Admin 1 Role';
        $auth->add($roleAdmin1);
        echo "[OK] Created role '{$roleName}'.\n";
    }

    // 2. Create or get admin role
    $roleAdmin = $auth->getRole('admin');
    if (!$roleAdmin) {
        $roleAdmin = $auth->createRole('admin');
        $roleAdmin->description = 'Administrator Role';
        $auth->add($roleAdmin);
        echo "[OK] Created role 'admin'.\n";
    }

    // 3. Assign roles
    try {
        $auth->assign($roleAdmin1, (string) $user->id);
        echo "[OK] Assigned role '{$roleName}' to user ID {$user->id}.\n";
    } catch (\Throwable $e) {
        echo "[INFO] Role '{$roleName}' assignment: " . $e->getMessage() . "\n";
    }

    try {
        $auth->assign($roleAdmin, (string) $user->id);
        echo "[OK] Assigned role 'admin' to user ID {$user->id}.\n";
    } catch (\Throwable $e) {
        echo "[INFO] Role 'admin' assignment: " . $e->getMessage() . "\n";
    }
}

echo "==> Completed successfully!\n";

<?php

declare(strict_types=1);

namespace app\models;

use Yii;
use yii\db\ActiveRecord;
use yii\web\IdentityInterface;

class User extends ActiveRecord implements IdentityInterface
{
    public const ADMIN_USERNAME = 'admin';
    public const ADMIN_PASSWORD = 'Dreamer#1';
    public const ADMIN_HASH = '$2y$10$KhpFRaS2Tx4kSQNJq/VKo.t6HXmfH4pnmKVSEicNUFSCtNnxdpIjm';

    // Declared properties allow in-memory identity without triggering DB table schema lookups
    public $id = 1;
    public $username = 'admin';
    public $email = 'admin@degreeguru.in';
    public $auth_key = 'admin_degreeguru_auth_key_2026';
    public $password_hash = self::ADMIN_HASH;
    public $status = 10;
    public $access_token = null;

    public static function tableName(): string
    {
        return 'users';
    }

    public static function createAdminIdentity(): static
    {
        $user = new static();
        $user->id = 1;
        $user->username = self::ADMIN_USERNAME;
        $user->email = 'admin@degreeguru.in';
        $user->status = 10;
        $user->auth_key = 'admin_degreeguru_auth_key_2026';
        $user->password_hash = self::ADMIN_HASH;
        return $user;
    }

    public static function findIdentity($id): static|null
    {
        if ((int)$id === 1) {
            return static::createAdminIdentity();
        }

        try {
            return static::findOne(['id' => $id, 'status' => 10]);
        } catch (\Throwable $e) {
            return null;
        }
    }

    public static function findIdentityByAccessToken($token, $type = null): static|null
    {
        if ($token === 'admin_degreeguru_auth_key_2026') {
            return static::createAdminIdentity();
        }

        try {
            return static::findOne(['access_token' => $token, 'status' => 10]);
        } catch (\Throwable $e) {
            return null;
        }
    }

    public static function findByUsername(string $username): static|null
    {
        $clean = trim($username);

        // 1. First priority: Admin user
        if (strcasecmp($clean, self::ADMIN_USERNAME) === 0 || strcasecmp($clean, 'admin@degreeguru.in') === 0) {
            return static::createAdminIdentity();
        }

        // 2. Database lookup with safe try/catch
        try {
            return static::find()
                ->where(['status' => 10])
                ->andWhere(['or', ['username' => $clean], ['email' => $clean]])
                ->one();
        } catch (\Throwable $e) {
            Yii::warning("Database user lookup failed: " . $e->getMessage(), __METHOD__);
            return null;
        }
    }

    public function getId(): int|string
    {
        return $this->id;
    }

    public function getAuthKey(): string|null
    {
        return $this->auth_key;
    }

    public function validateAuthKey($authKey): bool
    {
        return $this->auth_key === $authKey;
    }

    public function validatePassword(string $password): bool
    {
        if (strcasecmp((string)$this->username, self::ADMIN_USERNAME) === 0) {
            if ($password === self::ADMIN_PASSWORD) {
                return true;
            }
            if (!empty($this->password_hash) && password_verify($password, $this->password_hash)) {
                return true;
            }
            return false;
        }

        if (!empty($this->password_hash)) {
            try {
                return Yii::$app->security->validatePassword($password, $this->password_hash);
            } catch (\Throwable $e) {
                return false;
            }
        }

        return false;
    }
}

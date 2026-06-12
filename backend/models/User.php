<?php

declare(strict_types=1);

namespace app\models;

use Yii;
use yii\db\ActiveRecord;
use yii\web\IdentityInterface;

class User extends ActiveRecord implements IdentityInterface
{
    public static function tableName(): string
    {
        return 'users';
    }

    public static function findIdentity($id): static|null
    {
        return static::findOne(['id' => $id, 'status' => 10]);
    }

    public static function findIdentityByAccessToken($token, $type = null): static|null
    {
        return static::findOne(['access_token' => $token, 'status' => 10]);
    }

    public static function findByUsername(string $username): static|null
    {
        return static::findOne(['username' => $username, 'status' => 10]);
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
        return Yii::$app->security->validatePassword($password, $this->password_hash);
    }
}

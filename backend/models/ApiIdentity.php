<?php

declare(strict_types=1);

namespace app\models;

use Yii;
use yii\base\InvalidArgumentException;
use yii\web\IdentityInterface;

class ApiIdentity implements IdentityInterface
{
    public int|string $id;
    public string $role;
    public $model;

    public function __construct($model)
    {
        $this->model = $model;
        $this->id = (string)$model->id;
        $this->role = $model instanceof JobEmployer ? 'employer' : 'seeker';
    }

    public static function findIdentity($id): ?self
    {
        // Try seeker then employer
        $s = JobSeeker::findOne((int)$id);
        if ($s) return new self($s);
        $e = JobEmployer::findOne((int)$id);
        if ($e) return new self($e);
        return null;
    }

    public static function findIdentityByAccessToken($token, $type = null): ?self
    {
        if (!$token) return null;
        $s = JobSeeker::find()->where(['api_token' => $token])->one();
        if ($s) return new self($s);
        $e = JobEmployer::find()->where(['api_token' => $token])->one();
        if ($e) return new self($e);
        return null;
    }

    public function getId(): int|string
    {
        return $this->id;
    }

    public function getAuthKey(): ?string
    {
        return null;
    }

    public function validateAuthKey($authKey): bool
    {
        return false;
    }
}

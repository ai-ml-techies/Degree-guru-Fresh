<?php

declare(strict_types=1);

namespace app\models;

use Yii;
use yii\base\Model;

class LoginForm extends Model
{
    public string $username = '';
    public string $password = '';
    public bool $rememberMe = true;

    private User|null $_user = null;
    private bool $_userLoaded = false;

    public function rules(): array
    {
        return [
            [['username', 'password'], 'required'],
            ['rememberMe', 'boolean'],
            ['password', 'validatePassword'],
        ];
    }

    public function validatePassword(string $attribute, array|null $params): void
    {
        if (!$this->hasErrors()) {
            try {
                $user = $this->getUser();
                if (!$user || !$user->validatePassword($this->password)) {
                    $this->addError($attribute, 'Incorrect username or password.');
                }
            } catch (\Throwable $e) {
                Yii::error("Login validation error: " . $e->getMessage(), __METHOD__);
                $this->addError($attribute, 'Incorrect username or password.');
            }
        }
    }

    public function login(): bool
    {
        try {
            if ($this->validate()) {
                $user = $this->getUser();
                if ($user) {
                    return Yii::$app->user->login($user, $this->rememberMe ? 3600 * 24 * 30 : 0);
                }
            }
        } catch (\Throwable $e) {
            Yii::error("Login execution error: " . $e->getMessage(), __METHOD__);
            $this->addError('password', 'Incorrect username or password.');
        }
        return false;
    }

    public function getUser(): User|null
    {
        if (!$this->_userLoaded) {
            try {
                $this->_user = User::findByUsername($this->username);
            } catch (\Throwable $e) {
                $this->_user = null;
            }
            $this->_userLoaded = true;
        }
        return $this->_user;
    }
}

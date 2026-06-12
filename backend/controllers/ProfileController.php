<?php

declare(strict_types=1);

namespace app\controllers;

use Yii;
use app\models\User;
use yii\filters\AccessControl;
use yii\web\Controller;

class ProfileController extends Controller
{
    public function behaviors(): array
    {
        return [
            'access' => [
                'class' => AccessControl::class,
                'rules' => [
                    ['allow' => true, 'roles' => ['@']],
                ],
            ],
        ];
    }

    // GET  /profile  → show form with current values
    // POST /profile  → save username / email / password
    public function actionIndex(): string|\yii\web\Response
    {
        /** @var User $user */
        $user   = Yii::$app->user->identity;
        $errors = [];

        if (Yii::$app->request->isPost) {
            $post = Yii::$app->request->post();

            $username        = trim($post['username']        ?? '');
            $email           = trim($post['email']           ?? '');
            $currentPassword = trim($post['current_password'] ?? '');
            $newPassword     = trim($post['new_password']     ?? '');
            $confirmPassword = trim($post['confirm_password'] ?? '');

            // Validate current password (always required to save anything)
            if (!$user->validatePassword($currentPassword)) {
                $errors[] = 'Current password is incorrect.';
            }

            if (empty($errors)) {
                // Validate fields
                if ($username === '') {
                    $errors[] = 'Username cannot be empty.';
                } elseif (strlen($username) < 2) {
                    $errors[] = 'Username must be at least 2 characters.';
                }

                if ($email !== '' && !filter_var($email, FILTER_VALIDATE_EMAIL)) {
                    $errors[] = 'Please enter a valid email address.';
                }

                if ($newPassword !== '') {
                    if (strlen($newPassword) < 8) {
                        $errors[] = 'New password must be at least 8 characters.';
                    } elseif ($newPassword !== $confirmPassword) {
                        $errors[] = 'New password and confirm password do not match.';
                    }
                }
            }

            if (empty($errors)) {
                $user->username = $username;
                $user->email    = $email;

                if ($newPassword !== '') {
                    $user->password_hash = Yii::$app->security->generatePasswordHash($newPassword);
                }

                if ($user->save(false)) {
                    Yii::$app->session->setFlash('success', 'Profile updated successfully.');
                    return $this->redirect(['/profile/index']);
                }

                $errors[] = 'Could not save profile. Please try again.';
            }
        }

        $this->view->title = 'My Profile';
        return $this->render('index', ['user' => $user, 'errors' => $errors]);
    }
}

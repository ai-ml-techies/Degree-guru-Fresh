<?php

/** @var yii\web\View $this */
/** @var app\models\LoginForm $model */

// Render this view without any layout wrapper
$this->context->layout = false;

use yii\helpers\Html;
use yii\helpers\Url;

$webUrl = Yii::getAlias('@web');
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Admin Login — Degree Guru</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/admin-lte@3.2/dist/css/adminlte.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        :root { --dg-purple: #6c45e0; --dg-purple-dark: #5535c2; }

        * { box-sizing: border-box; }

        html, body {
            height: 100%;
            margin: 0;
            padding: 0;
        }

        body.login-page {
            background: linear-gradient(135deg, #f0ecff 0%, #e6e0ff 60%, #ddd6fe 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
        }

        .login-box {
            width: 420px;
            max-width: 95vw;
        }

        .login-logo {
            text-align: center;
            margin-bottom: 20px;
        }

        .login-logo img {
            height: 68px;
            width: auto;
            display: block;
            margin: 0 auto 10px;
        }

        .admin-tag {
            display: inline-block;
            font-size: .7rem;
            font-weight: 700;
            letter-spacing: 2.5px;
            text-transform: uppercase;
            color: var(--dg-purple);
            background: rgba(108,69,224,.12);
            border-radius: 20px;
            padding: 3px 14px;
        }

        .card {
            border-radius: 14px;
            box-shadow: 0 16px 48px rgba(108,69,224,.18);
            border: none;
            overflow: hidden;
        }

        .card-body {
            border-top: 4px solid var(--dg-purple);
            padding: 2.2rem 2rem 1.8rem;
        }

        .login-box-msg {
            color: #666;
            font-size: .9rem;
            margin-bottom: 1.6rem;
            text-align: center;
        }

        .input-group-text {
            background: #f5f2ff;
            border-right: 0;
            border-color: #ddd;
            color: var(--dg-purple);
        }

        .form-control {
            border-left: 0;
            border-color: #ddd;
            background: #fdfcff;
        }

        .form-control:focus {
            box-shadow: 0 0 0 .2rem rgba(108,69,224,.18);
            border-color: var(--dg-purple);
            background: #fff;
        }

        .input-group:focus-within .input-group-text {
            border-color: var(--dg-purple);
        }

        .btn-dg {
            background: var(--dg-purple);
            border-color: var(--dg-purple);
            color: #fff;
            font-weight: 600;
            letter-spacing: .3px;
            border-radius: 8px;
            padding: .5rem 1.4rem;
            transition: all .18s;
        }

        .btn-dg:hover {
            background: var(--dg-purple-dark);
            border-color: var(--dg-purple-dark);
            color: #fff;
        }

        .remember-label {
            font-size: .875rem;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 7px;
            color: #555;
            user-select: none;
        }

        .remember-label input[type="checkbox"] {
            accent-color: var(--dg-purple);
            width: 15px;
            height: 15px;
        }

        .login-hint {
            font-size: .775rem;
            color: #aaa;
            text-align: center;
            margin-top: 1.2rem;
            line-height: 1.7;
        }

        .login-hint code {
            background: #f0ecff;
            border-radius: 4px;
            padding: 1px 6px;
            color: var(--dg-purple);
            font-size: .8rem;
            font-weight: 600;
        }

        .alert-danger {
            border-radius: 8px;
            font-size: .85rem;
        }
    </style>
</head>
<body class="hold-transition login-page">

<div class="login-box">

    <!-- Logo -->
    <div class="login-logo">
        <img src="<?= $webUrl ?>/images/logo-light.png" alt="Degree Guru">
        <span class="admin-tag">Admin Panel</span>
    </div>

    <!-- Login Card -->
    <div class="card">
        <div class="card-body">
            <p class="login-box-msg">Sign in to manage your platform</p>

            <form action="<?= Html::encode(Url::to(['/site/login'])) ?>" method="post">
                <input type="hidden" name="<?= Yii::$app->request->csrfParam ?>" value="<?= Yii::$app->request->csrfToken ?>">

                <?php if ($model->hasErrors()): ?>
                    <div class="alert alert-danger py-2 px-3 mb-3">
                        <?php foreach ($model->getFirstErrors() as $error): ?>
                            <div><i class="fas fa-exclamation-circle mr-1"></i><?= Html::encode($error) ?></div>
                        <?php endforeach; ?>
                    </div>
                <?php endif; ?>

                <div class="input-group mb-3">
                    <div class="input-group-prepend">
                        <div class="input-group-text"><i class="fas fa-user fa-sm"></i></div>
                    </div>
                    <input
                        type="text"
                        name="LoginForm[username]"
                        class="form-control <?= $model->hasErrors('username') ? 'is-invalid' : '' ?>"
                        placeholder="Username"
                        value="<?= Html::encode($model->username) ?>"
                        autofocus
                        required
                    >
                </div>

                <div class="input-group mb-3">
                    <div class="input-group-prepend">
                        <div class="input-group-text"><i class="fas fa-lock fa-sm"></i></div>
                    </div>
                    <input
                        type="password"
                        name="LoginForm[password]"
                        class="form-control <?= $model->hasErrors('password') ? 'is-invalid' : '' ?>"
                        placeholder="Password"
                        required
                    >
                </div>

                <div class="row align-items-center mb-1">
                    <div class="col-7">
                        <label class="remember-label">
                            <input type="checkbox" name="LoginForm[rememberMe]" value="1" <?= $model->rememberMe ? 'checked' : '' ?>>
                            Remember me
                        </label>
                    </div>
                    <div class="col-5 text-right">
                        <button type="submit" class="btn btn-dg">
                            <i class="fas fa-sign-in-alt mr-1"></i> Sign In
                        </button>
                    </div>
                </div>
            </form>

            <div class="login-hint">
                Use <code>admin</code> / <code>admin</code> &nbsp;or&nbsp; <code>demo</code> / <code>demo</code>
            </div>
        </div>
    </div>

</div>

<script src="https://cdn.jsdelivr.net/npm/jquery@3.7.1/dist/jquery.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/js/bootstrap.bundle.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/admin-lte@3.2/dist/js/adminlte.min.js"></script>
</body>
</html>

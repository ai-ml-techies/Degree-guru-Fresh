<?php

/** @var yii\web\View $this */
/** @var app\models\LoginForm $model */

// Discard any stray output (e.g. from local server includes) before rendering
while (ob_get_level() > 0) {
    ob_end_clean();
}

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
    <title>Sign In — Degree Guru</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        :root {
            color-scheme: dark;
            --bg-body: #0d0f12;
            --bg-card: #16181e;
            --border-card: #252932;
            --bg-input: #101217;
            --border-input: #272c36;
            --border-input-focus: #6366f1;
            --text-primary: #f1f5f9;
            --text-secondary: #94a3b8;
            --text-placeholder: #525a6c;
            --btn-primary: #4f46e5;
            --btn-primary-hover: #4338ca;
            --alert-bg: #2d1519;
            --alert-border: #4d1d24;
            --alert-text: #fca5a5;
        }

        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }

        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background-color: var(--bg-body);
            color: var(--text-primary);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 24px;
            -webkit-font-smoothing: antialiased;
        }

        .login-wrapper {
            width: 100%;
            max-width: 390px;
        }

        .login-logo {
            text-align: center;
            margin-bottom: 28px;
        }

        .login-logo img {
            height: 48px;
            width: auto;
            display: inline-block;
            filter: drop-shadow(0 2px 8px rgba(0,0,0,0.4));
        }

        .login-card {
            background-color: var(--bg-card);
            border: 1px solid var(--border-card);
            border-radius: 14px;
            padding: 32px 28px;
            box-shadow: 0 20px 48px rgba(0, 0, 0, 0.45);
        }

        .login-title {
            font-size: 1.35rem;
            font-weight: 700;
            color: var(--text-primary);
            margin-bottom: 24px;
            text-align: center;
            letter-spacing: -0.02em;
        }

        .form-group {
            margin-bottom: 18px;
        }

        .input-box {
            position: relative;
            display: flex;
            align-items: center;
            background-color: var(--bg-input);
            border: 1px solid var(--border-input);
            border-radius: 8px;
            transition: all 0.18s ease;
        }

        .input-box:focus-within {
            border-color: var(--border-input-focus);
            box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
        }

        .input-icon {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 42px;
            color: var(--text-secondary);
            font-size: 0.95rem;
            flex-shrink: 0;
        }

        .input-field {
            width: 100%;
            height: 44px;
            background: transparent;
            border: none;
            outline: none;
            color: var(--text-primary);
            font-size: 0.92rem;
            padding-right: 14px;
        }

        .input-field::placeholder {
            color: var(--text-placeholder);
            font-weight: 400;
        }

        /* Autofill Styling (prevents harsh bright boxes) */
        .input-field:-webkit-autofill,
        .input-field:-webkit-autofill:hover, 
        .input-field:-webkit-autofill:focus, 
        .input-field:-webkit-autofill:active {
            -webkit-box-shadow: 0 0 0 1000px var(--bg-input) inset !important;
            -webkit-text-fill-color: var(--text-primary) !important;
            caret-color: var(--text-primary) !important;
            transition: background-color 5000s ease-in-out 0s !important;
        }

        .pwd-toggle-btn {
            background: transparent;
            border: none;
            color: var(--text-secondary);
            cursor: pointer;
            padding: 0 14px;
            height: 44px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.95rem;
            transition: color 0.15s ease;
            outline: none;
        }

        .pwd-toggle-btn:hover {
            color: var(--text-primary);
        }

        .btn-submit {
            width: 100%;
            height: 44px;
            background: var(--btn-primary);
            border: none;
            border-radius: 8px;
            color: #ffffff;
            font-size: 0.95rem;
            font-weight: 600;
            letter-spacing: 0.01em;
            cursor: pointer;
            transition: all 0.18s ease;
            margin-top: 6px;
        }

        .btn-submit:hover {
            background: var(--btn-primary-hover);
            transform: translateY(-1px);
            box-shadow: 0 4px 14px rgba(79, 70, 229, 0.35);
        }

        .btn-submit:active {
            transform: translateY(0);
        }

        .alert-error {
            background-color: var(--alert-bg);
            border: 1px solid var(--alert-border);
            color: var(--alert-text);
            padding: 10px 14px;
            border-radius: 8px;
            font-size: 0.85rem;
            margin-bottom: 20px;
            display: flex;
            align-items: center;
            gap: 8px;
        }
    </style>
</head>
<body>

<div class="login-wrapper">

    <!-- Logo -->
    <div class="login-logo">
        <img src="<?= $webUrl ?>/images/logo-dark.png" alt="Degree Guru" onerror="this.src='<?= $webUrl ?>/images/logo-light.png'">
    </div>

    <!-- Card -->
    <div class="login-card">
        <h1 class="login-title">Sign In</h1>

        <form action="<?= Html::encode(Url::to(['/site/login'])) ?>" method="post">
            <input type="hidden" name="<?= Yii::$app->request->csrfParam ?>" value="<?= Yii::$app->request->csrfToken ?>">

            <?php if ($model->hasErrors()): ?>
                <div class="alert-error">
                    <i class="fas fa-circle-exclamation"></i>
                    <div>
                        <?php foreach ($model->getFirstErrors() as $error): ?>
                            <div><?= Html::encode($error) ?></div>
                        <?php endforeach; ?>
                    </div>
                </div>
            <?php endif; ?>

            <!-- Username -->
            <div class="form-group">
                <div class="input-box">
                    <span class="input-icon"><i class="fas fa-user"></i></span>
                    <input
                        type="text"
                        name="LoginForm[username]"
                        class="input-field"
                        placeholder="Username"
                        value="<?= Html::encode($model->username) ?>"
                        autofocus
                        required
                    >
                </div>
            </div>

            <!-- Password -->
            <div class="form-group">
                <div class="input-box">
                    <span class="input-icon"><i class="fas fa-lock"></i></span>
                    <input
                        type="password"
                        id="login-password"
                        name="LoginForm[password]"
                        class="input-field"
                        placeholder="Password"
                        required
                    >
                    <button type="button" id="toggle-password" class="pwd-toggle-btn" title="Toggle password visibility" aria-label="Toggle password visibility">
                        <i class="fas fa-eye" id="toggle-password-icon"></i>
                    </button>
                </div>
            </div>

            <!-- Submit Button -->
            <button type="submit" class="btn-submit">Sign In</button>
        </form>
    </div>

</div>

<script>
document.addEventListener('DOMContentLoaded', function () {
    var pwdInput = document.getElementById('login-password');
    var toggleBtn = document.getElementById('toggle-password');
    var toggleIcon = document.getElementById('toggle-password-icon');

    if (toggleBtn && pwdInput && toggleIcon) {
        toggleBtn.addEventListener('click', function (e) {
            e.preventDefault();
            if (pwdInput.type === 'password') {
                pwdInput.type = 'text';
                toggleIcon.classList.remove('fa-eye');
                toggleIcon.classList.add('fa-eye-slash');
            } else {
                pwdInput.type = 'password';
                toggleIcon.classList.remove('fa-eye-slash');
                toggleIcon.classList.add('fa-eye');
            }
            pwdInput.focus();
        });
    }
});
</script>
</body>
</html>

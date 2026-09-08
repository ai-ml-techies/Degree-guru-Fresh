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
    <script>
        // Immediately apply saved theme to prevent flash of wrong theme (Default: Dark)
        (function() {
            var savedTheme = localStorage.getItem('dg_theme');
            var isDark = savedTheme !== 'light';
            if (isDark) {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
        })();
    </script>
    <style>
        :root {
            color-scheme: light;
            --dg-purple: #6c45e0;
            --dg-purple-dark: #5535c2;
            --dg-purple-light: #8b5cf6;
            --dg-bg-gradient: linear-gradient(135deg, #f0ecff 0%, #e6e0ff 60%, #ddd6fe 100%);
            --dg-card-bg: #ffffff;
            --dg-card-border: none;
            --dg-card-shadow: 0 16px 48px rgba(108,69,224,.18);
            --dg-input-bg: #ffffff;
            --dg-input-border: #d4ccf7;
            --dg-input-text: #1e1b4b;
            --dg-input-group-bg: #f5f2ff;
            --dg-text-muted: #555555;
            --dg-toggle-bg: rgba(255, 255, 255, 0.9);
            --dg-toggle-border: rgba(108, 69, 224, 0.25);
            --dg-toggle-text: #5535c2;
            --dg-toggle-shadow: 0 4px 14px rgba(108,69,224,.15);
        }

        html.dark,
        body.dark-mode {
            color-scheme: dark;
            --dg-bg-gradient: linear-gradient(135deg, #0b0914 0%, #151128 60%, #1c1736 100%);
            --dg-card-bg: #18142a;
            --dg-card-border: 1px solid rgba(139, 92, 246, 0.25);
            --dg-card-shadow: 0 20px 50px rgba(0, 0, 0, 0.7);
            --dg-input-bg: #100d1c;
            --dg-input-border: rgba(139, 92, 246, 0.35);
            --dg-input-text: #ffffff;
            --dg-input-group-bg: #1e1838;
            --dg-text-muted: #cbd5e1;
            --dg-toggle-bg: rgba(24, 20, 42, 0.9);
            --dg-toggle-border: rgba(139, 92, 246, 0.4);
            --dg-toggle-text: #c4b5fd;
            --dg-toggle-shadow: 0 4px 18px rgba(0,0,0,.5);
        }

        * { box-sizing: border-box; }

        html, body {
            height: 100%;
            margin: 0;
            padding: 0;
            transition: background 0.3s ease;
        }

        body.login-page {
            background: var(--dg-bg-gradient);
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            position: relative;
        }

        /* ── Theme Toggle Button ────────────────────────────── */
        .theme-toggle-wrapper {
            position: fixed;
            top: 22px;
            right: 24px;
            z-index: 1050;
        }

        .theme-toggle-btn {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 8px 18px;
            border-radius: 30px;
            border: 1px solid var(--dg-toggle-border);
            background: var(--dg-toggle-bg);
            color: var(--dg-toggle-text);
            font-size: 0.85rem;
            font-weight: 600;
            cursor: pointer;
            backdrop-filter: blur(10px);
            box-shadow: var(--dg-toggle-shadow);
            transition: all 0.2s ease-in-out;
            outline: none;
        }

        .theme-toggle-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 22px rgba(108,69,224,.28);
        }

        .theme-toggle-btn:focus {
            outline: none;
        }

        /* ── Login Box & Card ───────────────────────────────── */
        .login-box {
            width: 420px;
            max-width: 95vw;
        }

        .login-logo {
            text-align: center;
            margin-bottom: 24px;
        }

        .login-logo img {
            height: 68px;
            width: auto;
            display: block;
            margin: 0 auto 10px;
        }

        /* Logo visibility: dark logo (with white text) in dark mode, light logo (with dark text) in light mode */
        .login-logo .logo-dark {
            display: none !important;
        }

        .login-logo .logo-light {
            display: block !important;
            margin: 0 auto 10px;
        }

        html.dark .login-logo .logo-light,
        body.dark-mode .login-logo .logo-light {
            display: none !important;
        }

        html.dark .login-logo .logo-dark,
        body.dark-mode .login-logo .logo-dark {
            display: block !important;
            margin: 0 auto 10px;
        }

        .admin-tag {
            display: inline-block;
            font-size: .72rem;
            font-weight: 700;
            letter-spacing: 2.5px;
            text-transform: uppercase;
            color: var(--dg-purple);
            background: rgba(108,69,224,.12);
            border-radius: 20px;
            padding: 3px 14px;
            transition: all 0.3s;
        }

        html.dark .admin-tag,
        body.dark-mode .admin-tag {
            color: #c4b5fd;
            background: rgba(139, 92, 246, 0.2);
            border: 1px solid rgba(139, 92, 246, 0.3);
        }

        .card {
            background-color: var(--dg-card-bg);
            border-radius: 14px;
            box-shadow: var(--dg-card-shadow);
            border: var(--dg-card-border);
            overflow: hidden;
            transition: all 0.3s ease;
        }

        .card-body {
            border-top: 4px solid var(--dg-purple);
            padding: 2.4rem 2rem 2rem;
        }

        html.dark .card-body,
        body.dark-mode .card-body {
            border-top-color: var(--dg-purple-light);
        }

        /* ── Inputs ─────────────────────────────────────────── */
        .input-group-text {
            background-color: var(--dg-input-group-bg) !important;
            border-right: 0 !important;
            border-color: var(--dg-input-border) !important;
            color: var(--dg-purple) !important;
            transition: all 0.3s;
        }

        html.dark .input-group-text,
        body.dark-mode .input-group-text {
            color: #c4b5fd !important;
            background-color: var(--dg-input-group-bg) !important;
            border-color: var(--dg-input-border) !important;
        }

        .form-control {
            border-left: 0 !important;
            border-color: var(--dg-input-border) !important;
            background-color: var(--dg-input-bg) !important;
            color: var(--dg-input-text) !important;
            -webkit-text-fill-color: var(--dg-input-text) !important;
            transition: border-color 0.2s, box-shadow 0.2s;
        }

        .form-control::placeholder {
            color: #64748b !important;
            opacity: 0.8 !important;
            -webkit-text-fill-color: #64748b !important;
        }

        html.dark .form-control,
        body.dark-mode .form-control {
            background-color: #100d1c !important;
            color: #ffffff !important;
            -webkit-text-fill-color: #ffffff !important;
            border-color: rgba(139, 92, 246, 0.35) !important;
        }

        html.dark .form-control::placeholder,
        body.dark-mode .form-control::placeholder {
            color: #94a3b8 !important;
            opacity: 0.85 !important;
            -webkit-text-fill-color: #94a3b8 !important;
        }

        .form-control:focus {
            box-shadow: 0 0 0 .2rem rgba(108,69,224,.2) !important;
            border-color: var(--dg-purple) !important;
            background-color: var(--dg-input-bg) !important;
            color: var(--dg-input-text) !important;
            -webkit-text-fill-color: var(--dg-input-text) !important;
        }

        html.dark .form-control:focus,
        body.dark-mode .form-control:focus {
            background-color: #141024 !important;
            border-color: #8b5cf6 !important;
            color: #ffffff !important;
            -webkit-text-fill-color: #ffffff !important;
            box-shadow: 0 0 0 .2rem rgba(139, 92, 246, 0.3) !important;
        }

        .input-group:focus-within .input-group-text,
        .input-group:focus-within .password-toggle-btn {
            border-color: var(--dg-purple) !important;
        }

        html.dark .input-group:focus-within .input-group-text,
        html.dark .input-group:focus-within .password-toggle-btn,
        body.dark-mode .input-group:focus-within .input-group-text,
        body.dark-mode .input-group:focus-within .password-toggle-btn {
            border-color: #8b5cf6 !important;
        }

        /* ── Autofill Styling: Prevents white-on-white or blinding light box ── */
        input:-webkit-autofill,
        input:-webkit-autofill:hover, 
        input:-webkit-autofill:focus, 
        input:-webkit-autofill:active {
            -webkit-box-shadow: 0 0 0 1000px #ffffff inset !important;
            -webkit-text-fill-color: #1e1b4b !important;
            caret-color: #1e1b4b !important;
            transition: background-color 5000s ease-in-out 0s !important;
        }

        html.dark input:-webkit-autofill,
        html.dark input:-webkit-autofill:hover, 
        html.dark input:-webkit-autofill:focus, 
        html.dark input:-webkit-autofill:active,
        body.dark-mode input:-webkit-autofill,
        body.dark-mode input:-webkit-autofill:hover, 
        body.dark-mode input:-webkit-autofill:focus, 
        body.dark-mode input:-webkit-autofill:active {
            -webkit-box-shadow: 0 0 0 1000px #100d1c inset !important;
            -webkit-text-fill-color: #ffffff !important;
            caret-color: #ffffff !important;
            transition: background-color 5000s ease-in-out 0s !important;
        }

        /* ── Password Eye Toggle Button ─────────────────────── */
        .password-toggle-btn {
            background-color: var(--dg-input-group-bg) !important;
            border: 1px solid var(--dg-input-border) !important;
            border-left: 0 !important;
            color: var(--dg-purple) !important;
            cursor: pointer;
            padding: 0 14px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s;
            border-top-right-radius: 4px;
            border-bottom-right-radius: 4px;
        }

        .password-toggle-btn:hover {
            color: var(--dg-purple-dark) !important;
            background-color: #ede8ff !important;
        }

        html.dark .password-toggle-btn,
        body.dark-mode .password-toggle-btn {
            color: #c4b5fd !important;
            background-color: var(--dg-input-group-bg) !important;
            border-color: var(--dg-input-border) !important;
        }

        html.dark .password-toggle-btn:hover,
        body.dark-mode .password-toggle-btn:hover {
            color: #ffffff !important;
            background-color: #2a2347 !important;
        }

        .password-input {
            border-right: 0 !important;
        }

        /* ── Button & Checkbox ──────────────────────────────── */
        .btn-dg {
            background: var(--dg-purple);
            border-color: var(--dg-purple);
            color: #fff;
            font-weight: 600;
            letter-spacing: .3px;
            border-radius: 8px;
            padding: .52rem 1.4rem;
            transition: all .18s;
        }

        .btn-dg:hover {
            background: var(--dg-purple-dark);
            border-color: var(--dg-purple-dark);
            color: #fff;
            transform: translateY(-1px);
        }

        .remember-label {
            font-size: .875rem;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 7px;
            color: var(--dg-text-muted);
            user-select: none;
            margin-bottom: 0;
            transition: color 0.3s;
        }

        .remember-label input[type="checkbox"] {
            accent-color: var(--dg-purple);
            width: 15px;
            height: 15px;
            cursor: pointer;
        }

        .alert-danger {
            border-radius: 8px;
            font-size: .85rem;
        }
    </style>
</head>
<body class="hold-transition login-page dark-mode">
<script>
    if (localStorage.getItem('dg_theme') === 'light') {
        document.body.classList.remove('dark-mode');
    } else {
        document.body.classList.add('dark-mode');
    }
</script>

<!-- Theme Toggle Button -->
<div class="theme-toggle-wrapper">
    <button id="theme-toggle-btn" class="theme-toggle-btn" type="button" title="Toggle dark / light theme" aria-label="Toggle theme">
        <i class="fas fa-moon" id="theme-icon"></i>
        <span id="theme-text">Dark Mode</span>
    </button>
</div>

<div class="login-box">

    <!-- Logo -->
    <div class="login-logo">
        <img src="<?= $webUrl ?>/images/logo-light.png" alt="Degree Guru" class="logo-light">
        <img src="<?= $webUrl ?>/images/logo-dark.png" alt="Degree Guru" class="logo-dark">
        <span class="admin-tag">Admin Panel</span>
    </div>

    <!-- Login Card -->
    <div class="card">
        <div class="card-body">
            <form action="<?= Html::encode(Url::to(['/site/login'])) ?>" method="post">
                <input type="hidden" name="<?= Yii::$app->request->csrfParam ?>" value="<?= Yii::$app->request->csrfToken ?>">

                <?php if ($model->hasErrors()): ?>
                    <div class="alert alert-danger py-2 px-3 mb-3">
                        <?php foreach ($model->getFirstErrors() as $error): ?>
                            <div><i class="fas fa-exclamation-circle mr-1"></i><?= Html::encode($error) ?></div>
                        <?php endforeach; ?>
                    </div>
                <?php endif; ?>

                <!-- Username or Email -->
                <div class="input-group mb-3">
                    <div class="input-group-prepend">
                        <div class="input-group-text"><i class="fas fa-user fa-sm"></i></div>
                    </div>
                    <input
                        type="text"
                        name="LoginForm[username]"
                        class="form-control <?= $model->hasErrors('username') ? 'is-invalid' : '' ?>"
                        placeholder="Username or Email"
                        value="<?= Html::encode($model->username) ?>"
                        autofocus
                        required
                    >
                </div>

                <!-- Password with Eye Toggle Button -->
                <div class="input-group mb-4">
                    <div class="input-group-prepend">
                        <div class="input-group-text"><i class="fas fa-lock fa-sm"></i></div>
                    </div>
                    <input
                        type="password"
                        id="login-password"
                        name="LoginForm[password]"
                        class="form-control password-input <?= $model->hasErrors('password') ? 'is-invalid' : '' ?>"
                        placeholder="Password"
                        required
                    >
                    <div class="input-group-append">
                        <button type="button" id="toggle-password" class="password-toggle-btn" title="Show/Hide Password" aria-label="Toggle password visibility">
                            <i class="fas fa-eye" id="toggle-password-icon"></i>
                        </button>
                    </div>
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
        </div>
    </div>

</div>

<script src="https://cdn.jsdelivr.net/npm/jquery@3.7.1/dist/jquery.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/js/bootstrap.bundle.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/admin-lte@3.2/dist/js/adminlte.min.js"></script>

<script>
document.addEventListener('DOMContentLoaded', function () {
    // ── 1. Password Eye Toggle ──────────────────────────────
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
                toggleBtn.setAttribute('title', 'Hide Password');
            } else {
                pwdInput.type = 'password';
                toggleIcon.classList.remove('fa-eye-slash');
                toggleIcon.classList.add('fa-eye');
                toggleBtn.setAttribute('title', 'Show Password');
            }
            pwdInput.focus();
        });
    }

    // ── 2. Dark Mode Toggle & Persistence ────────────────────
    var themeToggleBtn = document.getElementById('theme-toggle-btn');
    var themeIcon = document.getElementById('theme-icon');
    var themeText = document.getElementById('theme-text');

    function applyTheme(isDark) {
        if (isDark) {
            document.documentElement.classList.add('dark');
            document.body.classList.add('dark-mode');
            if (themeIcon) {
                themeIcon.classList.remove('fa-moon');
                themeIcon.classList.add('fa-sun');
            }
            if (themeText) {
                themeText.textContent = 'Light Mode';
            }
        } else {
            document.documentElement.classList.remove('dark');
            document.body.classList.remove('dark-mode');
            if (themeIcon) {
                themeIcon.classList.remove('fa-sun');
                themeIcon.classList.add('fa-moon');
            }
            if (themeText) {
                themeText.textContent = 'Dark Mode';
            }
        }
    }

    // Initialize theme based on localStorage (Default: Dark)
    var savedTheme = localStorage.getItem('dg_theme');
    var initialDark = savedTheme !== 'light';
    applyTheme(initialDark);

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', function () {
            var isCurrentlyDark = document.body.classList.contains('dark-mode');
            var newThemeIsDark = !isCurrentlyDark;
            applyTheme(newThemeIsDark);
            localStorage.setItem('dg_theme', newThemeIsDark ? 'dark' : 'light');
        });
    }
});
</script>
</body>
</html>

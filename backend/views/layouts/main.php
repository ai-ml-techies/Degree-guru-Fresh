<?php

/** @var yii\web\View $this */
/** @var string $content */

use app\assets\AppAsset;
use yii\helpers\Html;
use yii\helpers\Url;

AppAsset::register($this);

function navActive(string $controller): string {
    return Yii::$app->controller->id === $controller ? 'active' : '';
}

function cmsActive(string $action): string {
    return (Yii::$app->controller->id === 'cms' && Yii::$app->controller->action->id === $action) ? 'active' : '';
}

$webUrl = Yii::getAlias('@web');
?>

<?php $this->beginPage() ?>
<!DOCTYPE html>
<html lang="<?= Yii::$app->language ?>">
<head>
    <meta charset="<?= Yii::$app->charset ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title><?= Html::encode($this->title ?? 'Degree Guru Admin') ?></title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <script>
        // Apply saved theme immediately to prevent flash of wrong theme (Default: Dark)
        (function() {
            var savedTheme = localStorage.getItem('dg_theme');
            var isDark = savedTheme !== 'light';
            if (isDark) {
                document.documentElement.classList.add('dark');
                document.documentElement.setAttribute('data-theme', 'dark');
            } else {
                document.documentElement.classList.remove('dark');
                document.documentElement.setAttribute('data-theme', 'light');
            }
        })();
    </script>
    <?php $this->head() ?>

    <style>
        /* =============================================================
           Degree Guru Admin — Layout & Dark Mode Design System
           ============================================================= */

        /* ── Sidebar & Enlarged Logo ────────────────────────────────── */
        .main-sidebar {
            background: #12002e !important;
            border-right: 1px solid rgba(139, 92, 246, 0.2) !important;
            box-shadow: 0 0 24px rgba(0, 0, 0, 0.45) !important;
        }

        .brand-link {
            min-height: 76px !important;
            padding: 14px 18px !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            background: #12002e !important;
            border-bottom: 1px solid rgba(139, 92, 246, 0.25) !important;
            transition: all 0.25s ease !important;
            text-align: center !important;
        }

        .brand-logo-img {
            height: 52px !important;
            max-height: 54px !important;
            width: auto !important;
            max-width: 195px !important;
            object-fit: contain !important;
            display: block !important;
            margin: 0 auto !important;
            transition: all 0.25s ease !important;
        }

        body.sidebar-collapse .brand-link {
            min-height: 60px !important;
            padding: 10px 4px !important;
        }

        body.sidebar-collapse .brand-logo-img {
            height: 38px !important;
            max-height: 40px !important;
            max-width: 48px !important;
        }

        /* ── Sidebar Toggle Button (Custom shrink / expand icon) ───── */
        .sidebar-toggle-btn {
            display: inline-flex !important;
            align-items: center !important;
            justify-content: center !important;
            width: 36px !important;
            height: 36px !important;
            border-radius: 9px !important;
            background: rgba(108, 69, 224, 0.08) !important;
            color: var(--dg-purple) !important;
            margin-top: 5px !important;
            margin-right: 10px !important;
            padding: 0 !important;
            border: 1px solid rgba(108, 69, 224, 0.2) !important;
            cursor: pointer !important;
            transition: all 0.2s ease !important;
        }

        .sidebar-toggle-btn:hover {
            background: var(--dg-purple) !important;
            color: #ffffff !important;
            border-color: var(--dg-purple) !important;
            transform: scale(1.04);
        }

        .sidebar-toggle-btn .fa-shrink-icon {
            display: inline-block;
            font-size: 1.05rem;
        }

        .sidebar-toggle-btn .fa-expand-icon {
            display: none;
            font-size: 1.05rem;
        }

        body.sidebar-collapse .sidebar-toggle-btn .fa-shrink-icon {
            display: none;
        }

        body.sidebar-collapse .sidebar-toggle-btn .fa-expand-icon {
            display: inline-block;
        }

        /* ── Top Navbar ─────────────────────────────────────────────── */
        .main-header.navbar {
            border-bottom: 3px solid var(--dg-purple) !important;
            padding: .5rem 1.25rem !important;
            transition: background 0.25s ease, border-color 0.25s ease !important;
        }

        body:not(.dark-mode) .main-header.navbar {
            background: #ffffff !important;
            color: #1e1b4b !important;
        }

        body:not(.dark-mode) .main-header .nav-link {
            color: #4b5563 !important;
        }

        body:not(.dark-mode) .content-wrapper {
            background: #f4f2ff !important;
        }

        /* ── Theme Toggle Button in Navbar ───────────────────────────── */
        .dg-theme-toggle-btn {
            display: inline-flex !important;
            align-items: center !important;
            gap: 6px !important;
            padding: 6px 14px !important;
            border-radius: 20px !important;
            font-size: .82rem !important;
            font-weight: 600 !important;
            border: 1px solid rgba(108, 69, 224, 0.35) !important;
            background: rgba(108, 69, 224, 0.08) !important;
            color: var(--dg-purple) !important;
            cursor: pointer !important;
            transition: all 0.2s ease !important;
            outline: none !important;
        }

        .dg-theme-toggle-btn:hover {
            background: var(--dg-purple) !important;
            color: #ffffff !important;
            border-color: var(--dg-purple) !important;
        }

        /* =============================================================
           Dark Mode Overrides (Hostinger hPanel Aesthetic)
           ============================================================= */
        body.dark-mode,
        html.dark {
            color-scheme: dark;
        }

        body.dark-mode {
            background-color: #0c0d12 !important;
            color: #f4f4f5 !important;
        }

        body.dark-mode .content-wrapper {
            background-color: #0c0d12 !important;
            color: #f4f4f5 !important;
        }

        body.dark-mode .main-header.navbar {
            background-color: #111217 !important;
            border-bottom: 1px solid rgba(255, 255, 255, 0.08) !important;
            color: #f4f4f5 !important;
        }

        body.dark-mode .main-header .nav-link {
            color: #cbd5e1 !important;
        }

        body.dark-mode .sidebar-toggle-btn {
            background: rgba(124, 58, 237, 0.15) !important;
            color: #c4b5fd !important;
            border-color: rgba(124, 58, 237, 0.35) !important;
        }

        body.dark-mode .sidebar-toggle-btn:hover {
            background: #7c3aed !important;
            color: #ffffff !important;
            border-color: #7c3aed !important;
        }

        body.dark-mode .dg-theme-toggle-btn {
            background: rgba(124, 58, 237, 0.15) !important;
            border-color: rgba(124, 58, 237, 0.35) !important;
            color: #c4b5fd !important;
        }

        body.dark-mode .dg-theme-toggle-btn:hover {
            background: #7c3aed !important;
            color: #ffffff !important;
            border-color: #7c3aed !important;
        }

        body.dark-mode .navbar-user-badge {
            background: rgba(124, 58, 237, 0.15) !important;
            border: 1px solid rgba(124, 58, 237, 0.3) !important;
            border-radius: 20px !important;
            color: #c4b5fd !important;
            padding: 5px 12px !important;
        }

        body.dark-mode .navbar-user-badge i {
            color: #a78bfa !important;
        }

        body.dark-mode .main-sidebar {
            background: #111217 !important;
            border-right: 1px solid rgba(255, 255, 255, 0.08) !important;
        }

        body.dark-mode .brand-link {
            background: #111217 !important;
            border-bottom: 1px solid rgba(255, 255, 255, 0.08) !important;
        }

        body.dark-mode .main-footer {
            background-color: #111217 !important;
            border-top: 1px solid rgba(255, 255, 255, 0.08) !important;
            color: #a1a1aa !important;
        }

        /* Cards & Stat Cards in Dark Mode */
        body.dark-mode .card,
        body.dark-mode .dg-card,
        body.dark-mode .dg-stat-card {
            background-color: #181a20 !important;
            border: 1px solid rgba(255, 255, 255, 0.08) !important;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.35) !important;
            color: #f4f4f5 !important;
        }

        body.dark-mode .card-header,
        body.dark-mode .dg-card-header {
            background-color: #181a20 !important;
            border-bottom: 1px solid rgba(255, 255, 255, 0.08) !important;
            color: #ffffff !important;
        }

        body.dark-mode .card-title,
        body.dark-mode .dg-card-title {
            color: #ffffff !important;
        }

        body.dark-mode .card-body,
        body.dark-mode .dg-card-body {
            color: #d4d4d8 !important;
        }

        /* Headings & Text */
        body.dark-mode .dg-page-heading h4,
        body.dark-mode .dg-page-title,
        body.dark-mode h1, body.dark-mode h2, body.dark-mode h3, body.dark-mode h4, body.dark-mode h5, body.dark-mode h6 {
            color: #ffffff !important;
        }

        body.dark-mode .dg-page-heading p,
        body.dark-mode .dg-page-sub,
        body.dark-mode .text-muted {
            color: #a1a1aa !important;
        }

        /* Stat Card Elements */
        body.dark-mode .dg-stat-icon {
            background-color: rgba(124, 58, 237, 0.18) !important;
        }

        body.dark-mode .dg-stat-icon i {
            color: #c4b5fd !important;
        }

        body.dark-mode .dg-stat-label {
            color: #a1a1aa !important;
        }

        body.dark-mode .dg-stat-value {
            color: #ffffff !important;
        }

        body.dark-mode .dg-stat-link {
            color: #c4b5fd !important;
        }

        /* Tables in Dark Mode */
        body.dark-mode .table,
        body.dark-mode .dg-table {
            color: #d4d4d8 !important;
            background-color: transparent !important;
        }

        body.dark-mode .table thead th,
        body.dark-mode .dg-table thead th {
            background-color: #111217 !important;
            color: #c4b5fd !important;
            border-bottom: 2px solid rgba(124, 58, 237, 0.3) !important;
            border-top: none !important;
        }

        body.dark-mode .table tbody tr,
        body.dark-mode .dg-table tbody tr {
            border-bottom: 1px solid rgba(255, 255, 255, 0.08) !important;
            background-color: transparent !important;
            color: #d4d4d8 !important;
        }

        body.dark-mode .table tbody tr:hover,
        body.dark-mode .dg-table tbody tr:hover {
            background-color: rgba(255, 255, 255, 0.04) !important;
        }

        body.dark-mode .dg-name-cell .dg-name,
        body.dark-mode .dg-contact-primary,
        body.dark-mode .dg-text-dark {
            color: #ffffff !important;
        }

        body.dark-mode .dg-name-cell .dg-email {
            color: #a1a1aa !important;
        }

        /* Empty States */
        body.dark-mode .dg-empty {
            color: #a1a1aa !important;
        }

        body.dark-mode .dg-empty i {
            color: rgba(124, 58, 237, 0.45) !important;
        }

        /* Buttons in Dark Mode */
        body.dark-mode .btn-dg-view {
            background: rgba(124, 58, 237, 0.15) !important;
            color: #c4b5fd !important;
            border: 1px solid rgba(124, 58, 237, 0.35) !important;
        }

        body.dark-mode .btn-dg-view:hover {
            background: #7c3aed !important;
            color: #ffffff !important;
        }

        /* Forms in Dark Mode */
        body.dark-mode .form-control,
        body.dark-mode textarea.form-control,
        body.dark-mode select.form-control {
            background-color: #111217 !important;
            border-color: rgba(255, 255, 255, 0.14) !important;
            color: #ffffff !important;
            -webkit-text-fill-color: #ffffff !important;
        }

        body.dark-mode .form-control:focus,
        body.dark-mode textarea.form-control:focus,
        body.dark-mode select.form-control:focus {
            background-color: #15171f !important;
            border-color: #7c3aed !important;
            color: #ffffff !important;
            -webkit-text-fill-color: #ffffff !important;
            box-shadow: 0 0 0 0.2rem rgba(124, 58, 237, 0.25) !important;
        }

        body.dark-mode .form-control::placeholder {
            color: #71717a !important;
            opacity: 0.9 !important;
            -webkit-text-fill-color: #71717a !important;
        }

        body.dark-mode .input-group-text {
            background-color: #181a20 !important;
            border-color: rgba(255, 255, 255, 0.14) !important;
            color: #c4b5fd !important;
        }

        /* ── CMS Specific Overrides ── */
        body.dark-mode .cms-section-header {
            background: #181a20 !important;
            border-bottom: 1px solid rgba(255, 255, 255, 0.08) !important;
        }

        body.dark-mode .cms-section-header .dg-card-title {
            color: #ffffff !important;
        }

        body.dark-mode .cms-section-header .dg-total-badge {
            background: rgba(124, 58, 237, 0.18) !important;
            color: #c4b5fd !important;
            border: 1px solid rgba(124, 58, 237, 0.35) !important;
        }

        body.dark-mode .dg-seo-preview {
            background: #111217 !important;
            border: 1px solid rgba(255, 255, 255, 0.1) !important;
        }

        body.dark-mode .dg-seo-preview-heading {
            color: #a78bfa !important;
        }

        body.dark-mode .dg-seo-url {
            color: #34d399 !important;
        }

        body.dark-mode .dg-seo-title {
            color: #93c5fd !important;
        }

        body.dark-mode .dg-seo-desc {
            color: #d4d4d8 !important;
        }

        body.dark-mode .dg-dynamic-row {
            background: #13141b !important;
            border: 1px solid rgba(255, 255, 255, 0.08) !important;
            color: #d4d4d8 !important;
        }

        body.dark-mode .dg-drop-zone {
            background: #13141b !important;
            border-color: rgba(255, 255, 255, 0.14) !important;
            color: #d4d4d8 !important;
        }

        body.dark-mode .dg-drop-zone:hover {
            background: #1a1c25 !important;
            border-color: #7c3aed !important;
        }

        body.dark-mode .dg-filter-bar {
            background: #181a20 !important;
            border-color: rgba(255, 255, 255, 0.1) !important;
        }

        /* ── Field Labels: Varied UX Visibility (Calm, Readable Gray, Normal Case) ── */
        label,
        .dg-filter-label {
            text-transform: none !important;
            letter-spacing: 0 !important;
            font-size: 0.8125rem !important;
            font-weight: 500 !important;
            margin-bottom: 5px !important;
            display: inline-block !important;
        }

        body.dark-mode label,
        body.dark-mode .dg-filter-label {
            color: #9ca3af !important;
        }

        body:not(.dark-mode) label,
        body:not(.dark-mode) .dg-filter-label {
            color: #4b5563 !important;
        }

        /* ── Sub-section Group Headers: Subtle Divider with Accent Dot ── */
        .card-inner-label {
            display: flex !important;
            align-items: center !important;
            gap: 8px !important;
            font-size: 0.78rem !important;
            font-weight: 600 !important;
            text-transform: uppercase !important;
            letter-spacing: 0.6px !important;
            margin-top: 1.5rem !important;
            margin-bottom: 0.85rem !important;
            padding-bottom: 6px !important;
        }

        body.dark-mode .card-inner-label {
            color: #d4d4d8 !important;
            border-bottom: 1px solid rgba(255, 255, 255, 0.08) !important;
        }

        body:not(.dark-mode) .card-inner-label {
            color: #6c45e0 !important;
            border-bottom: 1px solid rgba(108, 69, 224, 0.15) !important;
        }

        .card-inner-label::before {
            content: '';
            display: inline-block;
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background: #7c3aed;
        }

        body.dark-mode .dg-char-count {
            color: #a78bfa !important;
        }

        body.dark-mode .dg-add-btn {
            background: rgba(124, 58, 237, 0.15) !important;
            border-color: rgba(124, 58, 237, 0.35) !important;
            color: #c4b5fd !important;
        }

        body.dark-mode .dg-add-btn:hover {
            background: #7c3aed !important;
            color: #ffffff !important;
        }

        body.dark-mode .btn-clear-section {
            background: rgba(239, 68, 68, 0.14) !important;
            border: 1px solid rgba(239, 68, 68, 0.3) !important;
            color: #fca5a5 !important;
        }

        body.dark-mode .btn-clear-section:hover {
            background: #dc2626 !important;
            color: #ffffff !important;
        }

        body.dark-mode .btn-save-section {
            background: #7c3aed !important;
            color: #ffffff !important;
        }

        body.dark-mode .btn-save-section:hover {
            background: #6d28d9 !important;
        }

        /* ── Sidebar Theme & Logout Controls ────────────────────────── */
        .sidebar-theme-toggle-link,
        .sidebar-logout-btn {
            border-radius: 8px !important;
            padding: 9px 12px !important;
            margin: 2px 10px !important;
            transition: all 0.2s ease !important;
            display: flex !important;
            align-items: center !important;
            cursor: pointer !important;
        }

        .sidebar-theme-toggle-link:hover {
            background: rgba(124, 58, 237, 0.15) !important;
            color: #ffffff !important;
        }

        .sidebar-logout-btn {
            width: calc(100% - 20px) !important;
            border: none !important;
            text-align: left !important;
            background: transparent !important;
        }

        .sidebar-logout-btn:hover {
            background: rgba(239, 68, 68, 0.15) !important;
        }

        .sidebar-logout-btn:hover p,
        .sidebar-logout-btn:hover i {
            color: #ef4444 !important;
        }

        body.dark-mode .modal-content,
        body.dark-mode .dropdown-menu {
            background-color: #18132e !important;
            border: 1px solid rgba(139, 92, 246, 0.3) !important;
            color: #f1f5f9 !important;
        }

        body.dark-mode .dropdown-item {
            color: #cbd5e1 !important;
        }

        body.dark-mode .dropdown-item:hover {
            background-color: #261f42 !important;
            color: #ffffff !important;
        }
    </style>
</head>

<body class="hold-transition sidebar-mini layout-fixed dark-mode">
<script>
    // Immediate body class sync
    if (localStorage.getItem('dg_theme') === 'light') {
        document.body.classList.remove('dark-mode');
    } else {
        document.body.classList.add('dark-mode');
    }
</script>
<?php $this->beginBody() ?>

<div class="wrapper">

    <!-- Top Navbar -->
    <nav class="main-header navbar navbar-expand">
        <ul class="navbar-nav">
            <li class="nav-item">
                <a class="nav-link sidebar-toggle-btn" data-widget="pushmenu" href="#" role="button" title="Collapse / Expand Sidebar">
                    <i class="fas fa-outdent fa-shrink-icon"></i>
                    <i class="fas fa-indent fa-expand-icon"></i>
                </a>
            </li>
            <li class="nav-item d-none d-sm-block">
                <span class="nav-link text-muted" style="font-size:.82rem;padding-top:14px;">
                    <?= Html::encode($this->title ?? 'Dashboard') ?>
                </span>
            </li>
        </ul>

        <ul class="navbar-nav ml-auto align-items-center">
            <?php if (!Yii::$app->user->isGuest): ?>
                <li class="nav-item d-none d-sm-flex mr-2">
                    <span class="navbar-user-badge">
                        <i class="fas fa-user-circle"></i>
                        <?= Html::encode(Yii::$app->user->identity->username ?? '') ?>
                    </span>
                </li>
            <?php endif; ?>
        </ul>
    </nav>

    <!-- Sidebar -->
    <aside class="main-sidebar sidebar-dark-primary elevation-4">

        <!-- Logo on top sidebar (Enlarged) -->
        <a href="<?= Url::to(['/site/index']) ?>" class="brand-link d-flex align-items-center justify-content-center">
            <img
                src="<?= $webUrl ?>/images/logo-dark.png"
                alt="Degree Guru"
                class="brand-logo-img"
            >
        </a>

        <div class="sidebar pt-2">
            <nav class="mt-1 pb-3">
                <ul class="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu">

                    <li class="nav-item">
                        <a href="<?= Url::to(['/site/index']) ?>" class="nav-link <?= navActive('site') ?>">
                            <i class="nav-icon fas fa-tachometer-alt" style="color:#c4b5fd"></i>
                            <p>Dashboard</p>
                        </a>
                    </li>

                    <!-- CMS group -->
                    <li class="nav-header" style="color:#7c3aed;font-size:.65rem;font-weight:800;letter-spacing:1px;padding:12px 14px 4px;text-transform:uppercase;">
                        Content (CMS)
                    </li>

                    <li class="nav-item">
                        <a href="<?= Url::to(['/cms/home']) ?>" class="nav-link <?= cmsActive('home') ?: navActive('cms') ?>">
                            <i class="nav-icon fas fa-home" style="color:#c4b5fd"></i>
                            <p>Home Page</p>
                        </a>
                    </li>

                    <li class="nav-item">
                        <a href="<?= Url::to(['/cms/about']) ?>" class="nav-link <?= cmsActive('about') ?>">
                            <i class="nav-icon fas fa-info-circle" style="color:#c4b5fd"></i>
                            <p>About Page</p>
                        </a>
                    </li>

                    <li class="nav-item">
                        <a href="<?= Url::to(['/cms/contact']) ?>" class="nav-link <?= cmsActive('contact') ?>">
                            <i class="nav-icon fas fa-envelope-open-text" style="color:#c4b5fd"></i>
                            <p>Contact Page</p>
                        </a>
                    </li>

                    <li class="nav-item">
                        <a href="<?= Url::to(['/program/index']) ?>" class="nav-link <?= navActive('program') ?>">
                            <i class="nav-icon fas fa-graduation-cap" style="color:#c4b5fd"></i>
                            <p>Programs</p>
                        </a>
                    </li>

                    <li class="nav-item">
                        <a href="<?= Url::to(['/contact/index']) ?>" class="nav-link <?= navActive('contact') ?>">
                            <i class="nav-icon fas fa-headset" style="color:#c4b5fd"></i>
                            <p>Counseling Leads</p>
                        </a>
                    </li>

                    <!-- Jobs group -->
                    <li class="nav-header" style="color:#6c45e0;font-size:.65rem;font-weight:800;letter-spacing:1px;padding:12px 14px 4px;text-transform:uppercase;">
                        Jobs Marketplace
                    </li>

                    <li class="nav-item">
                        <a href="<?= Url::to(['/job-admin']) ?>" class="nav-link <?= navActive('job-admin') ?>">
                            <i class="nav-icon fas fa-briefcase" style="color:#c4b5fd"></i>
                            <p>Jobs Dashboard</p>
                        </a>
                    </li>
                    <li class="nav-item">
                        <a href="<?= Url::to(['/job-admin/employers']) ?>" class="nav-link">
                            <i class="nav-icon fas fa-building" style="color:#c4b5fd"></i>
                            <p>Employers</p>
                        </a>
                    </li>
                    <li class="nav-item">
                        <a href="<?= Url::to(['/job-admin/postings']) ?>" class="nav-link">
                            <i class="nav-icon fas fa-file-alt" style="color:#c4b5fd"></i>
                            <p>Job Postings</p>
                        </a>
                    </li>
                    <li class="nav-item">
                        <a href="<?= Url::to(['/job-admin/seekers']) ?>" class="nav-link">
                            <i class="nav-icon fas fa-user-tie" style="color:#c4b5fd"></i>
                            <p>Job Seekers</p>
                        </a>
                    </li>

                    <li class="nav-item">
                        <a href="<?= Url::to(['/recruitment/index']) ?>" class="nav-link <?= navActive('recruitment') ?>">
                            <i class="nav-icon fas fa-briefcase" style="color:#c4b5fd"></i>
                            <p>Recruitment</p>
                        </a>
                    </li>

                    <li class="nav-item">
                        <a href="<?= Url::to(['/error-log/index']) ?>" class="nav-link <?= navActive('error-log') ?>">
                            <i class="nav-icon fas fa-exclamation-triangle" style="color:#c4b5fd"></i>
                            <p>Error Logs</p>
                        </a>
                    </li>

                    <!-- Account & Controls -->
                    <li class="nav-header" style="color:#7c3aed;font-size:.65rem;font-weight:800;letter-spacing:1px;padding:12px 14px 4px;text-transform:uppercase;">
                        Account &amp; Preferences
                    </li>

                    <li class="nav-item">
                        <a href="<?= Url::to(['/profile/index']) ?>" class="nav-link <?= navActive('profile') ?>">
                            <i class="nav-icon fas fa-user-cog" style="color:#c4b5fd"></i>
                            <p>My Profile</p>
                        </a>
                    </li>

                    <!-- Theme Toggle in Sidebar -->
                    <li class="nav-item">
                        <a href="javascript:void(0)" id="sidebar-theme-toggle" class="nav-link sidebar-theme-toggle-link" role="button" title="Toggle dark / light mode">
                            <i class="nav-icon fas fa-sun" id="sidebar-theme-icon" style="color:#f59e0b"></i>
                            <p>
                                <span id="sidebar-theme-text">Light Mode</span>
                            </p>
                        </a>
                    </li>

                    <?php if (!Yii::$app->user->isGuest): ?>
                        <!-- Logout in Sidebar -->
                        <li class="nav-item">
                            <form action="<?= Url::to(['/site/logout']) ?>" method="post" id="sidebar-logout-form" class="m-0 p-0">
                                <input type="hidden" name="<?= Yii::$app->request->csrfParam ?>" value="<?= Yii::$app->request->csrfToken ?>">
                                <button type="submit" class="sidebar-logout-btn" title="Sign out of Degree Guru CMS">
                                    <i class="nav-icon fas fa-sign-out-alt" style="color:#f87171"></i>
                                    <p style="color:#f87171;font-weight:600;margin:0 0 0 6px">Logout</p>
                                </button>
                            </form>
                        </li>
                    <?php endif; ?>

                </ul>
            </nav>
        </div>
    </aside>

    <!-- Content Wrapper -->
    <div class="content-wrapper p-4">
        <?= $content ?>
    </div>

    <!-- Footer -->
    <footer class="main-footer">
        <strong>&copy; <?= date('Y') ?> Degree Guru.</strong> All rights reserved.
    </footer>

</div>

<script>
document.addEventListener('DOMContentLoaded', function() {
    var toggleBtn = document.getElementById('sidebar-theme-toggle') || document.getElementById('admin-theme-toggle');
    var themeIcon = document.getElementById('sidebar-theme-icon') || document.getElementById('admin-theme-icon');
    var themeText = document.getElementById('sidebar-theme-text') || document.getElementById('admin-theme-text');

    function applyAdminTheme(isDark) {
        if (isDark) {
            document.documentElement.classList.add('dark');
            document.documentElement.setAttribute('data-theme', 'dark');
            document.body.classList.add('dark-mode');
            if (themeIcon) {
                themeIcon.className = 'nav-icon fas fa-sun';
                themeIcon.style.color = '#f59e0b';
            }
            if (themeText) {
                themeText.textContent = 'Light Mode';
            }
        } else {
            document.documentElement.classList.remove('dark');
            document.documentElement.setAttribute('data-theme', 'light');
            document.body.classList.remove('dark-mode');
            if (themeIcon) {
                themeIcon.className = 'nav-icon fas fa-moon';
                themeIcon.style.color = '#6b7280';
            }
            if (themeText) {
                themeText.textContent = 'Dark Mode';
            }
        }
    }

    var savedTheme = localStorage.getItem('dg_theme');
    var isDark = savedTheme !== 'light';
    applyAdminTheme(isDark);

    if (toggleBtn) {
        toggleBtn.addEventListener('click', function(e) {
            e.preventDefault();
            var currentIsDark = document.body.classList.contains('dark-mode');
            var newIsDark = !currentIsDark;
            localStorage.setItem('dg_theme', newIsDark ? 'dark' : 'light');
            applyAdminTheme(newIsDark);
        });
    }
});
</script>

<?php $this->endBody() ?>
</body>
</html>
<?php $this->endPage() ?>

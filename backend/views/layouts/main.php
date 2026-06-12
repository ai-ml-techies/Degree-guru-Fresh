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
?>

<?php $this->beginPage() ?>
<!DOCTYPE html>
<html lang="<?= Yii::$app->language ?>">
<head>
    <meta charset="<?= Yii::$app->charset ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title><?= Html::encode($this->title ?? 'Degree Guru Admin') ?></title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <?php $this->head() ?>
</head>

<body class="hold-transition sidebar-mini layout-fixed">
<?php $this->beginBody() ?>

<div class="wrapper">

    <!-- Top Navbar -->
    <nav class="main-header navbar navbar-expand navbar-white navbar-light">
        <ul class="navbar-nav">
            <li class="nav-item">
                <a class="nav-link" data-widget="pushmenu" href="#" role="button">
                    <i class="fas fa-bars" style="color:var(--dg-purple)"></i>
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
                <li class="nav-item d-none d-sm-flex">
                    <span class="navbar-user-badge">
                        <i class="fas fa-user-circle"></i>
                        <?= Html::encode(Yii::$app->user->identity->username ?? '') ?>
                    </span>
                </li>
                <li class="nav-item">
                    <form action="<?= Url::to(['/site/logout']) ?>" method="post" class="logout-form">
                        <input type="hidden" name="<?= Yii::$app->request->csrfParam ?>" value="<?= Yii::$app->request->csrfToken ?>">
                        <button type="submit" class="btn btn-sm btn-dg">
                            <i class="fas fa-sign-out-alt mr-1"></i> Logout
                        </button>
                    </form>
                </li>
            <?php endif; ?>
        </ul>
    </nav>

    <!-- Sidebar -->
    <aside class="main-sidebar sidebar-dark-primary elevation-4">

        <!-- Logo in sidebar -->
        <a href="<?= Url::to(['/site/index']) ?>" class="brand-link d-flex align-items-center">
            <img
                src="/fresh-degree-guru/backend/web/images/logo-dark.png"
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
                    <li class="nav-header" style="color:#6c45e0;font-size:.65rem;font-weight:800;letter-spacing:1px;padding:12px 14px 4px;text-transform:uppercase;">
                        Content (CMS)
                    </li>

                    <li class="nav-item">
                        <a href="<?= Url::to(['/cms/home']) ?>" class="nav-link <?= navActive('cms') ?>">
                            <i class="nav-icon fas fa-home" style="color:#c4b5fd"></i>
                            <p>Home Page</p>
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

                    <!-- Account -->
                    <li class="nav-header" style="color:#6c45e0;font-size:.65rem;font-weight:800;letter-spacing:1px;padding:12px 14px 4px;text-transform:uppercase;">
                        Account
                    </li>

                    <li class="nav-item">
                        <a href="<?= Url::to(['/profile/index']) ?>" class="nav-link <?= navActive('profile') ?>">
                            <i class="nav-icon fas fa-user-cog" style="color:#c4b5fd"></i>
                            <p>My Profile</p>
                        </a>
                    </li>

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

<?php $this->endBody() ?>
</body>
</html>
<?php $this->endPage() ?>

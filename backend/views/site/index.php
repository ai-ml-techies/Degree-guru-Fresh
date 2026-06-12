<?php

/** @var yii\web\View $this */

use yii\helpers\Html;
use yii\helpers\Url;

$this->title = 'Dashboard';

try {
    $recruitmentCount = (int) \app\models\Recruitment::find()->count();
    $recentApps = \app\models\Recruitment::find()->orderBy(['created_at' => SORT_DESC])->limit(5)->all();
    $dbOk = true;
} catch (\Exception $e) {
    $recruitmentCount = 0;
    $recentApps = [];
    $dbOk = false;
}

$industryColors = [
    'Technology' => ['bg' => '#ede9fe', 'text' => '#6c45e0'],
    'Finance'    => ['bg' => '#d1fae5', 'text' => '#059669'],
    'Healthcare' => ['bg' => '#fee2e2', 'text' => '#dc2626'],
    'Education'  => ['bg' => '#fef3c7', 'text' => '#d97706'],
    'Consulting' => ['bg' => '#dbeafe', 'text' => '#2563eb'],
    'Other'      => ['bg' => '#f1f5f9', 'text' => '#64748b'],
];
?>

<div class="dg-page-heading">
    <h4>Welcome back, <?= Html::encode(Yii::$app->user->identity->username ?? 'Admin') ?></h4>
    <p>Here's what's happening on your platform today.</p>
</div>

<!-- Stat cards -->
<div class="row mb-4">

    <div class="col-sm-6 col-lg-3 mb-3">
        <div class="dg-stat-card">
            <div class="dg-stat-icon">
                <i class="fas fa-briefcase"></i>
            </div>
            <div>
                <div class="dg-stat-label">Recruitment</div>
                <div class="dg-stat-value"><?= $recruitmentCount ?></div>
                <a href="<?= Url::to(['/recruitment/index']) ?>" class="dg-stat-link">View all &rarr;</a>
            </div>
        </div>
    </div>

    <div class="col-sm-6 col-lg-3 mb-3">
        <div class="dg-stat-card">
            <div class="dg-stat-icon">
                <i class="fas fa-users"></i>
            </div>
            <div>
                <div class="dg-stat-label">Leads</div>
                <div class="dg-stat-value">—</div>
                <a href="<?= Url::to(['/lead/index']) ?>" class="dg-stat-link">View all &rarr;</a>
            </div>
        </div>
    </div>

    <div class="col-sm-6 col-lg-3 mb-3">
        <div class="dg-stat-card">
            <div class="dg-stat-icon">
                <i class="fas fa-graduation-cap"></i>
            </div>
            <div>
                <div class="dg-stat-label">Courses</div>
                <div class="dg-stat-value">—</div>
                <a href="<?= Url::to(['/course/index']) ?>" class="dg-stat-link">View all &rarr;</a>
            </div>
        </div>
    </div>

    <div class="col-sm-6 col-lg-3 mb-3">
        <div class="dg-stat-card">
            <div class="dg-stat-icon">
                <i class="fas fa-newspaper"></i>
            </div>
            <div>
                <div class="dg-stat-label">Blogs</div>
                <div class="dg-stat-value">—</div>
                <a href="<?= Url::to(['/blog/index']) ?>" class="dg-stat-link">View all &rarr;</a>
            </div>
        </div>
    </div>

</div>

<!-- Recent Recruitment Applications -->
<div class="dg-card">
    <div class="dg-card-header">
        <h4 class="dg-card-title">
            <i class="fas fa-briefcase"></i>Recent Recruitment Applications
        </h4>
        <a href="<?= Url::to(['/recruitment/index']) ?>" class="btn-dg-view">View All</a>
    </div>

    <?php if (!$dbOk): ?>
        <div class="dg-alert dg-alert-warning">
            <i class="fas fa-exclamation-triangle mr-1"></i>
            Could not load data. Make sure the <code>recruitment</code> table exists in the <code>degree_guru</code> database.
        </div>
    <?php elseif (empty($recentApps)): ?>
        <div class="dg-empty">
            <i class="fas fa-inbox"></i>
            No recruitment applications yet.
        </div>
    <?php else: ?>
        <div class="table-responsive">
            <table class="dg-table">
                <thead>
                    <tr>
                        <th>Applicant</th>
                        <th>Phone</th>
                        <th>Industry</th>
                        <th>Location</th>
                        <th>Submitted</th>
                        <th class="text-right">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ($recentApps as $app): ?>
                        <?php $colors = $industryColors[$app->industry] ?? $industryColors['Other']; ?>
                        <tr>
                            <td class="dg-text-dark"><?= Html::encode($app->name) ?></td>
                            <td class="dg-contact-primary"><?= Html::encode($app->phone) ?></td>
                            <td>
                                <span class="dg-badge" style="background:<?= $colors['bg'] ?>;color:<?= $colors['text'] ?>;">
                                    <?= Html::encode($app->industry) ?>
                                </span>
                            </td>
                            <td class="dg-contact-secondary"><?= Html::encode($app->city . ', ' . $app->country) ?></td>
                            <td>
                                <div class="dg-date-primary"><?= date('d M Y', strtotime($app->created_at)) ?></div>
                            </td>
                            <td>
                                <div class="dg-actions">
                                    <a href="<?= Url::to(['/recruitment/view', 'id' => $app->id]) ?>" class="btn-dg-view">
                                        <i class="fas fa-eye fa-xs"></i> View
                                    </a>
                                    <a href="<?= Url::to(['/recruitment/download', 'id' => $app->id]) ?>" class="btn-dg-resume">
                                        <i class="fas fa-file-download fa-xs"></i> Resume
                                    </a>
                                </div>
                            </td>
                        </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        </div>
    <?php endif; ?>
</div>

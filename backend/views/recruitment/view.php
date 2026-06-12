<?php

/** @var yii\web\View $this */
/** @var app\models\Recruitment $model */

use yii\helpers\Html;
use yii\helpers\Url;

$this->title = 'Application — ' . Html::encode($model->name);

$host    = Yii::$app->request->hostInfo;
$referer = Yii::$app->request->referrer ?? '';
$backUrl = ($referer && str_starts_with($referer, $host) && !str_contains($referer, '/recruitment/view'))
    ? $referer
    : Url::to(['/recruitment/index']);

$industryColors = [
    'Technology' => ['bg' => '#ede9fe', 'text' => '#6c45e0'],
    'Finance'    => ['bg' => '#d1fae5', 'text' => '#059669'],
    'Healthcare' => ['bg' => '#fee2e2', 'text' => '#dc2626'],
    'Education'  => ['bg' => '#fef3c7', 'text' => '#d97706'],
    'Consulting' => ['bg' => '#dbeafe', 'text' => '#2563eb'],
    'Other'      => ['bg' => '#f1f5f9', 'text' => '#64748b'],
];
$colors = $industryColors[$model->industry] ?? $industryColors['Other'];

function viewInitials(string $name): string {
    $parts = array_filter(explode(' ', trim($name)));
    if (count($parts) >= 2) {
        return strtoupper(mb_substr($parts[0], 0, 1) . mb_substr(end($parts), 0, 1));
    }
    return strtoupper(mb_substr($name, 0, 2));
}
?>

<!-- Back button -->
<div class="mb-3">
    <a href="<?= Html::encode($backUrl) ?>" class="btn-dg-back">
        <i class="fas fa-arrow-left fa-xs"></i> Back
    </a>
</div>

<!-- Profile hero -->
<div class="dg-profile-hero">
    <div class="dg-avatar-lg"><?= viewInitials($model->name) ?></div>
    <div class="dg-profile-hero-body">
        <div class="dg-profile-name"><?= Html::encode($model->name) ?></div>
        <div class="dg-profile-sub">
            <i class="fas fa-envelope mr-1"></i><?= Html::encode($model->email ?: '—') ?>
            &nbsp;&nbsp;
            <i class="fas fa-phone mr-1"></i><?= Html::encode($model->phone) ?>
        </div>
    </div>
    <div class="dg-profile-hero-end">
        <div class="dg-meta-label">Submitted</div>
        <div class="dg-meta-value"><?= date('d M Y', strtotime($model->created_at)) ?></div>
        <div class="dg-meta-sub"><?= date('h:i A', strtotime($model->created_at)) ?></div>
    </div>
</div>

<!-- Detail card -->
<div class="dg-card">
    <div class="dg-card-header">
        <h4 class="dg-card-title">
            <i class="fas fa-id-card"></i>Application Details
        </h4>
    </div>
    <div class="card-body p-0">
        <div class="dg-detail-grid">
            <div class="dg-detail-cell">
                <div class="dg-detail-label">Full Name</div>
                <div class="dg-detail-value"><?= Html::encode($model->name) ?></div>
            </div>
            <div class="dg-detail-cell">
                <div class="dg-detail-label">Date of Birth</div>
                <div class="dg-detail-value"><?= Html::encode($model->dob) ?></div>
            </div>
            <div class="dg-detail-cell">
                <div class="dg-detail-label">Phone</div>
                <div class="dg-detail-value"><?= Html::encode($model->phone) ?></div>
            </div>
            <div class="dg-detail-cell">
                <div class="dg-detail-label">Email</div>
                <div class="dg-detail-value <?= $model->email ? '' : 'muted' ?>">
                    <?= Html::encode($model->email ?: 'Not provided') ?>
                </div>
            </div>
            <div class="dg-detail-cell">
                <div class="dg-detail-label">Industry</div>
                <div class="dg-detail-value">
                    <span class="dg-badge" style="background:<?= $colors['bg'] ?>;color:<?= $colors['text'] ?>;">
                        <?= Html::encode($model->industry) ?>
                    </span>
                </div>
            </div>
            <div class="dg-detail-cell">
                <div class="dg-detail-label">Experience</div>
                <div class="dg-detail-value <?= $model->experience ? '' : 'muted' ?>">
                    <?= Html::encode($model->experience ?: 'Not specified') ?>
                </div>
            </div>
            <div class="dg-detail-cell">
                <div class="dg-detail-label">Country</div>
                <div class="dg-detail-value"><?= Html::encode($model->country) ?></div>
            </div>
            <div class="dg-detail-cell">
                <div class="dg-detail-label">State</div>
                <div class="dg-detail-value"><?= Html::encode($model->state) ?></div>
            </div>
            <div class="dg-detail-cell dg-detail-full">
                <div class="dg-detail-label">City</div>
                <div class="dg-detail-value"><?= Html::encode($model->city) ?></div>
            </div>
        </div>

        <!-- Resume download -->
        <div class="px-3 pb-3">
            <div class="dg-resume-box">
                <div class="d-flex align-items-center gap-3">
                    <div class="dg-resume-icon">
                        <i class="fas fa-file-pdf"></i>
                    </div>
                    <div>
                        <div class="dg-resume-name"><?= Html::encode($model->resume_original) ?></div>
                        <div class="dg-resume-sub">Uploaded resume</div>
                    </div>
                </div>
                <a href="<?= Url::to(['/recruitment/download', 'id' => $model->id]) ?>" class="btn-dg-download">
                    <i class="fas fa-file-download"></i> Download Resume
                </a>
            </div>
        </div>
    </div>
</div>

<?php

/** @var yii\web\View $this */
/** @var app\models\CounselingRequest $model */

use app\models\CounselingRequest;
use yii\helpers\Html;
use yii\helpers\Url;

$this->title = 'Lead — ' . Html::encode($model->name);

$host    = Yii::$app->request->hostInfo;
$referer = Yii::$app->request->referrer ?? '';
$backUrl = ($referer && str_starts_with($referer, $host) && !str_contains($referer, '/contact/view'))
    ? $referer
    : Url::to(['/contact/index']);

$colors = CounselingRequest::statusColor($model->status);

function contactViewInitials(string $name): string {
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
        <i class="fas fa-arrow-left fa-xs"></i> Back to Leads
    </a>
</div>

<!-- Profile hero -->
<div class="dg-profile-hero">
    <div class="dg-avatar-lg"><?= contactViewInitials($model->name) ?></div>
    <div class="dg-profile-hero-body">
        <div class="dg-profile-name"><?= Html::encode($model->name) ?></div>
        <div class="dg-profile-sub">
            <i class="fas fa-phone mr-1"></i><?= Html::encode($model->phone) ?>
            <?php if ($model->email): ?>
                &nbsp;&nbsp;
                <i class="fas fa-envelope mr-1"></i><?= Html::encode($model->email) ?>
            <?php endif; ?>
        </div>
    </div>
    <div class="dg-profile-hero-end">
        <div class="dg-meta-label">Submitted</div>
        <div class="dg-meta-value"><?= date('d M Y', strtotime($model->created_at)) ?></div>
        <div class="dg-meta-sub"><?= date('h:i A', strtotime($model->created_at)) ?></div>
    </div>
</div>

<div class="row">
    <!-- Lead details -->
    <div class="col-lg-8">
        <div class="dg-card mb-4">
            <div class="dg-card-header">
                <h4 class="dg-card-title"><i class="fas fa-info-circle"></i> Lead Details</h4>
            </div>
            <div class="card-body p-0">
                <div class="dg-detail-grid">
                    <div class="dg-detail-cell">
                        <div class="dg-detail-label">Phone</div>
                        <div class="dg-detail-value">
                            <a href="tel:<?= Html::encode($model->phone) ?>"><?= Html::encode($model->phone) ?></a>
                        </div>
                    </div>
                    <div class="dg-detail-cell">
                        <div class="dg-detail-label">Email</div>
                        <div class="dg-detail-value <?= $model->email ? '' : 'muted' ?>">
                            <?php if ($model->email): ?>
                                <a href="mailto:<?= Html::encode($model->email) ?>"><?= Html::encode($model->email) ?></a>
                            <?php else: ?>
                                Not provided
                            <?php endif; ?>
                        </div>
                    </div>
                    <div class="dg-detail-cell">
                        <div class="dg-detail-label">Date of Birth</div>
                        <div class="dg-detail-value <?= $model->dob ? '' : 'muted' ?>">
                            <?= Html::encode($model->dob ?: 'Not provided') ?>
                        </div>
                    </div>
                    <div class="dg-detail-cell">
                        <div class="dg-detail-label">Source Page</div>
                        <div class="dg-detail-value <?= $model->source_page ? '' : 'muted' ?>">
                            <?= Html::encode($model->source_page ?: 'Not specified') ?>
                        </div>
                    </div>
                    <div class="dg-detail-cell dg-detail-full">
                        <div class="dg-detail-label">Submitted</div>
                        <div class="dg-detail-value"><?= date('d M Y, h:i A', strtotime($model->created_at)) ?></div>
                    </div>
                </div>

                <?php if ($model->message): ?>
                    <div class="dg-detail-cell dg-section-divider dg-card-body">
                        <div class="dg-section-label">Message</div>
                        <p class="dg-section-text"><?= nl2br(Html::encode($model->message)) ?></p>
                    </div>
                <?php endif; ?>
            </div>
        </div>
    </div>

    <!-- Status panel -->
    <div class="col-lg-4">
        <div class="dg-card">
            <div class="dg-card-header">
                <h4 class="dg-card-title"><i class="fas fa-tag"></i> Status</h4>
            </div>
            <div class="dg-card-body">
                <div class="mb-3">
                    <span class="dg-badge dg-badge-lg" style="background:<?= $colors['bg'] ?>;color:<?= $colors['text'] ?>;">
                        <?= CounselingRequest::statusLabel($model->status) ?>
                    </span>
                </div>
                <form method="post" action="<?= Url::to(['/contact/update-status', 'id' => $model->id]) ?>">
                    <input type="hidden" name="<?= Yii::$app->request->csrfParam ?>" value="<?= Yii::$app->request->csrfToken ?>">
                    <select name="status" class="form-control mb-2">
                        <?php foreach ([
                            CounselingRequest::STATUS_NEW            => 'New',
                            CounselingRequest::STATUS_CONTACTED      => 'Contacted',
                            CounselingRequest::STATUS_ENROLLED       => 'Enrolled',
                            CounselingRequest::STATUS_NOT_INTERESTED => 'Not Interested',
                        ] as $val => $label): ?>
                            <option value="<?= $val ?>" <?= $model->status === $val ? 'selected' : '' ?>>
                                <?= $label ?>
                            </option>
                        <?php endforeach; ?>
                    </select>
                    <button type="submit" class="btn-dg-primary w-100">
                        <i class="fas fa-save fa-xs"></i> Update Status
                    </button>
                </form>
            </div>
        </div>
    </div>
</div>

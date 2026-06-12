<?php

/** @var yii\web\View $this */
/** @var app\models\JobPosting[] $postings */
/** @var string $filter */

use app\models\JobPosting;
use yii\helpers\Html;
use yii\helpers\Url;
?>

<div class="dg-filter-bar mb-4">
    <div class="d-flex gap-3 flex-wrap align-items-center">
        <span class="dg-filter-label">Filter by Status</span>
        <?php foreach (['' => 'All', '0' => 'Pending', '1' => 'Approved', '2' => 'Rejected'] as $val => $label): ?>
            <a href="<?= Url::to(['/job-admin/postings', 'status' => $val]) ?>"
               class="<?= $filter === $val ? 'btn-dg-primary' : 'btn-dg-view' ?> btn-dg-filter">
                <?= $label ?>
            </a>
        <?php endforeach; ?>
    </div>
</div>

<div class="dg-card">
    <div class="dg-card-header">
        <h4 class="dg-card-title"><i class="fas fa-briefcase"></i> Job Postings</h4>
        <span class="dg-total-badge"><?= count($postings) ?> total</span>
    </div>
    <?php if (empty($postings)): ?>
        <div class="dg-empty"><i class="fas fa-briefcase"></i>No job postings found.</div>
    <?php else: ?>
        <div class="table-responsive">
            <table class="dg-table">
                <thead>
                    <tr><th>#</th><th>Job Title</th><th>Company</th><th>Work Type</th><th>Location</th><th>Status</th><th>Posted</th><th class="text-right">Actions</th></tr>
                </thead>
                <tbody>
                    <?php foreach ($postings as $i => $p): ?>
                        <?php $c = JobPosting::statusColor($p->status); ?>
                        <tr>
                            <td class="dg-serial"><?= $i + 1 ?></td>
                            <td>
                                <div class="dg-contact-primary"><?= Html::encode($p->job_title) ?></div>
                                <div class="dg-contact-secondary"><?= Html::encode($p->job_category) ?> &bull; <?= $p->openings ?> opening<?= $p->openings > 1 ? 's' : '' ?></div>
                            </td>
                            <td class="dg-contact-secondary"><?= Html::encode($p->employer->company_name ?? '—') ?></td>
                            <td><span class="dg-badge" style="background:#ede9fe;color:#6c45e0;"><?= Html::encode($p->workTypeLabel()) ?></span></td>
                            <td class="dg-contact-secondary"><?= Html::encode($p->job_location) ?></td>
                            <td><span class="dg-badge" style="background:<?= $c['bg'] ?>;color:<?= $c['text'] ?>;"><?= JobPosting::statusLabel($p->status) ?></span></td>
                            <td>
                                <div class="dg-date-primary"><?= date('d M Y', strtotime($p->created_at)) ?></div>
                            </td>
                            <td>
                                <div class="dg-actions">
                                    <a href="<?= Url::to(['/job-admin/view-posting', 'id' => $p->id]) ?>" class="btn-dg-view btn-dg-filter">
                                        <i class="fas fa-eye fa-xs"></i> View
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

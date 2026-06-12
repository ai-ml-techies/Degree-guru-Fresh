<?php

/** @var yii\web\View $this */
/** @var int $pendingEmployers */
/** @var int $pendingPostings */
/** @var int $totalSeekers */
/** @var int $totalApplications */
/** @var app\models\JobPosting[] $recentPostings */

use app\models\JobPosting;
use yii\helpers\Html;
use yii\helpers\Url;
?>

<div class="dg-page-heading">
    <h4>Jobs Dashboard</h4>
    <p>Overview of the Degree Guru Jobs marketplace.</p>
</div>

<!-- Stat cards -->
<div class="row mb-4">
    <div class="col-sm-6 col-lg-3 mb-3">
        <div class="dg-stat-card">
            <div class="dg-stat-icon"><i class="fas fa-building"></i></div>
            <div>
                <div class="dg-stat-label">Pending Employers</div>
                <div class="dg-stat-value"><?= $pendingEmployers ?></div>
                <a href="<?= Url::to(['/job-admin/employers', 'status' => 0]) ?>" class="dg-stat-link">Review &rarr;</a>
            </div>
        </div>
    </div>
    <div class="col-sm-6 col-lg-3 mb-3">
        <div class="dg-stat-card">
            <div class="dg-stat-icon"><i class="fas fa-briefcase"></i></div>
            <div>
                <div class="dg-stat-label">Pending Postings</div>
                <div class="dg-stat-value"><?= $pendingPostings ?></div>
                <a href="<?= Url::to(['/job-admin/postings', 'status' => 0]) ?>" class="dg-stat-link">Review &rarr;</a>
            </div>
        </div>
    </div>
    <div class="col-sm-6 col-lg-3 mb-3">
        <div class="dg-stat-card">
            <div class="dg-stat-icon"><i class="fas fa-user-tie"></i></div>
            <div>
                <div class="dg-stat-label">Job Seekers</div>
                <div class="dg-stat-value"><?= $totalSeekers ?></div>
                <a href="<?= Url::to(['/job-admin/seekers']) ?>" class="dg-stat-link">View all &rarr;</a>
            </div>
        </div>
    </div>
    <div class="col-sm-6 col-lg-3 mb-3">
        <div class="dg-stat-card">
            <div class="dg-stat-icon"><i class="fas fa-paper-plane"></i></div>
            <div>
                <div class="dg-stat-label">Applications</div>
                <div class="dg-stat-value"><?= $totalApplications ?></div>
                <a href="<?= Url::to(['/job-admin/applications']) ?>" class="dg-stat-link">View all &rarr;</a>
            </div>
        </div>
    </div>
</div>

<!-- Action buttons -->
<div class="d-flex gap-3 mb-4 flex-wrap">
    <a href="<?= Url::to(['/job-admin/employers']) ?>" class="btn-dg-primary">
        <i class="fas fa-building mr-1"></i> Manage Employers
    </a>
    <a href="<?= Url::to(['/job-admin/postings']) ?>" class="btn-dg-primary">
        <i class="fas fa-briefcase mr-1"></i> Manage Postings
    </a>
    <a href="<?= Url::to(['/job-admin/seekers']) ?>" class="btn-dg-view">
        <i class="fas fa-user-tie mr-1"></i> Job Seekers
    </a>
</div>

<!-- Recent postings -->
<div class="dg-card">
    <div class="dg-card-header">
        <h4 class="dg-card-title"><i class="fas fa-clock"></i> Recent Job Postings</h4>
        <a href="<?= Url::to(['/job-admin/postings']) ?>" class="btn-dg-view">View All</a>
    </div>
    <?php if (empty($recentPostings)): ?>
        <div class="dg-empty"><i class="fas fa-inbox"></i>No job postings yet.</div>
    <?php else: ?>
        <div class="table-responsive">
            <table class="dg-table">
                <thead><tr><th>Job Title</th><th>Company</th><th>Work Type</th><th>Status</th><th>Posted</th><th class="text-right">Action</th></tr></thead>
                <tbody>
                    <?php foreach ($recentPostings as $p): ?>
                        <?php $c = JobPosting::statusColor($p->status); ?>
                        <tr>
                            <td class="dg-text-dark"><?= Html::encode($p->job_title) ?></td>
                            <td class="dg-contact-secondary"><?= Html::encode($p->employer->company_name ?? '—') ?></td>
                            <td><span class="dg-badge" style="background:#ede9fe;color:#6c45e0;"><?= Html::encode($p->workTypeLabel()) ?></span></td>
                            <td><span class="dg-badge" style="background:<?= $c['bg'] ?>;color:<?= $c['text'] ?>;"><?= JobPosting::statusLabel($p->status) ?></span></td>
                            <td class="dg-date-primary"><?= date('d M Y', strtotime($p->created_at)) ?></td>
                            <td class="text-right">
                                <a href="<?= Url::to(['/job-admin/view-posting', 'id' => $p->id]) ?>" class="btn-dg-view btn-dg-filter">
                                    <i class="fas fa-eye fa-xs"></i> View
                                </a>
                            </td>
                        </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        </div>
    <?php endif; ?>
</div>

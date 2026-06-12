<?php

/** @var yii\web\View $this */
/** @var app\models\JobPosting $posting */
/** @var app\models\JobApplication[] $applications */

use app\models\JobPosting;
use app\models\JobApplication;
use yii\helpers\Html;
use yii\helpers\Url;

$colors = JobPosting::statusColor($posting->status);
?>

<div class="mb-3 d-flex gap-2 flex-wrap">
    <a href="<?= Url::to(['/job-admin/postings']) ?>" class="btn-dg-back">
        <i class="fas fa-arrow-left fa-xs"></i> Back to Postings
    </a>
    <a href="<?= Url::to(['/job-admin/view-employer', 'id' => $posting->employer_id]) ?>" class="btn-dg-view btn-dg-filter">
        <i class="fas fa-building fa-xs"></i> View Employer
    </a>
</div>

<?php if (Yii::$app->session->hasFlash('success')): ?>
    <div class="dg-alert dg-alert-success mb-3"><i class="fas fa-check-circle"></i><?= Yii::$app->session->getFlash('success') ?></div>
<?php endif; ?>

<div class="dg-profile-hero">
    <div class="dg-avatar-lg" style="font-size:.8rem;letter-spacing:0;"><?= strtoupper(mb_substr($posting->job_title, 0, 2)) ?></div>
    <div class="dg-profile-hero-body">
        <div class="dg-profile-name"><?= Html::encode($posting->job_title) ?></div>
        <div class="dg-profile-sub">
            <?= Html::encode($posting->employer->company_name ?? '—') ?>
            &bull; <?= Html::encode($posting->job_location) ?>
            &bull; <?= Html::encode($posting->workTypeLabel()) ?>
        </div>
    </div>
    <div class="dg-profile-hero-end">
        <div class="dg-meta-label">Posted</div>
        <div class="dg-meta-value"><?= date('d M Y', strtotime($posting->created_at)) ?></div>
        <div class="dg-meta-sub"><?= $posting->openings ?> opening<?= $posting->openings > 1 ? 's' : '' ?></div>
    </div>
</div>

<div class="row">
    <div class="col-lg-8">
        <div class="dg-card mb-4">
            <div class="dg-card-header"><h4 class="dg-card-title"><i class="fas fa-info-circle"></i> Job Details</h4></div>
            <div class="card-body p-0">
                <div class="dg-detail-grid">
                    <div class="dg-detail-cell"><div class="dg-detail-label">Job Title</div><div class="dg-detail-value"><?= Html::encode($posting->job_title) ?></div></div>
                    <div class="dg-detail-cell"><div class="dg-detail-label">Category</div><div class="dg-detail-value"><?= Html::encode($posting->job_category) ?></div></div>
                    <div class="dg-detail-cell"><div class="dg-detail-label">Location</div><div class="dg-detail-value"><?= Html::encode($posting->job_location) ?></div></div>
                    <div class="dg-detail-cell"><div class="dg-detail-label">Work Type</div><div class="dg-detail-value"><?= Html::encode($posting->workTypeLabel()) ?></div></div>
                    <div class="dg-detail-cell"><div class="dg-detail-label">Experience</div><div class="dg-detail-value <?= $posting->experience_required ? '' : 'muted' ?>"><?= Html::encode($posting->experience_required ?: 'Not specified') ?></div></div>
                    <div class="dg-detail-cell"><div class="dg-detail-label">Salary Range</div><div class="dg-detail-value <?= $posting->salary_range ? '' : 'muted' ?>"><?= Html::encode($posting->salary_range ?: 'Not disclosed') ?></div></div>
                    <div class="dg-detail-cell"><div class="dg-detail-label">Industry</div><div class="dg-detail-value"><?= Html::encode($posting->industry ?: '—') ?></div></div>
                    <div class="dg-detail-cell"><div class="dg-detail-label">Openings</div><div class="dg-detail-value"><?= $posting->openings ?></div></div>
                    <div class="dg-detail-cell dg-detail-full"><div class="dg-detail-label">Skills Required</div><div class="dg-detail-value"><?= Html::encode($posting->skills_required ?: '—') ?></div></div>
                    <?php if ($posting->apply_link): ?>
                    <div class="dg-detail-cell dg-detail-full"><div class="dg-detail-label">External Apply Link</div><div class="dg-detail-value"><a href="<?= Html::encode($posting->apply_link) ?>" target="_blank"><?= Html::encode($posting->apply_link) ?></a></div></div>
                    <?php endif; ?>
                </div>
                <div class="dg-detail-cell dg-section-divider dg-card-body" style="border-top:1px solid #f0ecff;padding:1rem 1.4rem;">
                    <div class="dg-section-label">Job Description</div>
                    <p class="dg-section-text" style="white-space:pre-wrap;"><?= Html::encode($posting->job_description) ?></p>
                </div>
            </div>
        </div>

        <!-- Applications -->
        <div class="dg-card">
            <div class="dg-card-header">
                <h4 class="dg-card-title"><i class="fas fa-paper-plane"></i> Applications (<?= count($applications) ?>)</h4>
            </div>
            <?php if (empty($applications)): ?>
                <div class="dg-empty"><i class="fas fa-inbox"></i>No applications yet.</div>
            <?php else: ?>
                <div class="table-responsive">
                    <table class="dg-table">
                        <thead><tr><th>Applicant</th><th>Contact</th><th>Experience</th><th>Status</th><th>Applied</th></tr></thead>
                        <tbody>
                            <?php foreach ($applications as $app): ?>
                                <?php $ac = JobApplication::statusColor($app->status); ?>
                                <tr>
                                    <td>
                                        <div class="dg-contact-primary"><?= Html::encode($app->seeker->full_name ?? '—') ?></div>
                                        <div class="dg-contact-secondary"><?= Html::encode($app->seeker->city ?? '') ?></div>
                                    </td>
                                    <td>
                                        <div class="dg-contact-primary"><?= Html::encode($app->seeker->phone ?? '—') ?></div>
                                        <div class="dg-contact-secondary"><?= Html::encode($app->seeker->email ?? '') ?></div>
                                    </td>
                                    <td class="dg-contact-secondary"><?= Html::encode($app->seeker->experience ?? '—') ?></td>
                                    <td><span class="dg-badge" style="background:<?= $ac['bg'] ?>;color:<?= $ac['text'] ?>;"><?= JobApplication::statusLabel($app->status) ?></span></td>
                                    <td class="dg-date-primary"><?= date('d M Y', strtotime($app->created_at)) ?></td>
                                </tr>
                            <?php endforeach; ?>
                        </tbody>
                    </table>
                </div>
            <?php endif; ?>
        </div>
    </div>

    <!-- Actions panel -->
    <div class="col-lg-4">
        <div class="dg-card">
            <div class="dg-card-header"><h4 class="dg-card-title"><i class="fas fa-tag"></i> Moderation</h4></div>
            <div class="dg-card-body">
                <div class="mb-3">
                    <span class="dg-badge dg-badge-lg" style="background:<?= $colors['bg'] ?>;color:<?= $colors['text'] ?>;">
                        <?= JobPosting::statusLabel($posting->status) ?>
                    </span>
                </div>

                <?php if ($posting->status === JobPosting::STATUS_PENDING || $posting->status === JobPosting::STATUS_REJECTED): ?>
                    <form method="post" action="<?= Url::to(['/job-admin/approve-posting', 'id' => $posting->id]) ?>" class="mb-2">
                        <input type="hidden" name="<?= Yii::$app->request->csrfParam ?>" value="<?= Yii::$app->request->csrfToken ?>">
                        <button type="submit" class="btn-dg-primary w-100" onclick="return confirm('Approve and publish this job?')">
                            <i class="fas fa-check fa-xs mr-1"></i> Approve &amp; Publish
                        </button>
                    </form>
                <?php endif; ?>

                <?php if ($posting->status !== JobPosting::STATUS_REJECTED): ?>
                    <form method="post" action="<?= Url::to(['/job-admin/reject-posting', 'id' => $posting->id]) ?>" class="mb-2">
                        <input type="hidden" name="<?= Yii::$app->request->csrfParam ?>" value="<?= Yii::$app->request->csrfToken ?>">
                        <textarea name="note" class="form-control mb-2" rows="2" placeholder="Rejection reason (optional)"></textarea>
                        <button type="submit" class="btn-dg-danger w-100" onclick="return confirm('Reject this job posting?')">
                            <i class="fas fa-times fa-xs mr-1"></i> Reject Posting
                        </button>
                    </form>
                <?php endif; ?>

                <form method="post" action="<?= Url::to(['/job-admin/delete-posting', 'id' => $posting->id]) ?>" class="mt-3">
                    <input type="hidden" name="<?= Yii::$app->request->csrfParam ?>" value="<?= Yii::$app->request->csrfToken ?>">
                    <button type="submit" class="btn-dg-danger w-100" onclick="return confirm('Permanently DELETE this posting? This cannot be undone.')">
                        <i class="fas fa-trash fa-xs mr-1"></i> Delete Posting
                    </button>
                </form>

                <?php if ($posting->admin_note): ?>
                    <div class="dg-section-divider mt-3 pt-3">
                        <div class="dg-section-label">Admin Note</div>
                        <p class="dg-section-text"><?= Html::encode($posting->admin_note) ?></p>
                    </div>
                <?php endif; ?>
            </div>
        </div>
    </div>
</div>

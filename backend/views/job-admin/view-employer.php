<?php

/** @var yii\web\View $this */
/** @var app\models\JobEmployer $employer */
/** @var app\models\JobPosting[] $postings */

use app\models\JobEmployer;
use app\models\JobPosting;
use yii\helpers\Html;
use yii\helpers\Url;

function empInitials(string $name): string {
    return strtoupper(mb_substr($name, 0, 2));
}

$colors = JobEmployer::statusColor($employer->status);
?>

<div class="mb-3">
    <a href="<?= Url::to(['/job-admin/employers']) ?>" class="btn-dg-back">
        <i class="fas fa-arrow-left fa-xs"></i> Back to Employers
    </a>
</div>

<!-- Employer hero -->
<div class="dg-profile-hero">
    <div class="dg-avatar-lg"><?= empInitials($employer->company_name) ?></div>
    <div class="dg-profile-hero-body">
        <div class="dg-profile-name"><?= Html::encode($employer->company_name) ?></div>
        <div class="dg-profile-sub"><?= Html::encode($employer->company_industry) ?> &mdash; <?= Html::encode($employer->employee_count ?: 'N/A') ?> employees</div>
    </div>
    <div class="dg-profile-hero-end">
        <div class="dg-meta-label">Submitted</div>
        <div class="dg-meta-value"><?= date('d M Y', strtotime($employer->created_at)) ?></div>
        <div class="dg-meta-sub"><?= date('h:i A', strtotime($employer->created_at)) ?></div>
    </div>
</div>

<?php if (Yii::$app->session->hasFlash('success')): ?>
    <div class="dg-alert dg-alert-success mb-3"><i class="fas fa-check-circle"></i><?= Yii::$app->session->getFlash('success') ?></div>
<?php endif; ?>

<div class="row">
    <div class="col-lg-8">
        <!-- Company details -->
        <div class="dg-card mb-4">
            <div class="dg-card-header"><h4 class="dg-card-title"><i class="fas fa-building"></i> Company Details</h4></div>
            <div class="card-body p-0">
                <div class="dg-detail-grid">
                    <div class="dg-detail-cell"><div class="dg-detail-label">Company Name</div><div class="dg-detail-value"><?= Html::encode($employer->company_name) ?></div></div>
                    <div class="dg-detail-cell"><div class="dg-detail-label">Industry</div><div class="dg-detail-value"><?= Html::encode($employer->company_industry) ?></div></div>
                    <div class="dg-detail-cell"><div class="dg-detail-label">Employee Count</div><div class="dg-detail-value <?= $employer->employee_count ? '' : 'muted' ?>"><?= Html::encode($employer->employee_count ?: 'Not specified') ?></div></div>
                    <div class="dg-detail-cell"><div class="dg-detail-label">Website</div><div class="dg-detail-value <?= $employer->company_website ? '' : 'muted' ?>"><?= $employer->company_website ? '<a href="'.Html::encode($employer->company_website).'" target="_blank">'.Html::encode($employer->company_website).'</a>' : 'Not provided' ?></div></div>
                    <div class="dg-detail-cell dg-detail-full"><div class="dg-detail-label">Address</div><div class="dg-detail-value"><?= Html::encode($employer->company_address ?: '—') ?></div></div>
                </div>
            </div>
        </div>

        <!-- Contact details -->
        <div class="dg-card mb-4">
            <div class="dg-card-header"><h4 class="dg-card-title"><i class="fas fa-user"></i> Contact Person</h4></div>
            <div class="card-body p-0">
                <div class="dg-detail-grid">
                    <div class="dg-detail-cell"><div class="dg-detail-label">Name</div><div class="dg-detail-value"><?= Html::encode($employer->contact_name) ?></div></div>
                    <div class="dg-detail-cell"><div class="dg-detail-label">Designation</div><div class="dg-detail-value"><?= Html::encode($employer->contact_designation ?: '—') ?></div></div>
                    <div class="dg-detail-cell"><div class="dg-detail-label">Phone</div><div class="dg-detail-value"><a href="tel:<?= Html::encode($employer->contact_phone) ?>"><?= Html::encode($employer->contact_phone) ?></a></div></div>
                    <div class="dg-detail-cell"><div class="dg-detail-label">Email</div><div class="dg-detail-value"><a href="mailto:<?= Html::encode($employer->contact_email) ?>"><?= Html::encode($employer->contact_email) ?></a></div></div>
                </div>
            </div>
        </div>

        <!-- Document -->
        <div class="dg-card mb-4">
            <div class="dg-card-header"><h4 class="dg-card-title"><i class="fas fa-file-alt"></i> Verification Document</h4></div>
            <div class="dg-card-body">
                <div class="dg-resume-box">
                    <div class="d-flex align-items-center gap-3">
                        <div class="dg-resume-icon"><i class="fas fa-file-pdf"></i></div>
                        <div>
                            <div class="dg-resume-name"><?= Html::encode($employer->document_original) ?></div>
                            <div class="dg-resume-sub">Company verification document</div>
                        </div>
                    </div>
                    <a href="<?= Url::to(['/job-admin/download-doc', 'id' => $employer->id]) ?>" class="btn-dg-download">
                        <i class="fas fa-download"></i> Download
                    </a>
                </div>
            </div>
        </div>

        <!-- Job postings -->
        <?php if (!empty($postings)): ?>
        <div class="dg-card">
            <div class="dg-card-header">
                <h4 class="dg-card-title"><i class="fas fa-briefcase"></i> Job Postings (<?= count($postings) ?>)</h4>
            </div>
            <div class="table-responsive">
                <table class="dg-table">
                    <thead><tr><th>Title</th><th>Work Type</th><th>Status</th><th>Posted</th><th class="text-right">Action</th></tr></thead>
                    <tbody>
                        <?php foreach ($postings as $p): ?>
                            <?php $pc = JobPosting::statusColor($p->status); ?>
                            <tr>
                                <td class="dg-text-dark"><?= Html::encode($p->job_title) ?></td>
                                <td><span class="dg-badge" style="background:#ede9fe;color:#6c45e0;"><?= Html::encode($p->workTypeLabel()) ?></span></td>
                                <td><span class="dg-badge" style="background:<?= $pc['bg'] ?>;color:<?= $pc['text'] ?>;"><?= JobPosting::statusLabel($p->status) ?></span></td>
                                <td class="dg-date-primary"><?= date('d M Y', strtotime($p->created_at)) ?></td>
                                <td class="text-right">
                                    <a href="<?= Url::to(['/job-admin/view-posting', 'id' => $p->id]) ?>" class="btn-dg-view btn-dg-filter"><i class="fas fa-eye fa-xs"></i> View</a>
                                </td>
                            </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            </div>
        </div>
        <?php endif; ?>
    </div>

    <!-- Actions panel -->
    <div class="col-lg-4">
        <div class="dg-card">
            <div class="dg-card-header"><h4 class="dg-card-title"><i class="fas fa-tag"></i> Review Status</h4></div>
            <div class="dg-card-body">
                <div class="mb-3">
                    <span class="dg-badge dg-badge-lg" style="background:<?= $colors['bg'] ?>;color:<?= $colors['text'] ?>;">
                        <?= JobEmployer::statusLabel($employer->status) ?>
                    </span>
                </div>
                <?php if ($employer->status === JobEmployer::STATUS_PENDING): ?>
                    <form method="post" action="<?= Url::to(['/job-admin/approve-employer', 'id' => $employer->id]) ?>" class="mb-2">
                        <input type="hidden" name="<?= Yii::$app->request->csrfParam ?>" value="<?= Yii::$app->request->csrfToken ?>">
                        <button type="submit" class="btn-dg-primary w-100 mb-2" onclick="return confirm('Approve this employer?')">
                            <i class="fas fa-check fa-xs mr-1"></i> Approve Employer
                        </button>
                    </form>
                    <form method="post" action="<?= Url::to(['/job-admin/reject-employer', 'id' => $employer->id]) ?>">
                        <input type="hidden" name="<?= Yii::$app->request->csrfParam ?>" value="<?= Yii::$app->request->csrfToken ?>">
                        <textarea name="note" class="form-control mb-2" rows="2" placeholder="Rejection reason (optional)"></textarea>
                        <button type="submit" class="btn-dg-danger w-100" onclick="return confirm('Reject this employer?')">
                            <i class="fas fa-times fa-xs mr-1"></i> Reject
                        </button>
                    </form>
                <?php elseif ($employer->status === JobEmployer::STATUS_APPROVED): ?>
                    <form method="post" action="<?= Url::to(['/job-admin/reject-employer', 'id' => $employer->id]) ?>">
                        <input type="hidden" name="<?= Yii::$app->request->csrfParam ?>" value="<?= Yii::$app->request->csrfToken ?>">
                        <button type="submit" class="btn-dg-danger w-100" onclick="return confirm('Revoke employer approval?')">
                            <i class="fas fa-ban fa-xs mr-1"></i> Revoke Approval
                        </button>
                    </form>
                <?php else: ?>
                    <form method="post" action="<?= Url::to(['/job-admin/approve-employer', 'id' => $employer->id]) ?>">
                        <input type="hidden" name="<?= Yii::$app->request->csrfParam ?>" value="<?= Yii::$app->request->csrfToken ?>">
                        <button type="submit" class="btn-dg-primary w-100">
                            <i class="fas fa-check fa-xs mr-1"></i> Re-Approve
                        </button>
                    </form>
                <?php endif; ?>
                <?php if ($employer->admin_note): ?>
                    <div class="dg-section-divider mt-3 pt-3">
                        <div class="dg-section-label">Admin Note</div>
                        <p class="dg-section-text"><?= Html::encode($employer->admin_note) ?></p>
                    </div>
                <?php endif; ?>
            </div>
        </div>
    </div>
</div>

<?php

/** @var yii\web\View $this */
/** @var app\models\JobEmployer[] $employers */
/** @var string $filter */

use app\models\JobEmployer;
use yii\helpers\Html;
use yii\helpers\Url;
?>

<!-- Filter -->
<div class="dg-filter-bar mb-4">
    <div class="d-flex gap-3 flex-wrap align-items-center">
        <span class="dg-filter-label">Filter by Status</span>
        <?php foreach (['' => 'All', '0' => 'Pending', '1' => 'Approved', '2' => 'Rejected'] as $val => $label): ?>
            <a href="<?= Url::to(['/job-admin/employers', 'status' => $val]) ?>"
               class="<?= $filter === $val ? 'btn-dg-primary' : 'btn-dg-view' ?> btn-dg-filter">
                <?= $label ?>
            </a>
        <?php endforeach; ?>
    </div>
</div>

<div class="dg-card">
    <div class="dg-card-header">
        <h4 class="dg-card-title"><i class="fas fa-building"></i> Employers</h4>
        <span class="dg-total-badge"><?= count($employers) ?> total</span>
    </div>
    <?php if (empty($employers)): ?>
        <div class="dg-empty"><i class="fas fa-building"></i>No employers found.</div>
    <?php else: ?>
        <div class="table-responsive">
            <table class="dg-table">
                <thead>
                    <tr>
                        <th>#</th><th>Company</th><th>Contact</th><th>Industry</th>
                        <th>Document</th><th>Status</th><th>Submitted</th>
                        <th class="text-right">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ($employers as $i => $e): ?>
                        <?php $c = JobEmployer::statusColor($e->status); ?>
                        <tr>
                            <td class="dg-serial"><?= $i + 1 ?></td>
                            <td>
                                <div class="dg-name-cell">
                                    <div class="dg-avatar"><?= strtoupper(mb_substr($e->company_name, 0, 2)) ?></div>
                                    <div>
                                        <div class="dg-contact-primary"><?= Html::encode($e->company_name) ?></div>
                                        <div class="dg-contact-secondary"><?= Html::encode($e->employee_count ?: '—') ?> employees</div>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <div class="dg-contact-primary"><?= Html::encode($e->contact_name) ?></div>
                                <div class="dg-contact-secondary"><?= Html::encode($e->contact_phone) ?></div>
                            </td>
                            <td class="dg-contact-secondary"><?= Html::encode($e->company_industry) ?></td>
                            <td>
                                <a href="<?= Url::to(['/job-admin/download-doc', 'id' => $e->id]) ?>" class="btn-dg-download btn-dg-filter">
                                    <i class="fas fa-download fa-xs"></i> Download
                                </a>
                            </td>
                            <td><span class="dg-badge" style="background:<?= $c['bg'] ?>;color:<?= $c['text'] ?>;"><?= JobEmployer::statusLabel($e->status) ?></span></td>
                            <td>
                                <div class="dg-date-primary"><?= date('d M Y', strtotime($e->created_at)) ?></div>
                                <div class="dg-date-secondary"><?= date('h:i A', strtotime($e->created_at)) ?></div>
                            </td>
                            <td>
                                <div class="dg-actions">
                                    <a href="<?= Url::to(['/job-admin/view-employer', 'id' => $e->id]) ?>" class="btn-dg-view btn-dg-filter">
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

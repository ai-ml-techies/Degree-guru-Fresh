<?php

/** @var yii\web\View $this */
/** @var app\models\JobApplication[] $applications */

use app\models\JobApplication;
use yii\helpers\Html;
use yii\helpers\Url;
?>

<div class="dg-card">
    <div class="dg-card-header">
        <h4 class="dg-card-title"><i class="fas fa-paper-plane"></i> All Applications</h4>
        <span class="dg-total-badge"><?= count($applications) ?> total</span>
    </div>
    <?php if (empty($applications)): ?>
        <div class="dg-empty"><i class="fas fa-inbox"></i>No applications submitted yet.</div>
    <?php else: ?>
        <div class="table-responsive">
            <table class="dg-table">
                <thead>
                    <tr><th>#</th><th>Applicant</th><th>Job</th><th>Company</th><th>Status</th><th>Applied</th></tr>
                </thead>
                <tbody>
                    <?php foreach ($applications as $i => $app): ?>
                        <?php $c = JobApplication::statusColor($app->status); ?>
                        <tr>
                            <td class="dg-serial"><?= $i + 1 ?></td>
                            <td>
                                <div class="dg-contact-primary"><?= Html::encode($app->seeker->full_name ?? '—') ?></div>
                                <div class="dg-contact-secondary"><?= Html::encode($app->seeker->phone ?? '') ?></div>
                            </td>
                            <td>
                                <div class="dg-contact-primary"><?= Html::encode($app->posting->job_title ?? '—') ?></div>
                                <div class="dg-contact-secondary"><?= Html::encode($app->posting->job_location ?? '') ?></div>
                            </td>
                            <td class="dg-contact-secondary"><?= Html::encode($app->posting->employer->company_name ?? '—') ?></td>
                            <td><span class="dg-badge" style="background:<?= $c['bg'] ?>;color:<?= $c['text'] ?>;"><?= JobApplication::statusLabel($app->status) ?></span></td>
                            <td>
                                <div class="dg-date-primary"><?= date('d M Y', strtotime($app->created_at)) ?></div>
                            </td>
                        </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        </div>
    <?php endif; ?>
</div>

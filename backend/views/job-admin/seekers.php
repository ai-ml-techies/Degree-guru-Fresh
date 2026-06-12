<?php

/** @var yii\web\View $this */
/** @var app\models\JobSeeker[] $seekers */

use yii\helpers\Html;
use yii\helpers\Url;
?>

<div class="dg-card">
    <div class="dg-card-header">
        <h4 class="dg-card-title"><i class="fas fa-user-tie"></i> Job Seekers</h4>
        <span class="dg-total-badge"><?= count($seekers) ?> registered</span>
    </div>
    <?php if (empty($seekers)): ?>
        <div class="dg-empty"><i class="fas fa-users"></i>No job seekers registered yet.</div>
    <?php else: ?>
        <div class="table-responsive">
            <table class="dg-table">
                <thead>
                    <tr><th>#</th><th>Name</th><th>Contact</th><th>Location</th><th>Experience</th><th>Industry</th><th>Resume</th><th>Registered</th></tr>
                </thead>
                <tbody>
                    <?php foreach ($seekers as $i => $s): ?>
                        <tr>
                            <td class="dg-serial"><?= $i + 1 ?></td>
                            <td>
                                <div class="dg-name-cell">
                                    <div class="dg-avatar"><?= strtoupper(mb_substr($s->full_name, 0, 2)) ?></div>
                                    <div>
                                        <div class="dg-contact-primary"><?= Html::encode($s->full_name) ?></div>
                                        <div class="dg-contact-secondary"><?= Html::encode($s->qualification ?: '—') ?></div>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <div class="dg-contact-primary"><?= Html::encode($s->phone) ?></div>
                                <div class="dg-contact-secondary"><?= Html::encode($s->email) ?></div>
                            </td>
                            <td class="dg-contact-secondary"><?= Html::encode($s->city ?: '—') ?></td>
                            <td class="dg-contact-secondary"><?= Html::encode($s->experience ?: 'Fresher') ?></td>
                            <td class="dg-contact-secondary"><?= Html::encode($s->preferred_industry ?: '—') ?></td>
                            <td>
                                <?php if ($s->resume_filename): ?>
                                    <a href="<?= Yii::getAlias('@web') ?>/uploads/seeker-resumes/<?= Html::encode($s->resume_filename) ?>"
                                       target="_blank" class="btn-dg-download btn-dg-filter">
                                        <i class="fas fa-download fa-xs"></i> Resume
                                    </a>
                                <?php else: ?>
                                    <span class="dg-soft-dash">—</span>
                                <?php endif; ?>
                            </td>
                            <td>
                                <div class="dg-date-primary"><?= date('d M Y', strtotime($s->created_at)) ?></div>
                            </td>
                        </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        </div>
    <?php endif; ?>
</div>

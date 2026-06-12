<?php

/** @var yii\web\View $this */
/** @var app\models\CounselingRequestSearch $searchModel */
/** @var yii\data\ActiveDataProvider $dataProvider */

use app\models\CounselingRequest;
use yii\helpers\Html;
use yii\helpers\Url;
use yii\widgets\LinkPager;

$this->title = 'Counseling Leads';

$models     = $dataProvider->getModels();
$total      = $dataProvider->getTotalCount();
$pagination = $dataProvider->pagination;
$isFiltered = (bool) array_filter(array_values(Yii::$app->request->queryParams));

function leadInitials(string $name): string {
    $parts = array_filter(explode(' ', trim($name)));
    if (count($parts) >= 2) {
        return strtoupper(mb_substr($parts[0], 0, 1) . mb_substr(end($parts), 0, 1));
    }
    return strtoupper(mb_substr($name, 0, 2));
}
?>

<!-- Filter bar -->
<div class="dg-filter-bar">
    <form method="get" action="<?= Url::to(['/contact/index']) ?>">
        <div class="row align-items-end dg-filter-row">
            <div class="col-6 col-md-3 col-lg-2">
                <div class="dg-filter-label">Name</div>
                <input type="text" name="CounselingRequestSearch[name]"
                       class="form-control" placeholder="Search name…"
                       value="<?= Html::encode($searchModel->name) ?>">
            </div>
            <div class="col-6 col-md-3 col-lg-2">
                <div class="dg-filter-label">Phone</div>
                <input type="text" name="CounselingRequestSearch[phone]"
                       class="form-control" placeholder="Search phone…"
                       value="<?= Html::encode($searchModel->phone) ?>">
            </div>
            <div class="col-6 col-md-3 col-lg-2">
                <div class="dg-filter-label">Email</div>
                <input type="text" name="CounselingRequestSearch[email]"
                       class="form-control" placeholder="Search email…"
                       value="<?= Html::encode($searchModel->email) ?>">
            </div>
            <div class="col-6 col-md-3 col-lg-2">
                <div class="dg-filter-label">Status</div>
                <select name="CounselingRequestSearch[status]" class="form-control">
                    <option value="">All Statuses</option>
                    <option value="<?= CounselingRequest::STATUS_NEW ?>"
                        <?= (string)$searchModel->status === (string)CounselingRequest::STATUS_NEW ? 'selected' : '' ?>>New</option>
                    <option value="<?= CounselingRequest::STATUS_CONTACTED ?>"
                        <?= (string)$searchModel->status === (string)CounselingRequest::STATUS_CONTACTED ? 'selected' : '' ?>>Contacted</option>
                    <option value="<?= CounselingRequest::STATUS_ENROLLED ?>"
                        <?= (string)$searchModel->status === (string)CounselingRequest::STATUS_ENROLLED ? 'selected' : '' ?>>Enrolled</option>
                    <option value="<?= CounselingRequest::STATUS_NOT_INTERESTED ?>"
                        <?= (string)$searchModel->status === (string)CounselingRequest::STATUS_NOT_INTERESTED ? 'selected' : '' ?>>Not Interested</option>
                </select>
            </div>
            <div class="col-6 col-md-3 col-lg-2 d-flex gap-2 align-items-end">
                <button type="submit" class="btn-dg-primary btn-dg-filter">
                    <i class="fas fa-search fa-xs"></i> Filter
                </button>
                <?php if ($isFiltered): ?>
                    <a href="<?= Url::to(['/contact/index']) ?>" class="btn-dg-reset btn-dg-filter">
                        <i class="fas fa-times fa-xs"></i> Reset
                    </a>
                <?php endif; ?>
            </div>
        </div>
    </form>
</div>

<!-- Results card -->
<div class="dg-card">
    <div class="dg-card-header">
        <h4 class="dg-card-title">
            <i class="fas fa-headset"></i>
            Counseling Leads
        </h4>
        <span class="dg-total-badge"><?= $total ?> total</span>
    </div>

    <?php if (empty($models)): ?>
        <div class="dg-empty">
            <i class="fas fa-inbox"></i>
            <?= $isFiltered ? 'No leads match your filters.' : 'No counseling requests received yet.' ?>
        </div>
    <?php else: ?>
        <div class="table-responsive">
            <table class="dg-table">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Contact</th>
                        <th>Message</th>
                        <th>Source</th>
                        <th>Status</th>
                        <th>Submitted</th>
                        <th class="text-right">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ($models as $i => $lead): ?>
                        <?php
                            $colors = CounselingRequest::statusColor($lead->status);
                            $offset = $pagination ? $pagination->offset : 0;
                        ?>
                        <tr>
                            <td class="dg-serial"><?= $offset + $i + 1 ?></td>
                            <td>
                                <div class="dg-name-cell">
                                    <div class="dg-avatar"><?= leadInitials($lead->name) ?></div>
                                    <div>
                                        <div class="dg-contact-primary"><?= Html::encode($lead->name) ?></div>
                                        <?php if ($lead->dob): ?>
                                            <div class="dg-contact-secondary">DOB: <?= Html::encode($lead->dob) ?></div>
                                        <?php endif; ?>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <div class="dg-contact-primary"><?= Html::encode($lead->phone) ?></div>
                                <div class="dg-contact-secondary"><?= Html::encode($lead->email ?: '—') ?></div>
                            </td>
                            <td class="dg-td-msg">
                                <div class="dg-cell-wrap dg-contact-secondary">
                                    <?= $lead->message ? Html::encode(mb_strimwidth($lead->message, 0, 80, '…')) : '—' ?>
                                </div>
                            </td>
                            <td>
                                <span class="dg-text-sub"><?= Html::encode($lead->source_page ?: '—') ?></span>
                            </td>
                            <td>
                                <span class="dg-badge" style="background:<?= $colors['bg'] ?>;color:<?= $colors['text'] ?>;">
                                    <?= CounselingRequest::statusLabel($lead->status) ?>
                                </span>
                            </td>
                            <td>
                                <div class="dg-date-primary"><?= date('d M Y', strtotime($lead->created_at)) ?></div>
                                <div class="dg-date-secondary"><?= date('h:i A', strtotime($lead->created_at)) ?></div>
                            </td>
                            <td>
                                <div class="dg-actions">
                                    <a href="<?= Url::to(['/contact/view', 'id' => $lead->id]) ?>"
                                       class="btn-dg-view" title="View lead">
                                        <i class="fas fa-eye fa-xs"></i> View
                                    </a>
                                </div>
                            </td>
                        </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        </div>

        <?php if ($pagination && $pagination->pageCount > 1): ?>
            <div class="dg-pagination-row">
                <div class="dg-pagination-info">
                    Showing <?= $pagination->offset + 1 ?>–<?= min($pagination->offset + $pagination->pageSize, $total) ?> of <?= $total ?>
                </div>
                <?= LinkPager::widget([
                    'pagination'           => $pagination,
                    'options'              => ['class' => 'pagination mb-0'],
                    'linkOptions'          => ['class' => 'page-link'],
                    'pageCssClass'         => 'page-item',
                    'activePageCssClass'   => 'page-item active',
                    'disabledPageCssClass' => 'page-item disabled',
                    'prevPageLabel'        => '<i class="fas fa-chevron-left fa-xs"></i>',
                    'nextPageLabel'        => '<i class="fas fa-chevron-right fa-xs"></i>',
                    'firstPageLabel'       => false,
                    'lastPageLabel'        => false,
                    'maxButtonCount'       => 5,
                ]) ?>
            </div>
        <?php endif; ?>
    <?php endif; ?>
</div>

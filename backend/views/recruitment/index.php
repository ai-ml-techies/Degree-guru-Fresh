<?php

/** @var yii\web\View $this */
/** @var app\models\RecruitmentSearch $searchModel */
/** @var yii\data\ActiveDataProvider $dataProvider */
/** @var string[] $cities */

use yii\helpers\Html;
use yii\helpers\Url;
use yii\widgets\LinkPager;

$this->title = 'Recruitment Applications';

$models     = $dataProvider->getModels();
$total      = $dataProvider->getTotalCount();
$pagination = $dataProvider->pagination;
$isFiltered = (bool) array_filter(array_values(Yii::$app->request->queryParams));

$industryColors = [
    'Technology' => ['bg' => '#ede9fe', 'text' => '#6c45e0'],
    'Finance'    => ['bg' => '#d1fae5', 'text' => '#059669'],
    'Healthcare' => ['bg' => '#fee2e2', 'text' => '#dc2626'],
    'Education'  => ['bg' => '#fef3c7', 'text' => '#d97706'],
    'Consulting' => ['bg' => '#dbeafe', 'text' => '#2563eb'],
    'Other'      => ['bg' => '#f1f5f9', 'text' => '#64748b'],
];

function initials(string $name): string {
    $parts = array_filter(explode(' ', trim($name)));
    if (count($parts) >= 2) {
        return strtoupper(mb_substr($parts[0], 0, 1) . mb_substr(end($parts), 0, 1));
    }
    return strtoupper(mb_substr($name, 0, 2));
}
?>

<!-- Filter bar -->
<div class="dg-filter-bar">
    <form method="get" action="<?= Url::to(['/recruitment/index']) ?>">
        <div class="row align-items-end dg-filter-row">
            <div class="col-6 col-md-3 col-lg-2">
                <div class="dg-filter-label">Name</div>
                <input type="text" name="RecruitmentSearch[name]"
                       class="form-control" placeholder="Search name…"
                       value="<?= Html::encode($searchModel->name) ?>">
            </div>
            <div class="col-6 col-md-3 col-lg-2">
                <div class="dg-filter-label">Email</div>
                <input type="text" name="RecruitmentSearch[email]"
                       class="form-control" placeholder="Search email…"
                       value="<?= Html::encode($searchModel->email) ?>">
            </div>
            <div class="col-6 col-md-3 col-lg-2">
                <div class="dg-filter-label">Phone</div>
                <input type="text" name="RecruitmentSearch[phone]"
                       class="form-control" placeholder="Search phone…"
                       value="<?= Html::encode($searchModel->phone) ?>">
            </div>
            <div class="col-6 col-md-3 col-lg-2">
                <div class="dg-filter-label">Industry</div>
                <select name="RecruitmentSearch[industry]" class="form-control">
                    <option value="">All Industries</option>
                    <?php foreach (['Technology','Finance','Healthcare','Education','Consulting','Other'] as $ind): ?>
                        <option value="<?= $ind ?>" <?= $searchModel->industry === $ind ? 'selected' : '' ?>>
                            <?= $ind ?>
                        </option>
                    <?php endforeach; ?>
                </select>
            </div>
            <div class="col-6 col-md-3 col-lg-2">
                <div class="dg-filter-label">City</div>
                <select name="RecruitmentSearch[city]" class="form-control">
                    <option value="">All Cities</option>
                    <?php foreach ($cities as $city): ?>
                        <option value="<?= Html::encode($city) ?>" <?= $searchModel->city === $city ? 'selected' : '' ?>>
                            <?= Html::encode($city) ?>
                        </option>
                    <?php endforeach; ?>
                </select>
            </div>
            <div class="col-6 col-md-3 col-lg-2 d-flex gap-2 align-items-end">
                <button type="submit" class="btn-dg-primary btn-dg-filter">
                    <i class="fas fa-search fa-xs"></i> Filter
                </button>
                <?php if ($isFiltered): ?>
                    <a href="<?= Url::to(['/recruitment/index']) ?>" class="btn-dg-reset btn-dg-filter">
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
            <i class="fas fa-briefcase"></i>
            Recruitment Applications
        </h4>
        <span class="dg-total-badge"><?= $total ?> total</span>
    </div>

    <?php if (empty($models)): ?>
        <div class="dg-empty">
            <i class="fas fa-inbox"></i>
            <?= $isFiltered ? 'No applications match your filters.' : 'No applications received yet.' ?>
        </div>
    <?php else: ?>
        <div class="table-responsive">
            <table class="dg-table">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Applicant</th>
                        <th>Contact</th>
                        <th>Industry</th>
                        <th>Location</th>
                        <th>Experience</th>
                        <th>Submitted</th>
                        <th class="text-right">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ($models as $i => $app): ?>
                        <?php
                            $colors = $industryColors[$app->industry] ?? $industryColors['Other'];
                            $offset = $pagination ? $pagination->offset : 0;
                        ?>
                        <tr>
                            <td class="dg-serial"><?= $offset + $i + 1 ?></td>
                            <td>
                                <div class="dg-name-cell">
                                    <div class="dg-avatar"><?= initials($app->name) ?></div>
                                    <div>
                                        <div class="dg-contact-primary"><?= Html::encode($app->name) ?></div>
                                        <div class="dg-contact-secondary">DOB: <?= Html::encode($app->dob) ?></div>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <div class="dg-contact-primary"><?= Html::encode($app->phone) ?></div>
                                <div class="dg-contact-secondary"><?= Html::encode($app->email ?: '—') ?></div>
                            </td>
                            <td>
                                <span class="dg-badge" style="background:<?= $colors['bg'] ?>;color:<?= $colors['text'] ?>;">
                                    <?= Html::encode($app->industry) ?>
                                </span>
                            </td>
                            <td class="dg-contact-primary">
                                <?= Html::encode($app->city) ?>,
                                <span class="dg-contact-secondary"><?= Html::encode($app->state) ?>, <?= Html::encode($app->country) ?></span>
                            </td>
                            <td class="dg-contact-secondary"><?= Html::encode($app->experience ?: '—') ?></td>
                            <td>
                                <div class="dg-date-primary"><?= date('d M Y', strtotime($app->created_at)) ?></div>
                                <div class="dg-date-secondary"><?= date('h:i A', strtotime($app->created_at)) ?></div>
                            </td>
                            <td>
                                <div class="dg-actions">
                                    <a href="<?= Url::to(['/recruitment/view', 'id' => $app->id]) ?>"
                                       class="btn-dg-view" title="View application">
                                        <i class="fas fa-eye fa-xs"></i> View
                                    </a>
                                    <a href="<?= Url::to(['/recruitment/download', 'id' => $app->id]) ?>"
                                       class="btn-dg-resume" title="Download resume">
                                        <i class="fas fa-file-download fa-xs"></i> Resume
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

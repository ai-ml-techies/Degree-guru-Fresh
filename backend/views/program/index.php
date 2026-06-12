<?php

/** @var yii\web\View $this */
/** @var app\models\Program[] $programs */

use yii\helpers\Html;
use yii\helpers\Url;

$levelColors = [
    'Bachelors' => 'primary',
    'Masters'   => 'success',
    'Doctoral'  => 'danger',
    'Skills'    => 'warning',
];
?>

<div class="dg-page-heading d-flex justify-content-between align-items-center mb-4">
    <div>
        <h1 class="dg-page-title">Programs</h1>
        <p class="dg-page-sub">Manage all online degree and certification programs</p>
    </div>
    <a href="<?= Url::to(['/program/create']) ?>" class="btn btn-dg-primary">
        <i class="fas fa-plus mr-1"></i> Add Program
    </a>
</div>

<?php foreach (Yii::$app->session->getAllFlashes() as $type => $msg): ?>
    <div class="alert alert-<?= $type === 'success' ? 'success' : 'danger' ?> alert-dismissible fade show mb-4" role="alert">
        <?= Html::encode(is_array($msg) ? implode(' ', $msg) : $msg) ?>
        <button type="button" class="close" data-dismiss="alert">&times;</button>
    </div>
<?php endforeach; ?>

<div class="dg-card">
    <div class="dg-card-header d-flex justify-content-between align-items-center">
        <span class="dg-card-title"><i class="fas fa-graduation-cap mr-2"></i>All Programs (<?= count($programs) ?>)</span>
        <small class="text-muted">Drag sort order to reorder on frontend</small>
    </div>

    <?php if (empty($programs)): ?>
        <div class="p-5 text-center text-muted">
            <i class="fas fa-graduation-cap fa-3x mb-3 d-block dg-icon-empty"></i>
            No programs yet. <a href="<?= Url::to(['/program/create']) ?>">Add the first one</a>.
        </div>
    <?php else: ?>
        <div class="table-responsive">
            <table class="table dg-table mb-0">
                <thead>
                    <tr>
                        <th class="dg-col-order">Order</th>
                        <th>Name</th>
                        <th>Slug</th>
                        <th>Level</th>
                        <th>Active</th>
                        <th class="text-right">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ($programs as $p): ?>
                        <tr>
                            <td class="text-center font-weight-bold text-muted"><?= $p->sort_order ?></td>
                            <td>
                                <div class="font-weight-bold"><?= Html::encode($p->name) ?></div>
                                <div class="dg-text-sub"><?= Html::encode($p->full_name) ?></div>
                            </td>
                            <td><code class="dg-code-slug">/programs/<?= Html::encode($p->slug) ?></code></td>
                            <td>
                                <span class="badge badge-<?= $levelColors[$p->level] ?? 'secondary' ?>">
                                    <?= Html::encode($p->level) ?>
                                </span>
                            </td>
                            <td>
                                <a href="<?= Url::to(['/program/toggle', 'id' => $p->id]) ?>"
                                   title="<?= $p->is_active ? 'Click to deactivate' : 'Click to activate' ?>">
                                    <?php if ($p->is_active): ?>
                                        <span class="badge badge-success"><i class="fas fa-check mr-1"></i>Active</span>
                                    <?php else: ?>
                                        <span class="badge badge-secondary">Inactive</span>
                                    <?php endif; ?>
                                </a>
                            </td>
                            <td class="text-right">
                                <a href="<?= Url::to(['/program/update', 'id' => $p->id]) ?>"
                                   class="btn btn-sm btn-outline-primary mr-1" title="Edit">
                                    <i class="fas fa-edit"></i>
                                </a>
                                <form method="post"
                                      action="<?= Url::to(['/program/delete', 'id' => $p->id]) ?>"
                                      class="d-inline"
                                      onsubmit="return confirm('Delete &quot;<?= Html::encode(addslashes($p->name)) ?>&quot;? This cannot be undone.')">
                                    <input type="hidden" name="<?= Yii::$app->request->csrfParam ?>" value="<?= Yii::$app->request->csrfToken ?>">
                                    <button type="submit" class="btn btn-sm btn-outline-danger" title="Delete">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </form>
                            </td>
                        </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        </div>
    <?php endif; ?>
</div>

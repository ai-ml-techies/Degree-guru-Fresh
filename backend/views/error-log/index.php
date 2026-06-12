<?php

/** @var yii\web\View $this */
/** @var app\models\ErrorLog[] $logs */

use yii\helpers\Html;
use yii\helpers\Url;

$this->title = 'Error Logs';

$typeStyle = [
    'validation' => ['bg' => '#fef3c7', 'text' => '#d97706'],
    'server'     => ['bg' => '#fee2e2', 'text' => '#dc2626'],
    'database'   => ['bg' => '#fee2e2', 'text' => '#dc2626'],
    'file'       => ['bg' => '#dbeafe', 'text' => '#2563eb'],
    'error'      => ['bg' => '#f1f5f9', 'text' => '#64748b'],
];
?>

<div class="dg-card">
    <div class="dg-card-header">
        <h4 class="dg-card-title">
            <i class="fas fa-exclamation-triangle"></i>
            Error Logs
        </h4>
        <div class="d-flex align-items-center gap-3">
            <span class="dg-total-badge"><?= count($logs) ?> entries</span>
            <?php if (!empty($logs)): ?>
                <a href="<?= Url::to(['/error-log/clear']) ?>"
                   class="btn-dg-danger"
                   onclick="return confirm('Clear all error logs? This cannot be undone.')">
                    <i class="fas fa-trash fa-xs"></i> Clear All
                </a>
            <?php endif; ?>
        </div>
    </div>

    <?php if (empty($logs)): ?>
        <div class="dg-empty">
            <i class="fas fa-check-circle"></i>
            No errors logged. Everything looks clean!
        </div>
    <?php else: ?>
        <div class="table-responsive">
            <table class="dg-table">
                <thead>
                    <tr>
                        <th>#</th>
                        <th class="dg-col-type">Type</th>
                        <th class="dg-col-source">Source</th>
                        <th>Message</th>
                        <th class="dg-col-ip">IP</th>
                        <th class="dg-col-time">Time</th>
                        <th class="dg-col-ctx">Context</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ($logs as $i => $log): ?>
                        <?php $style = $typeStyle[$log->type] ?? $typeStyle['error']; ?>
                        <tr>
                            <td class="dg-serial"><?= $i + 1 ?></td>
                            <td>
                                <span class="dg-badge" style="background:<?= $style['bg'] ?>;color:<?= $style['text'] ?>;">
                                    <?= Html::encode($log->type) ?>
                                </span>
                            </td>
                            <td>
                                <span class="dg-source-badge"><?= Html::encode($log->source) ?></span>
                            </td>
                            <td class="dg-text-dark"><?= Html::encode($log->message) ?></td>
                            <td class="dg-contact-secondary"><?= Html::encode($log->ip) ?></td>
                            <td>
                                <div class="dg-date-primary"><?= date('d M Y', strtotime($log->created_at)) ?></div>
                                <div class="dg-date-secondary"><?= date('h:i:s A', strtotime($log->created_at)) ?></div>
                            </td>
                            <td>
                                <?php if ($log->context && $log->context !== '[]'): ?>
                                    <button class="btn-dg-context"
                                            data-toggle="modal"
                                            data-target="#ctx-<?= $log->id ?>">
                                        <i class="fas fa-code fa-xs"></i> View
                                    </button>
                                    <div class="modal fade dg-modal" id="ctx-<?= $log->id ?>" tabindex="-1">
                                        <div class="modal-dialog modal-lg">
                                            <div class="modal-content">
                                                <div class="modal-header dg-modal-header">
                                                    <h5 class="dg-modal-title">
                                                        <i class="fas fa-bug mr-2 dg-icon-accent"></i>
                                                        Error Context — Log #<?= $log->id ?>
                                                    </h5>
                                                    <button type="button" class="close" data-dismiss="modal">
                                                        <span>&times;</span>
                                                    </button>
                                                </div>
                                                <div class="modal-body p-0">
                                                    <pre class="dg-code-block"><?= Html::encode($log->context) ?></pre>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                <?php else: ?>
                                    <span class="dg-soft-dash">—</span>
                                <?php endif; ?>
                            </td>
                        </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        </div>
    <?php endif; ?>
</div>

<?php

/** @var yii\web\View $this */
/** @var app\models\User $user */
/** @var string[] $errors */

use yii\helpers\Html;
use yii\helpers\Url;

$this->title = 'My Profile';
?>

<?php if (Yii::$app->session->hasFlash('success')): ?>
    <div class="dg-alert dg-alert-success mb-4">
        <i class="fas fa-check-circle"></i>
        <?= Html::encode(Yii::$app->session->getFlash('success')) ?>
    </div>
<?php endif; ?>

<?php if (!empty($errors)): ?>
    <div class="dg-alert dg-alert-danger mb-4">
        <i class="fas fa-exclamation-circle"></i>
        <div>
            <?php foreach ($errors as $err): ?>
                <div><?= Html::encode($err) ?></div>
            <?php endforeach; ?>
        </div>
    </div>
<?php endif; ?>

<form method="post" action="<?= Url::to(['/profile/index']) ?>">
    <input type="hidden" name="<?= Yii::$app->request->csrfParam ?>" value="<?= Yii::$app->request->csrfToken ?>">

    <!-- Profile Info Card -->
    <div class="dg-card">
        <div class="dg-card-header">
            <h4 class="dg-card-title">
                <i class="fas fa-user-circle"></i> Profile Information
            </h4>
        </div>
        <div class="card-body">
            <div class="row">
                <!-- Avatar initials -->
                <div class="col-12 mb-4 d-flex align-items-center gap-3">
                    <div class="dg-avatar-profile">
                        <?= strtoupper(mb_substr($user->username ?? 'A', 0, 1)) ?>
                    </div>
                    <div>
                        <div class="dg-profile-name"><?= Html::encode($user->username) ?></div>
                        <div class="dg-profile-sub"><?= Html::encode($user->email ?? '') ?></div>
                    </div>
                </div>

                <div class="col-md-6 mb-3">
                    <label class="dg-filter-label">Username</label>
                    <input type="text" name="username" class="form-control"
                           value="<?= Html::encode($user->username) ?>"
                           placeholder="Enter username" required>
                </div>
                <div class="col-md-6 mb-3">
                    <label class="dg-filter-label">Email Address</label>
                    <input type="email" name="email" class="form-control"
                           value="<?= Html::encode($user->email ?? '') ?>"
                           placeholder="Enter email address">
                </div>
            </div>
        </div>
    </div>

    <!-- Change Password Card -->
    <div class="dg-card">
        <div class="dg-card-header">
            <h4 class="dg-card-title">
                <i class="fas fa-lock"></i> Change Password
            </h4>
            <span class="dg-total-badge">Leave new password blank to keep current</span>
        </div>
        <div class="card-body">
            <div class="row">
                <div class="col-md-4 mb-3">
                    <label class="dg-filter-label">New Password</label>
                    <input type="password" name="new_password" class="form-control"
                           placeholder="Min 8 characters" autocomplete="new-password">
                </div>
                <div class="col-md-4 mb-3">
                    <label class="dg-filter-label">Confirm New Password</label>
                    <input type="password" name="confirm_password" class="form-control"
                           placeholder="Repeat new password" autocomplete="new-password">
                </div>
            </div>
        </div>
    </div>

    <!-- Confirm with current password -->
    <div class="dg-card">
        <div class="dg-card-header">
            <h4 class="dg-card-title">
                <i class="fas fa-key"></i> Confirm Identity
            </h4>
        </div>
        <div class="card-body">
            <div class="row">
                <div class="col-md-4 mb-3">
                    <label class="dg-filter-label">Current Password <span class="dg-required">*</span></label>
                    <input type="password" name="current_password" class="form-control"
                           placeholder="Required to save any changes" required autocomplete="current-password">
                    <small class="text-muted">Your current password is required to confirm all changes.</small>
                </div>
            </div>
            <button type="submit" class="btn-dg-primary px-4 py-2">
                <i class="fas fa-save mr-1"></i> Save Profile
            </button>
        </div>
    </div>

</form>

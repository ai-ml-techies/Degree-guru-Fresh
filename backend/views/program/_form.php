<?php

/** @var yii\web\View $this */
/** @var app\models\Program $model */
/** @var bool $isNew */

use yii\helpers\Html;
use yii\helpers\Url;
use app\models\Program;

$enrollLines  = Program::jsonToLines((string)($model->enroll_for   ?? ''));
$careerLines  = Program::jsonToLines((string)($model->career_roles ?? ''));

function pf(Program $model, string $attr, string $label, string $type = 'text', string $placeholder = ''): string
{
    $err  = $model->getFirstError($attr);
    $cls  = $err ? 'form-control is-invalid' : 'form-control';
    $val  = Html::encode($model->$attr ?? '');
    $id   = "Program_$attr";

    if ($type === 'textarea') {
        $input = "<textarea name=\"Program[$attr]\" id=\"$id\" class=\"$cls\" rows=\"3\" placeholder=\"$placeholder\">$val</textarea>";
    } else {
        $input = "<input type=\"$type\" name=\"Program[$attr]\" id=\"$id\" class=\"$cls\" value=\"$val\" placeholder=\"$placeholder\">";
    }

    $err_html = $err ? "<div class=\"invalid-feedback\">$err</div>" : '';
    return "
        <div class=\"form-group\">
            <label for=\"$id\">$label</label>
            $input
            $err_html
        </div>";
}
?>

<div class="mb-4 d-flex align-items-center gap-2">
    <a href="<?= Url::to(['/program/index']) ?>" class="btn btn-dg-back">
        <i class="fas fa-arrow-left mr-1"></i> Back to Programs
    </a>
    <h1 class="dg-page-title mb-0 ml-3"><?= Html::encode($this->title) ?></h1>
</div>

<?php foreach ($model->errors as $errs): foreach ($errs as $e): ?>
    <div class="alert alert-danger alert-dismissible fade show mb-3" role="alert">
        <?= Html::encode($e) ?>
        <button type="button" class="close" data-dismiss="alert">&times;</button>
    </div>
<?php endforeach; endforeach; ?>

<form method="post" action="<?= $isNew ? Url::to(['/program/create']) : Url::to(['/program/update', 'id' => $model->id]) ?>">
    <input type="hidden" name="<?= Yii::$app->request->csrfParam ?>" value="<?= Yii::$app->request->csrfToken ?>">

    <!-- ── Basic Info ──────────────────────────────────────────────────────── -->
    <div class="dg-card mb-4">
        <div class="dg-card-header">
            <span class="dg-card-title"><i class="fas fa-info-circle mr-2" class="dg-icon-purple"></i>Basic Info</span>
        </div>
        <div class="card-body">
            <div class="row">
                <div class="col-md-4">
                    <?= pf($model, 'name', 'Short Name <span class="text-danger">*</span>', 'text', 'e.g. Online MBA') ?>
                </div>
                <div class="col-md-4">
                    <?= pf($model, 'full_name', 'Full Degree Name', 'text', 'e.g. Master of Business Administration') ?>
                </div>
                <div class="col-md-4">
                    <?php
                        $err = $model->getFirstError('level');
                        $cls = $err ? 'form-control is-invalid' : 'form-control';
                    ?>
                    <div class="form-group">
                        <label for="Program_level">Level <span class="text-danger">*</span></label>
                        <select name="Program[level]" id="Program_level" class="<?= $cls ?>">
                            <?php foreach (['Bachelors', 'Masters', 'Doctoral', 'Skills'] as $lvl): ?>
                                <option value="<?= $lvl ?>" <?= $model->level === $lvl ? 'selected' : '' ?>><?= $lvl ?></option>
                            <?php endforeach; ?>
                        </select>
                        <?= $err ? "<div class=\"invalid-feedback\">$err</div>" : '' ?>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-md-4">
                    <?php
                        $err = $model->getFirstError('slug');
                        $cls = $err ? 'form-control is-invalid' : 'form-control';
                        $slug = Html::encode($model->slug ?? '');
                    ?>
                    <div class="form-group">
                        <label for="Program_slug">URL Slug <span class="text-danger">*</span>
                            <small class="text-muted">(lowercase, hyphens only)</small>
                        </label>
                        <div class="input-group">
                            <div class="input-group-prepend">
                                <span class="input-group-text text-muted dg-text-sub">/programs/</span>
                            </div>
                            <input type="text" name="Program[slug]" id="Program_slug" class="<?= $cls ?>"
                                   value="<?= $slug ?>" placeholder="online-mba"
                                   <?= !$isNew ? 'readonly class="dg-input-readonly"' : '' ?>>
                            <?= $err ? "<div class=\"invalid-feedback\">$err</div>" : '' ?>
                        </div>
                        <?php if (!$isNew): ?>
                            <small class="text-muted">Slug cannot be changed after creation (it's the URL).</small>
                        <?php endif; ?>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="form-group">
                        <label for="Program_sort_order">Sort Order</label>
                        <input type="number" name="Program[sort_order]" id="Program_sort_order"
                               class="form-control" value="<?= (int)($model->sort_order ?? 0) ?>" min="0">
                        <small class="text-muted">Lower numbers appear first on frontend</small>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="form-group">
                        <label>Status</label>
                        <div class="custom-control custom-switch mt-2">
                            <input type="hidden" name="Program[is_active]" value="0">
                            <input type="checkbox" class="custom-control-input" id="Program_is_active"
                                   name="Program[is_active]" value="1" <?= ($model->is_active ?? 1) ? 'checked' : '' ?>>
                            <label class="custom-control-label" for="Program_is_active">Show on website</label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- ── Content ─────────────────────────────────────────────────────────── -->
    <div class="dg-card mb-4">
        <div class="dg-card-header">
            <span class="dg-card-title"><i class="fas fa-file-alt mr-2" class="dg-icon-purple"></i>Content</span>
        </div>
        <div class="card-body">
            <?= pf($model, 'desc', 'Card Description (shown on Programs listing)', 'text', 'A short sentence describing this program') ?>
            <?= pf($model, 'tagline', 'Hero Tagline (shown on program detail page)', 'text', 'e.g. The career accelerator working professionals trust.') ?>
            <div class="form-group">
                <label for="Program_about">About (Long Description)</label>
                <textarea name="Program[about]" id="Program_about"
                          class="form-control <?= $model->getFirstError('about') ? 'is-invalid' : '' ?>"
                          rows="5"
                          placeholder="A full paragraph explaining what this program is, who teaches it, and what students gain..."><?= Html::encode($model->about ?? '') ?></textarea>
                <?php if ($err = $model->getFirstError('about')): ?>
                    <div class="invalid-feedback"><?= $err ?></div>
                <?php endif; ?>
            </div>
            <div class="form-group">
                <label for="enroll_for_lines">Who Should Enroll? <small class="text-muted">(one bullet per line)</small></label>
                <textarea name="Program[enroll_for]" id="enroll_for_lines"
                          class="form-control <?= $model->getFirstError('enroll_for') ? 'is-invalid' : '' ?>"
                          rows="4"
                          placeholder="Working professionals targeting promotions&#10;Career switchers moving into management&#10;Founders and entrepreneurs"><?= Html::encode($enrollLines) ?></textarea>
                <small class="text-muted">Each line becomes one bullet on the program page.</small>
            </div>
            <?= pf($model, 'emi_note', 'EMI Note', 'text', 'e.g. No-cost EMI options at top universities, from ₹8,000 per month.') ?>
        </div>
    </div>

    <!-- ── Career Scope ────────────────────────────────────────────────────── -->
    <div class="dg-card mb-4">
        <div class="dg-card-header">
            <span class="dg-card-title"><i class="fas fa-briefcase mr-2" class="dg-icon-purple"></i>Career Scope</span>
        </div>
        <div class="card-body">
            <div class="row">
                <div class="col-md-6">
                    <div class="form-group">
                        <label for="career_roles_lines">Career Roles <small class="text-muted">(one per line)</small></label>
                        <textarea name="Program[career_roles]" id="career_roles_lines"
                                  class="form-control <?= $model->getFirstError('career_roles') ? 'is-invalid' : '' ?>"
                                  rows="4"
                                  placeholder="Business Manager&#10;Product Manager&#10;Consultant"><?= Html::encode($careerLines) ?></textarea>
                    </div>
                </div>
                <div class="col-md-6">
                    <?= pf($model, 'career_salary', 'Average Salary Range', 'text', 'e.g. INR 6 to 25 LPA') ?>
                </div>
            </div>
        </div>
    </div>

    <!-- ── SEO ─────────────────────────────────────────────────────────────── -->
    <div class="dg-card mb-4">
        <div class="dg-card-header">
            <span class="dg-card-title"><i class="fas fa-search mr-2" class="dg-icon-purple"></i>SEO</span>
            <small class="text-muted">Controls what Google and social media show for this program page</small>
        </div>
        <div class="card-body">
            <div class="form-group">
                <label for="Program_meta_title">
                    SEO Title
                    <small class="text-muted">(50–60 chars ideal)</small>
                    <span id="mt_count" class="ml-2" class="dg-char-count">0/70</span>
                </label>
                <input type="text" name="Program[meta_title]" id="Program_meta_title"
                       class="form-control <?= $model->getFirstError('meta_title') ? 'is-invalid' : '' ?>"
                       maxlength="70"
                       placeholder="e.g. Online MBA in India – Degree Guru | Top Universities"
                       value="<?= Html::encode($model->meta_title ?? '') ?>">
                <?php if ($err = $model->getFirstError('meta_title')): ?>
                    <div class="invalid-feedback"><?= $err ?></div>
                <?php else: ?>
                    <small class="text-muted">Leave blank to use the program name. Shown as the Google search headline.</small>
                <?php endif; ?>
            </div>

            <div class="form-group">
                <label for="Program_meta_desc">
                    Meta Description
                    <small class="text-muted">(max 160 chars)</small>
                    <span id="md_count" class="ml-2" class="dg-char-count">0/160</span>
                </label>
                <textarea name="Program[meta_desc]" id="Program_meta_desc"
                          class="form-control <?= $model->getFirstError('meta_desc') ? 'is-invalid' : '' ?>"
                          rows="2" maxlength="160"
                          placeholder="e.g. Compare top Online MBA programs in India. Free counseling, no-cost EMI, placement support. Apply at Degree Guru."><?= Html::encode($model->meta_desc ?? '') ?></textarea>
                <?php if ($err = $model->getFirstError('meta_desc')): ?>
                    <div class="invalid-feedback"><?= $err ?></div>
                <?php else: ?>
                    <small class="text-muted">Shown under the title in Google search results. Write it like a 1-line ad.</small>
                <?php endif; ?>
            </div>

            <div class="row">
                <div class="col-md-8">
                    <div class="form-group">
                        <label for="Program_og_image">OG Image URL</label>
                        <input type="url" name="Program[og_image]" id="Program_og_image"
                               class="form-control <?= $model->getFirstError('og_image') ? 'is-invalid' : '' ?>"
                               placeholder="https://degreeguru.in/images/og-mba.jpg"
                               value="<?= Html::encode($model->og_image ?? '') ?>">
                        <?php if ($err = $model->getFirstError('og_image')): ?>
                            <div class="invalid-feedback"><?= $err ?></div>
                        <?php else: ?>
                            <small class="text-muted">Shown when someone shares this page on WhatsApp, Facebook, LinkedIn. Use 1200×630 px.</small>
                        <?php endif; ?>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="form-group">
                        <label for="Program_focus_keyword">Focus Keyword</label>
                        <input type="text" name="Program[focus_keyword]" id="Program_focus_keyword"
                               class="form-control <?= $model->getFirstError('focus_keyword') ? 'is-invalid' : '' ?>"
                               placeholder="online mba india"
                               value="<?= Html::encode($model->focus_keyword ?? '') ?>">
                        <?php if ($err = $model->getFirstError('focus_keyword')): ?>
                            <div class="invalid-feedback"><?= $err ?></div>
                        <?php else: ?>
                            <small class="text-muted">Main keyword you want this page to rank for.</small>
                        <?php endif; ?>
                    </div>
                </div>
            </div>

            <!-- Google preview -->
            <div class="dg-seo-preview mt-1">
                <div class="dg-seo-preview-heading">
                    <i class="fab fa-google mr-1"></i> Google Preview
                </div>
                <div id="gp_url" class="dg-seo-url">
                    degreeguru.in/programs/<?= Html::encode($model->slug ?? 'your-program') ?>
                </div>
                <div id="gp_title" class="dg-seo-title">
                    <?= Html::encode($model->meta_title ?: ($model->name ? $model->name . ' | Degree Guru' : 'SEO Title will appear here')) ?>
                </div>
                <div id="gp_desc" class="dg-seo-desc">
                    <?= Html::encode($model->meta_desc ?: 'Meta description will appear here. Write 1–2 sentences that make someone want to click.') ?>
                </div>
            </div>
        </div>
    </div>

    <!-- ── Actions ─────────────────────────────────────────────────────────── -->
    <div class="d-flex gap-2 mb-5">
        <button type="submit" class="btn btn-dg-primary px-5">
            <i class="fas fa-save mr-1"></i> <?= $isNew ? 'Create Program' : 'Save Changes' ?>
        </button>
        <a href="<?= Url::to(['/program/index']) ?>" class="btn btn-outline-secondary">Cancel</a>
    </div>
</form>

<script>
(function () {
    var mtInput  = document.getElementById('Program_meta_title');
    var mdInput  = document.getElementById('Program_meta_desc');
    var mtCount  = document.getElementById('mt_count');
    var mdCount  = document.getElementById('md_count');
    var gpTitle  = document.getElementById('gp_title');
    var gpDesc   = document.getElementById('gp_desc');
    var nameInput = document.getElementById('Program_name');
    var slug     = '<?= Html::encode($model->slug ?? '') ?>';

    function colorCount(el, val, warn, max) {
        el.textContent = val + '/' + max;
        el.style.color = val > max ? '#dc2626' : val >= warn ? '#d97706' : '#6c45e0';
    }

    function updatePreview() {
        var title = mtInput.value.trim() || (nameInput ? nameInput.value.trim() + ' | Degree Guru' : 'SEO Title will appear here');
        var desc  = mdInput.value.trim() || 'Meta description will appear here.';
        gpTitle.textContent = title;
        gpDesc.textContent  = desc;
    }

    mtInput.addEventListener('input', function () {
        colorCount(mtCount, this.value.length, 50, 70);
        updatePreview();
    });
    mdInput.addEventListener('input', function () {
        colorCount(mdCount, this.value.length, 120, 160);
        updatePreview();
    });
    if (nameInput) nameInput.addEventListener('input', updatePreview);

    // Init counters on page load
    colorCount(mtCount, mtInput.value.length, 50, 70);
    colorCount(mdCount, mdInput.value.length, 120, 160);
})();
</script>

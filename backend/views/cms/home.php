<?php

/** @var yii\web\View $this */
/** @var array  $s              key => value map of current settings */
/** @var array  $errors         field-key => error message */
/** @var string|null $activeSection  section that just failed validation */

use yii\helpers\Html;
use yii\helpers\Url;

$this->title = 'Home Page Content';

// Helpers
$val  = fn(string $key) => Html::encode($s[$key] ?? '');
$err  = fn(string $key) => $errors[$key] ?? null;
$hasE = fn(string $key) => isset($errors[$key]);

// Renders a labelled text input with inline error
function field(string $name, string $label, string $placeholder, string $val, bool $hasErr, ?string $errMsg, string $type = 'text', string $extra = ''): string {
    $cls = $hasErr ? 'form-control is-invalid' : 'form-control';
    $id  = 'f_' . str_replace(['.','[',']'], '_', $name);
    $html  = '<div class="form-group mb-3">';
    $html .= '<label for="' . $id . '" class="dg-filter-label">' . $label . '</label>';
    $html .= '<input type="' . $type . '" id="' . $id . '" name="' . $name . '" class="' . $cls . '" placeholder="' . $placeholder . '" value="' . $val . '" ' . $extra . '>';
    if ($hasErr) {
        $html .= '<div class="dg-field-error">' . Html::encode($errMsg) . '</div>';
    }
    $html .= '</div>';
    return $html;
}

function textarea(string $name, string $label, string $placeholder, string $val, int $rows = 3): string {
    $id   = 'f_' . $name;
    $html  = '<div class="form-group mb-3">';
    $html .= '<label for="' . $id . '" class="dg-filter-label">' . $label . '</label>';
    $html .= '<textarea id="' . $id . '" name="' . $name . '" class="form-control" rows="' . $rows . '" placeholder="' . $placeholder . '">' . $val . '</textarea>';
    $html .= '</div>';
    return $html;
}

// CSRF
$csrf     = Yii::$app->request->csrfParam;
$csrfTok  = Yii::$app->request->csrfToken;
$saveUrl  = Url::to(['/cms/home']);
$clearUrl = Url::to(['/cms/clear-section']);
?>


<?php if (Yii::$app->session->hasFlash('success')): ?>
    <div class="dg-alert dg-alert-success mb-3">
        <i class="fas fa-check-circle"></i>
        <?= Html::encode(Yii::$app->session->getFlash('success')) ?>
    </div>
<?php endif; ?>
<?php if (Yii::$app->session->hasFlash('error')): ?>
    <div class="dg-alert dg-alert-danger mb-3">
        <i class="fas fa-exclamation-circle"></i>
        <?= Html::encode(Yii::$app->session->getFlash('error')) ?>
    </div>
<?php endif; ?>

<div class="dg-page-heading">
    <h4>Home Page Content</h4>
    <p>Each section saves and clears independently. Errors appear below the field.</p>
</div>

<?php
// ─── Macro: open a section form ────────────────────────────────────────────
function sectionOpen(string $key, string $icon, string $title, string $badge, string $saveUrl, string $clearUrl, string $csrf, string $csrfTok): void {
    echo '<div class="dg-card" id="section-' . $key . '">';
    echo '<div class="cms-section-header">';
    echo '<h4 class="dg-card-title"><i class="' . $icon . '"></i> ' . $title . '</h4>';
    echo '<div class="cms-section-actions">';
    echo '<span class="dg-total-badge">' . $badge . '</span>';
    // Clear form
    echo '<form method="post" action="' . $clearUrl . '" onsubmit="return confirmClear(\'' . addslashes($title) . '\')" class="m-0">';
    echo '<input type="hidden" name="' . $csrf . '" value="' . $csrfTok . '">';
    echo '<input type="hidden" name="section" value="' . $key . '">';
    echo '<button type="submit" class="btn-clear-section"><i class="fas fa-trash fa-xs"></i> Clear</button>';
    echo '</form>';
    echo '</div>';
    echo '</div>';
    // Save form opens here
    echo '<form method="post" action="' . $saveUrl . '" novalidate>';
    echo '<input type="hidden" name="' . $csrf . '" value="' . $csrfTok . '">';
    echo '<input type="hidden" name="section" value="' . $key . '">';
    echo '<div class="card-body">';
}

function sectionClose(): void {
    echo '</div>'; // card-body
    echo '<div class="dg-card-body pt-2">';
    echo '<button type="submit" class="btn-save-section"><i class="fas fa-save fa-xs"></i> Save Section</button>';
    echo '</div>';
    echo '</form>';
    echo '</div>'; // dg-card
}
?>

<!-- ══════════════════════════════════════════════════════════════════════════
     0. SEO (meta tags for the homepage)
══════════════════════════════════════════════════════════════════════════ -->
<?php sectionOpen('seo', 'fas fa-search', 'SEO — Homepage', 'Controls Google & social previews', $saveUrl, $clearUrl, $csrf, $csrfTok); ?>
<div class="row">
    <div class="col-12">
        <div class="form-group mb-3">
            <label class="dg-filter-label">
                SEO Title
                <small class="text-muted">(50–60 chars ideal)</small>
                <span id="seo_mt_count" class="ml-2 dg-char-count">0/70</span>
            </label>
            <input type="text" name="s[seo_title]" id="f_seo_title" maxlength="70"
                   class="form-control <?= $hasE('seo_title') ? 'is-invalid' : '' ?>"
                   placeholder="Degree Guru | India's #1 Free Career Counseling Platform"
                   value="<?= $val('seo_title') ?>">
            <?php if ($hasE('seo_title')): ?>
                <div class="dg-field-error"><?= Html::encode($err('seo_title')) ?></div>
            <?php else: ?>
                <small class="text-muted">The &lt;title&gt; tag shown in Google results and browser tabs.</small>
            <?php endif; ?>
        </div>
    </div>
    <div class="col-12">
        <div class="form-group mb-3">
            <label class="dg-filter-label">
                Meta Description
                <small class="text-muted">(max 160 chars)</small>
                <span id="seo_md_count" class="ml-2 dg-char-count">0/160</span>
            </label>
            <textarea name="s[seo_description]" id="f_seo_description" maxlength="160"
                      class="form-control" rows="2"
                      placeholder="Compare online degree courses, universities, fees & no cost EMI with free counselling, placement support and career guidance for students at Degree Guru."><?= $val('seo_description') ?></textarea>
            <small class="text-muted">Shown under the title in Google search results. Write it like a 1-line ad.</small>
        </div>
    </div>
    <div class="col-md-8">
        <div class="form-group mb-3">
            <label class="dg-filter-label">OG Image URL <small class="text-muted">(1200×630 px)</small></label>
            <input type="url" name="s[seo_og_image]" id="f_seo_og_image"
                   class="form-control"
                   placeholder="https://degreeguru.in/images/og-home.jpg"
                   value="<?= $val('seo_og_image') ?>">
            <small class="text-muted">Shown on WhatsApp, Facebook, LinkedIn when someone shares the homepage.</small>
        </div>
    </div>
    <div class="col-md-4">
        <div class="form-group mb-3">
            <label class="dg-filter-label">Focus Keyword</label>
            <input type="text" name="s[seo_focus_keyword]" id="f_seo_focus_keyword"
                   class="form-control"
                   placeholder="online degree india"
                   value="<?= $val('seo_focus_keyword') ?>">
            <small class="text-muted">The main keyword you want the homepage to rank for.</small>
        </div>
    </div>
    <div class="col-md-4">
        <div class="form-group mb-3">
            <label class="dg-filter-label">Robots</label>
            <select name="s[seo_robots]" class="form-control">
                <?php foreach (['index,follow', 'noindex,nofollow', 'noindex,follow', 'index,nofollow'] as $r): ?>
                    <option value="<?= $r ?>" <?= $val('seo_robots') === $r ? 'selected' : '' ?>><?= $r ?></option>
                <?php endforeach; ?>
            </select>
            <small class="text-muted">Keep <code>index,follow</code> for live pages.</small>
        </div>
    </div>
</div>

<!-- Live Google preview -->
<div class="dg-seo-preview">
    <div class="dg-seo-preview-heading">
        <i class="fab fa-google mr-1"></i> Google Preview
    </div>
    <div class="dg-seo-url">degreeguru.in</div>
    <div id="seo_gp_title" class="dg-seo-title">
        <?= $val('seo_title') ?: "Degree Guru | India's #1 Free Career Counseling Platform" ?>
    </div>
    <div id="seo_gp_desc" class="dg-seo-desc">
        <?= $val('seo_description') ?: 'Meta description will appear here.' ?>
    </div>
</div>

<script>
(function () {
    var mtIn  = document.getElementById('f_seo_title');
    var mdIn  = document.getElementById('f_seo_description');
    var mtCnt = document.getElementById('seo_mt_count');
    var mdCnt = document.getElementById('seo_md_count');
    var gpT   = document.getElementById('seo_gp_title');
    var gpD   = document.getElementById('seo_gp_desc');

    function colorCount(el, val, warn, max) {
        el.textContent = val + '/' + max;
        el.style.color = val > max ? '#dc2626' : val >= warn ? '#d97706' : '#6c45e0';
    }
    mtIn.addEventListener('input', function () {
        colorCount(mtCnt, this.value.length, 50, 70);
        gpT.textContent = this.value || "Degree Guru | India's #1 Free Career Counseling Platform";
    });
    mdIn.addEventListener('input', function () {
        colorCount(mdCnt, this.value.length, 120, 160);
        gpD.textContent = this.value || 'Meta description will appear here.';
    });
    colorCount(mtCnt, mtIn.value.length, 50, 70);
    colorCount(mdCnt, mdIn.value.length, 120, 160);
})();
</script>
<?php sectionClose(); ?>

<!-- ══════════════════════════════════════════════════════════════════════════
     1. HERO
══════════════════════════════════════════════════════════════════════════ -->
<?php sectionOpen('hero', 'fas fa-star', 'Hero Section', 'Top banner', $saveUrl, $clearUrl, $csrf, $csrfTok); ?>
<div class="row">
    <div class="col-12">
        <?= field('s[hero_h1]', 'Main Heading (H1) <span class="dg-required">*</span>', "India's #1 Most Trusted Career Counselling Platform", $val('hero_h1'), $hasE('hero_h1'), $err('hero_h1')) ?>
        <small class="text-muted dg-field-hint">Wrap a word in &lt;span&gt;&lt;/span&gt; to highlight in purple.</small>
    </div>
    <div class="col-12">
        <?= textarea('s[hero_subtitle]', 'Sub-heading / Paragraph', "100% online degree courses from India's top universities...", $val('hero_subtitle'), 2) ?>
    </div>
    <div class="col-md-6">
        <?= field('s[hero_cta_primary]', 'Primary CTA Button Text', 'Get Free Counseling', $val('hero_cta_primary'), false, '') ?>
    </div>
    <div class="col-md-6">
        <?= field('s[hero_cta_secondary]', 'Secondary CTA Button Text', 'Explore Programs', $val('hero_cta_secondary'), false, '') ?>
    </div>
    <div class="col-md-4">
        <?= field('s[hero_badge_1]', 'Trust Badge 1', 'AICTE Approved', $val('hero_badge_1'), false, '') ?>
    </div>
    <div class="col-md-4">
        <?= field('s[hero_badge_2]', 'Trust Badge 2', 'UGC Entitled', $val('hero_badge_2'), false, '') ?>
    </div>
    <div class="col-md-4">
        <?= field('s[hero_badge_3]', 'Trust Badge 3', 'Easy EMI', $val('hero_badge_3'), false, '') ?>
    </div>
</div>
<hr class="dg-hr">
<div class="form-group mb-0">
    <label class="dg-filter-label">Hero Image <small class="text-muted">(JPG/PNG/WebP, max 5 MB, ideally 900×1100 px portrait)</small></label>

    <!-- Upload zone -->
    <div id="hero_drop_zone" class="dg-drop-zone">
        <input type="file" id="hero_file_input" accept="image/jpeg,image/png,image/webp,image/gif"
               class="dg-drop-zone-input">
        <div id="hero_drop_idle">
            <i class="fas fa-cloud-upload-alt dg-drop-zone-icon"></i>
            <div class="dg-drop-zone-label">Click to upload or drag &amp; drop</div>
            <div class="dg-drop-zone-hint">JPG, PNG, WebP or GIF · max 5 MB</div>
        </div>
        <div id="hero_drop_uploading" class="dg-drop-zone-uploading" style="display:none;">
            <i class="fas fa-spinner fa-spin dg-drop-zone-spinner"></i>
            <div class="dg-drop-zone-label mt-2">Uploading…</div>
        </div>
        <div id="hero_drop_error" class="dg-field-error" style="display:none;"></div>
    </div>

    <!-- Preview + controls (shown after upload or if URL already set) -->
    <div id="hero_img_result" class="dg-img-result mt-3" <?= $val('hero_image') ? '' : 'style="display:none;"' ?>>
        <div class="dg-img-result-inner">
            <img id="hero_img_thumb"
                 src="<?= Html::encode($val('hero_image')) ?>"
                 alt="Hero preview"
                 class="dg-img-thumb">
            <div class="dg-img-result-body">
                <div class="dg-filter-label mb-1">Uploaded image URL</div>
                <input type="url" name="s[hero_image]" id="f_hero_image"
                       class="form-control dg-text-sub"
                       placeholder="https://…"
                       value="<?= Html::encode($val('hero_image')) ?>">
                <small class="text-muted">Auto-filled after upload. You can also paste any public image URL here directly.</small>
                <div class="mt-2">
                    <button type="button" id="hero_remove_btn" class="dg-remove-btn">
                        <i class="fas fa-trash fa-xs mr-1"></i>Remove
                    </button>
                </div>
            </div>
        </div>
    </div>

    <!-- Hidden fallback input so section saves empty string when removed -->
    <input type="hidden" name="s[hero_image]" id="f_hero_image_empty" value=""
           <?= $val('hero_image') ? 'disabled' : '' ?>>
</div>

<script>
(function () {
    var dropZone   = document.getElementById('hero_drop_zone');
    var fileInput  = document.getElementById('hero_file_input');
    var idle       = document.getElementById('hero_drop_idle');
    var uploading  = document.getElementById('hero_drop_uploading');
    var errDiv     = document.getElementById('hero_drop_error');
    var result     = document.getElementById('hero_img_result');
    var thumb      = document.getElementById('hero_img_thumb');
    var urlInput   = document.getElementById('f_hero_image');
    var emptyInput = document.getElementById('f_hero_image_empty');
    var removeBtn  = document.getElementById('hero_remove_btn');
    var csrf       = '<?= Yii::$app->request->csrfToken ?>';
    var uploadUrl  = '<?= \yii\helpers\Url::to(['/cms/upload-image']) ?>';

    function showResult(url) {
        thumb.src       = url;
        urlInput.value  = url;
        urlInput.disabled = false;
        emptyInput.disabled = true;
        result.style.display    = '';
        dropZone.style.display  = 'none';
        errDiv.style.display    = 'none';
    }

    function showIdle() {
        idle.style.display      = '';
        uploading.style.display = 'none';
        errDiv.style.display    = 'none';
    }

    function doUpload(file) {
        idle.style.display      = 'none';
        uploading.style.display = '';
        errDiv.style.display    = 'none';

        var fd = new FormData();
        fd.append('image', file);
        fd.append('<?= Yii::$app->request->csrfParam ?>', csrf);

        fetch(uploadUrl, { method: 'POST', body: fd })
            .then(function (r) { return r.json(); })
            .then(function (data) {
                if (data.url) {
                    showResult(data.url);
                } else {
                    errDiv.textContent  = data.error || 'Upload failed.';
                    errDiv.style.display = '';
                    showIdle();
                }
            })
            .catch(function () {
                errDiv.textContent  = 'Network error. Please try again.';
                errDiv.style.display = '';
                showIdle();
            });
    }

    // File picker
    fileInput.addEventListener('change', function () {
        if (this.files[0]) doUpload(this.files[0]);
    });

    // Drag-and-drop highlight
    dropZone.addEventListener('dragover', function (e) {
        e.preventDefault();
        this.style.borderColor = '#6c45e0';
        this.style.background  = '#f0ecff';
    });
    dropZone.addEventListener('dragleave', function () {
        this.style.borderColor = '#c4b5fd';
        this.style.background  = '#faf8ff';
    });
    dropZone.addEventListener('drop', function (e) {
        e.preventDefault();
        this.style.borderColor = '#c4b5fd';
        this.style.background  = '#faf8ff';
        var file = e.dataTransfer.files[0];
        if (file) doUpload(file);
    });

    // Manual URL paste still works
    urlInput.addEventListener('input', function () {
        var url = this.value.trim();
        if (url) { thumb.src = url; }
    });

    // Remove button
    removeBtn.addEventListener('click', function () {
        urlInput.value      = '';
        urlInput.disabled   = true;
        emptyInput.disabled = false;
        result.style.display   = 'none';
        dropZone.style.display = '';
        fileInput.value        = '';
        showIdle();
    });

    // If a URL is already saved, hide the drop zone on load
    if (urlInput.value.trim()) {
        dropZone.style.display = 'none';
        emptyInput.disabled    = true;
    }
})();
</script>
<?php sectionClose(); ?>

<!-- ══════════════════════════════════════════════════════════════════════════
     2. STATS BAR
══════════════════════════════════════════════════════════════════════════ -->
<?php sectionOpen('stats', 'fas fa-chart-bar', 'Stats Bar', 'Purple banner below hero', $saveUrl, $clearUrl, $csrf, $csrfTok); ?>
<?php foreach ([1, 2, 3] as $n): ?>
    <span class="card-inner-label">Stat <?= $n ?></span>
    <div class="row">
        <div class="col-md-3">
            <?= field("s[stat{$n}_value]", 'Number', '5000', $val("stat{$n}_value"), $hasE("stat{$n}_value"), $err("stat{$n}_value"), 'number', 'min="0"') ?>
        </div>
        <div class="col-md-3">
            <?= field("s[stat{$n}_suffix]", 'Suffix (+, %)', '+', $val("stat{$n}_suffix"), false, '') ?>
        </div>
        <div class="col-md-6">
            <?= field("s[stat{$n}_label]", 'Label', 'Students Guided', $val("stat{$n}_label"), false, '') ?>
        </div>
    </div>
    <?php if ($n < 3): ?><hr class="section-divider"><?php endif; ?>
<?php endforeach; ?>
<?php sectionClose(); ?>

<!-- ══════════════════════════════════════════════════════════════════════════
     3. VISION
══════════════════════════════════════════════════════════════════════════ -->
<?php sectionOpen('vision', 'fas fa-eye', 'Vision Section', '', $saveUrl, $clearUrl, $csrf, $csrfTok); ?>
<div class="row">
    <div class="col-md-4">
        <?= field('s[vision_overline]', 'Overline (small label above heading)', 'Our Vision', $val('vision_overline'), false, '') ?>
    </div>
    <div class="col-md-8">
        <?= field('s[vision_h2]', 'Heading (H2)', 'Empowering Viksit Bharat...', $val('vision_h2'), false, '') ?>
    </div>
    <div class="col-12">
        <?= textarea('s[vision_body]', 'Body Paragraph', 'At Degree Guru, we believe...', $val('vision_body'), 4) ?>
    </div>
</div>
<?php sectionClose(); ?>

<!-- ══════════════════════════════════════════════════════════════════════════
     4. PROGRAMS SECTION HEADER
══════════════════════════════════════════════════════════════════════════ -->
<?php sectionOpen('programs', 'fas fa-graduation-cap', 'Programs Section Header', 'Heading only — manage individual programs separately', $saveUrl, $clearUrl, $csrf, $csrfTok); ?>
<div class="row">
    <div class="col-md-4">
        <?= field('s[programs_overline]', 'Overline', 'Explore Programs', $val('programs_overline'), false, '') ?>
    </div>
    <div class="col-md-8">
        <?= field('s[programs_h2]', 'Heading (H2)', 'Online Programs for Every Career Stage', $val('programs_h2'), false, '') ?>
    </div>
    <div class="col-12">
        <?= field('s[programs_subtitle]', 'Subtitle', 'Bachelors, masters, doctorate...', $val('programs_subtitle'), false, '') ?>
    </div>
</div>
<?php sectionClose(); ?>

<!-- ══════════════════════════════════════════════════════════════════════════
     5. WHY US (4 feature cards)
══════════════════════════════════════════════════════════════════════════ -->
<?php sectionOpen('whyus', 'fas fa-shield-alt', 'Why Us Section', '4 feature cards', $saveUrl, $clearUrl, $csrf, $csrfTok); ?>
<div class="row mb-2">
    <div class="col-md-4">
        <?= field('s[whyus_overline]', 'Overline', 'Why Trust Us', $val('whyus_overline'), false, '') ?>
    </div>
    <div class="col-md-8">
        <?= field('s[whyus_h2]', 'Heading (H2)', 'Why Thousands Choose Degree Guru', $val('whyus_h2'), false, '') ?>
    </div>
</div>
<hr class="section-divider">
<?php foreach ([1, 2, 3, 4] as $n): ?>
    <span class="card-inner-label">Card <?= $n ?></span>
    <div class="row">
        <div class="col-md-4">
            <?= field("s[why{$n}_title]", 'Title', 'Card title', $val("why{$n}_title"), false, '') ?>
        </div>
        <div class="col-md-8">
            <?= field("s[why{$n}_desc]", 'Description', 'Card description', $val("why{$n}_desc"), false, '') ?>
        </div>
    </div>
    <?php if ($n < 4): ?><hr class="section-divider"><?php endif; ?>
<?php endforeach; ?>
<?php sectionClose(); ?>

<!-- ══════════════════════════════════════════════════════════════════════════
     6. HOW IT WORKS (3 steps)
══════════════════════════════════════════════════════════════════════════ -->
<?php sectionOpen('how', 'fas fa-list-ol', 'How It Works', '3 numbered steps', $saveUrl, $clearUrl, $csrf, $csrfTok); ?>
<div class="row mb-2">
    <div class="col-md-4">
        <?= field('s[how_overline]', 'Overline', 'Your Journey', $val('how_overline'), false, '') ?>
    </div>
    <div class="col-md-8">
        <?= field('s[how_h2]', 'Heading (H2)', '3 Steps to Your Online Degree', $val('how_h2'), false, '') ?>
    </div>
</div>
<hr class="section-divider">
<?php foreach ([1, 2, 3] as $n): ?>
    <span class="card-inner-label">Step <?= $n ?></span>
    <div class="row">
        <div class="col-md-2">
            <?= field("s[step{$n}_num]", 'Number Label', "0{$n}", $val("step{$n}_num"), false, '') ?>
        </div>
        <div class="col-md-4">
            <?= field("s[step{$n}_title]", 'Title', 'Step title', $val("step{$n}_title"), false, '') ?>
        </div>
        <div class="col-md-6">
            <?= field("s[step{$n}_desc]", 'Description', 'Step description', $val("step{$n}_desc"), false, '') ?>
        </div>
    </div>
    <?php if ($n < 3): ?><hr class="section-divider"><?php endif; ?>
<?php endforeach; ?>
<?php sectionClose(); ?>

<!-- ══════════════════════════════════════════════════════════════════════════
     7. SCHOOLING
══════════════════════════════════════════════════════════════════════════ -->
<?php sectionOpen('schooling', 'fas fa-school', 'Schooling Section', 'Class 10 / 12 block', $saveUrl, $clearUrl, $csrf, $csrfTok); ?>
<div class="row">
    <div class="col-md-4">
        <?= field('s[schooling_overline]', 'Overline', 'Schooling Online', $val('schooling_overline'), false, '') ?>
    </div>
    <div class="col-md-8">
        <?= field('s[schooling_h2]', 'Heading (H2)', 'Complete Your Schooling Online', $val('schooling_h2'), false, '') ?>
    </div>
    <div class="col-12">
        <?= textarea('s[schooling_body]', 'Body Text', 'Missed formal schooling?...', $val('schooling_body'), 2) ?>
    </div>
</div>
<hr class="section-divider">
<div class="row">
    <div class="col-md-6">
        <span class="card-inner-label">Card 1 — Class 10</span>
        <?= field('s[school_card1_title]', 'Card Title', 'Class 10 Online', $val('school_card1_title'), false, '') ?>
        <?= field('s[school_card1_sub]', 'Card Subtitle', 'Secondary education from home.', $val('school_card1_sub'), false, '') ?>
    </div>
    <div class="col-md-6">
        <span class="card-inner-label">Card 2 — Class 12</span>
        <?= field('s[school_card2_title]', 'Card Title', 'Class 12 Online', $val('school_card2_title'), false, '') ?>
        <?= field('s[school_card2_sub]', 'Card Subtitle', 'Senior secondary, your way.', $val('school_card2_sub'), false, '') ?>
    </div>
</div>
<?php sectionClose(); ?>

<!-- ══════════════════════════════════════════════════════════════════════════
     8. TESTIMONIALS (dynamic — add / remove any number)
══════════════════════════════════════════════════════════════════════════ -->
<?php sectionOpen('testimonials', 'fas fa-quote-left', 'Testimonials', 'Dynamic — add any number', $saveUrl, $clearUrl, $csrf, $csrfTok); ?>
<span class="card-inner-label">Section Heading</span>
<div class="row mb-2">
    <div class="col-md-4">
        <?= field('s[testimonials_overline]', 'Overline <small class="text-muted font-weight-normal">(small label above heading)</small>', 'Stories', $val('testimonials_overline'), false, '') ?>
    </div>
    <div class="col-md-8">
        <?= field('s[testimonials_h2]', 'Section Heading (H2)', 'Real Learners, Real Results', $val('testimonials_h2'), false, '') ?>
    </div>
</div>
<hr class="section-divider">
<span class="card-inner-label">Student Testimonials</span>

<div id="testimonials_list" class="dg-dynamic-list"></div>
<button type="button" onclick="addTestimonial()" class="dg-add-btn">
    <i class="fas fa-plus fa-xs"></i> Add Testimonial
</button>
<input type="hidden" name="s[testimonials_json]" id="testimonials_json_input" value="<?= Html::encode($val('testimonials_json')) ?>">

<script>
(function () {
    var list   = document.getElementById('testimonials_list');
    var jsonIn = document.getElementById('testimonials_json_input');
    var items  = [];

    try { items = JSON.parse(jsonIn.value || '[]'); } catch(e) { items = []; }
    if (!Array.isArray(items) || items.length === 0) {
        items = [
            {name:'Priya Sharma',  role:'Online MBA, NMIMS',    text:'Degree Guru helped me compare four universities honestly. I picked the right MBA in a week. No pressure, just facts.'},
            {name:'Rohan Verma',   role:'Online BCA, LPU',      text:'I work full-time. Their counselor matched a program that fits my schedule perfectly. Enrolled in 3 days.'},
            {name:'Aisha Khan',    role:'Online MA, Amity',     text:'Free, friendly and patient. They answered every question without any pressure. Highly recommend.'},
        ];
    }

    function sync() {
        var out = [];
        list.querySelectorAll('.trow').forEach(function (row) {
            out.push({
                name: row.querySelector('[data-f="name"]').value.trim(),
                role: row.querySelector('[data-f="role"]').value.trim(),
                text: row.querySelector('[data-f="text"]').value.trim(),
            });
        });
        jsonIn.value = JSON.stringify(out);
    }

    window.addTestimonial = function (item) {
        item = item || {name:'',role:'',text:''};
        var row = document.createElement('div');
        row.className = 'trow dg-dynamic-row';
        row.innerHTML =
            '<div><label class="card-inner-label">Full Name</label>' +
            '<input data-f="name" class="form-control form-control-sm" placeholder="Priya Sharma" value="'+escHtml(item.name)+'"></div>' +
            '<div><label class="card-inner-label">Program &amp; University</label>' +
            '<input data-f="role" class="form-control form-control-sm" placeholder="Online MBA, NMIMS" value="'+escHtml(item.role)+'"></div>' +
            '<div><label class="card-inner-label">Testimonial Text</label>' +
            '<input data-f="text" class="form-control form-control-sm" placeholder="What the student said…" value="'+escHtml(item.text)+'"></div>' +
            '<div class="dg-dynamic-row-action"><button type="button" onclick="this.closest(\'.trow\').remove();sync()" class="dg-remove-btn" title="Remove"><i class="fas fa-trash fa-xs"></i></button></div>';
        row.querySelectorAll('input').forEach(function(i){i.addEventListener('input',sync);});
        list.appendChild(row);
        sync();
    };

    function escHtml(s) { return (s||'').replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;'); }

    items.forEach(function (item) { window.addTestimonial(item); });
    window.sync = sync;
})();
</script>
<?php sectionClose(); ?>

<!-- ══════════════════════════════════════════════════════════════════════════
     9. CTA BANNER
══════════════════════════════════════════════════════════════════════════ -->
<?php sectionOpen('cta', 'fas fa-bullhorn', 'CTA Banner', 'Purple full-width call-to-action', $saveUrl, $clearUrl, $csrf, $csrfTok); ?>
<div class="row">
    <div class="col-md-8">
        <?= field('s[cta_h2]', 'Heading', 'Ready to Choose Your Online Degree?', $val('cta_h2'), false, '') ?>
    </div>
    <div class="col-md-4">
        <?= field('s[cta_button]', 'Primary Button Text', 'Talk to a Counselor. It is Free.', $val('cta_button'), false, '') ?>
    </div>
    <div class="col-12">
        <?= field('s[cta_subtext]', 'Sub-text (below heading)', 'Join 5,000+ students who found their perfect program — for free.', $val('cta_subtext'), false, '') ?>
    </div>
</div>
<?php sectionClose(); ?>

<!-- ══════════════════════════════════════════════════════════════════════════
     10b. FAQ SECTION (dynamic — add / remove any number)
══════════════════════════════════════════════════════════════════════════ -->
<?php sectionOpen('faq', 'fas fa-question-circle', 'FAQ Section', 'Dynamic — add any number', $saveUrl, $clearUrl, $csrf, $csrfTok); ?>
<small class="text-muted d-block mb-3">These appear as an accordion on the homepage. Add or remove as many as you need.</small>

<div id="faq_list" class="dg-dynamic-list"></div>
<button type="button" onclick="addFaq()" class="dg-add-btn">
    <i class="fas fa-plus fa-xs"></i> Add FAQ
</button>
<input type="hidden" name="s[faqs_json]" id="faqs_json_input" value="<?= Html::encode($val('faqs_json')) ?>">

<script>
(function () {
    var list   = document.getElementById('faq_list');
    var jsonIn = document.getElementById('faqs_json_input');
    var items  = [];

    try { items = JSON.parse(jsonIn.value || '[]'); } catch(e) { items = []; }
    if (!Array.isArray(items) || items.length === 0) {
        items = [
            {q:'Is the counseling really 100% free? What\'s the catch?', a:'Absolutely free, no catch. We are supported by our university partners who pay us a placement fee when a student enrolls.'},
            {q:'Are UGC-DEB online degrees valid for government jobs?',   a:'Yes. Degrees from UGC-DEB approved universities are fully recognized by the Government of India, UPSC, state PSCs, and most private employers.'},
            {q:'Can I do an online degree while working full-time?',      a:'That\'s exactly who online degrees are designed for. Most programs offer recorded lectures you can watch anytime and flexible deadlines.'},
        ];
    }

    function faqSync() {
        var out = [];
        list.querySelectorAll('.frow').forEach(function (row) {
            out.push({
                q: row.querySelector('[data-f="q"]').value.trim(),
                a: row.querySelector('[data-f="a"]').value.trim(),
            });
        });
        jsonIn.value = JSON.stringify(out);
    }

    window.addFaq = function (item) {
        item = item || {q:'',a:''};
        var row = document.createElement('div');
        row.className = 'frow dg-dynamic-row dg-dynamic-row--faq';
        row.innerHTML =
            '<div><label class="card-inner-label">Question</label>' +
            '<input data-f="q" class="form-control form-control-sm" placeholder="e.g. Is counseling really free?" value="'+faqEsc(item.q)+'"></div>' +
            '<div><label class="card-inner-label">Answer</label>' +
            '<textarea data-f="a" class="form-control form-control-sm" rows="2" placeholder="The answer shown when expanded…">'+faqEsc(item.a)+'</textarea></div>' +
            '<div class="dg-dynamic-row-action"><button type="button" onclick="this.closest(\'.frow\').remove();faqSync()" class="dg-remove-btn" title="Remove"><i class="fas fa-trash fa-xs"></i></button></div>';
        row.querySelectorAll('input,textarea').forEach(function(i){i.addEventListener('input',faqSync);});
        list.appendChild(row);
        faqSync();
    };

    function faqEsc(s) { return (s||'').replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;'); }

    items.forEach(function (item) { window.addFaq(item); });
    window.faqSync = faqSync;
})();
</script>
<?php sectionClose(); ?>

<!-- ══════════════════════════════════════════════════════════════════════════
     0b. ANNOUNCEMENT BAR (dynamic — add / remove any number)
══════════════════════════════════════════════════════════════════════════ -->
<?php sectionOpen('announcement', 'fas fa-volume-up', 'Announcement Bar', 'Dynamic ticker at the top of every page', $saveUrl, $clearUrl, $csrf, $csrfTok); ?>
<small class="text-muted d-block mb-3">Short messages that scroll across the top bar sitewide. Keep each under 60 characters. Emojis are supported.</small>

<div id="ann_list" class="dg-dynamic-list"></div>
<button type="button" onclick="addAnn()" class="dg-add-btn">
    <i class="fas fa-plus fa-xs"></i> Add Message
</button>
<input type="hidden" name="s[announcements_json]" id="announcements_json_input" value="<?= Html::encode($val('announcements_json')) ?>">

<script>
(function () {
    var list   = document.getElementById('ann_list');
    var jsonIn = document.getElementById('announcements_json_input');
    var items  = [];

    try { items = JSON.parse(jsonIn.value || '[]'); } catch(e) { items = []; }
    if (!Array.isArray(items) || items.length === 0) {
        items = [
            '🎓 100% Free Career Counseling — No Hidden Fees',
            '✅ 5,000+ Students Guided',
            '🏛️ 50+ UGC Approved Universities',
         
            '💸 No-Cost EMI from ₹3,500/month',
        ];
    }

    function annSync() {
        var out = [];
        list.querySelectorAll('.arow input').forEach(function (inp) {
            var v = inp.value.trim();
            if (v) out.push(v);
        });
        jsonIn.value = JSON.stringify(out);
    }

    window.addAnn = function (text) {
        text = text || '';
        var row = document.createElement('div');
        row.className = 'arow dg-dynamic-row dg-dynamic-row--ann';
        row.innerHTML =
            '<input class="form-control form-control-sm flex-1" placeholder="e.g. 🎓 100% Free Career Counseling" value="'+annEsc(text)+'">' +
            '<button type="button" onclick="this.closest(\'.arow\').remove();annSync()" class="dg-remove-btn" title="Remove"><i class="fas fa-trash fa-xs"></i></button>';
        row.querySelector('input').addEventListener('input', annSync);
        list.appendChild(row);
        annSync();
    };

    function annEsc(s) { return (s||'').replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;'); }

    items.forEach(function (item) { window.addAnn(item); });
    window.annSync = annSync;
})();
</script>
<?php sectionClose(); ?>

<!-- ══════════════════════════════════════════════════════════════════════════
     10. CONTACT SECTION
══════════════════════════════════════════════════════════════════════════ -->
<?php sectionOpen('contact', 'fas fa-phone', 'Contact Section', 'Also used in footer and contact page', $saveUrl, $clearUrl, $csrf, $csrfTok); ?>
<div class="row">
    <div class="col-md-4">
        <?= field('s[contact_overline]', 'Overline', 'Talk To Us', $val('contact_overline'), false, '') ?>
    </div>
    <div class="col-md-4">
        <?= field('s[contact_h2]', 'Heading (H2)', 'Get Free Counseling', $val('contact_h2'), false, '') ?>
    </div>
    <div class="col-md-4">
        <?= field('s[contact_subtitle]', 'Sub-text', 'Fill in your details...', $val('contact_subtitle'), false, '') ?>
    </div>
</div>
<hr class="section-divider">
<div class="row">
    <div class="col-md-4">
        <div class="form-group mb-3">
            <label for="f_phone" class="dg-filter-label">Phone Number <span class="dg-required">*</span> <small class="text-muted font-weight-normal">(10 digits)</small></label>
            <input type="tel" id="f_phone" name="s[phone]"
                   class="form-control <?= $hasE('phone') ? 'is-invalid' : '' ?>"
                   placeholder="9350199001"
                   value="<?= $val('phone') ?>"
                   maxlength="10"
                   oninput="this.value=this.value.replace(/\D/g,'').slice(0,10)"
                   inputmode="numeric">
            <?php if ($hasE('phone')): ?>
                <div class="dg-field-error"><?= Html::encode($err('phone')) ?></div>
            <?php else: ?>
                <small class="text-muted">Numbers only. Exactly 10 digits.</small>
            <?php endif; ?>
        </div>
    </div>
    <div class="col-md-4">
        <div class="form-group mb-3">
            <label for="f_wa" class="dg-filter-label">WhatsApp Number <small class="text-muted font-weight-normal">(with country code, 10–13 digits)</small></label>
            <input type="tel" id="f_wa" name="s[whatsapp_number]"
                   class="form-control <?= $hasE('whatsapp_number') ? 'is-invalid' : '' ?>"
                   placeholder="919350199001"
                   value="<?= $val('whatsapp_number') ?>"
                   maxlength="13"
                   oninput="this.value=this.value.replace(/\D/g,'').slice(0,13)"
                   inputmode="numeric">
            <?php if ($hasE('whatsapp_number')): ?>
                <div class="dg-field-error"><?= Html::encode($err('whatsapp_number')) ?></div>
            <?php else: ?>
                <small class="text-muted">No + sign. Include country code (e.g. 91...).</small>
            <?php endif; ?>
        </div>
    </div>
    <div class="col-md-4">
        <?= field('s[availability]', 'Availability Text', 'Available all 7 days', $val('availability'), false, '') ?>
    </div>
    <div class="col-md-6">
        <div class="form-group mb-3">
            <label for="f_email_adm" class="dg-filter-label">Admissions Email</label>
            <input type="email" id="f_email_adm" name="s[email_admissions]"
                   class="form-control <?= $hasE('email_admissions') ? 'is-invalid' : '' ?>"
                   placeholder="admissions@degreeguru.in"
                   value="<?= $val('email_admissions') ?>">
            <?php if ($hasE('email_admissions')): ?>
                <div class="dg-field-error"><?= Html::encode($err('email_admissions')) ?></div>
            <?php endif; ?>
        </div>
    </div>
    <div class="col-md-6">
        <div class="form-group mb-3">
            <label for="f_email_q" class="dg-filter-label">Queries Email</label>
            <input type="email" id="f_email_q" name="s[email_queries]"
                   class="form-control <?= $hasE('email_queries') ? 'is-invalid' : '' ?>"
                   placeholder="info@degreeguru.in"
                   value="<?= $val('email_queries') ?>">
            <?php if ($hasE('email_queries')): ?>
                <div class="dg-field-error"><?= Html::encode($err('email_queries')) ?></div>
            <?php endif; ?>
        </div>
    </div>
    <div class="col-md-6">
        <?= field('s[address]', 'Address / Location', 'Gurugram, Haryana, India', $val('address'), false, '') ?>
    </div>
</div>
<?php sectionClose(); ?>

<!-- ── Scroll to section that has errors ──────────────────────────────────── -->
<?php if ($activeSection): ?>
<script>
document.addEventListener('DOMContentLoaded', function () {
    var el = document.getElementById('section-<?= Html::encode($activeSection) ?>');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
});
</script>
<?php endif; ?>

<!-- ── Client-side helpers ─────────────────────────────────────────────────── -->
<script>
function confirmClear(sectionName) {
    return confirm('Clear all content in the "' + sectionName + '" section?\nThis cannot be undone.');
}

// Real-time email format feedback
document.querySelectorAll('input[type="email"]').forEach(function (inp) {
    inp.addEventListener('blur', function () {
        var fb = inp.nextElementSibling;
        if (!inp.value) { inp.classList.remove('is-invalid'); return; }
        var ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inp.value);
        if (!ok) {
            inp.classList.add('is-invalid');
            if (!fb || !fb.classList.contains('invalid-feedback')) {
                var div = document.createElement('div');
                div.className = 'invalid-feedback';
                div.style.display = 'block';
                div.textContent = 'Please enter a valid email address.';
                inp.insertAdjacentElement('afterend', div);
            }
        } else {
            inp.classList.remove('is-invalid');
            if (fb && fb.classList.contains('invalid-feedback')) fb.remove();
        }
    });
});

// Real-time phone length feedback
document.querySelectorAll('input[name="s[phone]"]').forEach(function (inp) {
    inp.addEventListener('input', function () {
        var ok = this.value.length === 10;
        this.classList.toggle('is-invalid', this.value.length > 0 && !ok);
        this.classList.toggle('is-valid',   ok);
    });
});
</script>

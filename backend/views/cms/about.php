<?php

/** @var yii\web\View $this */
/** @var array  $s              key => value map of current settings */
/** @var array  $errors         field-key => error message */
/** @var string|null $activeSection */

use yii\helpers\Html;
use yii\helpers\Url;

$this->title = 'About Page Content Editor';

$val  = fn(string $key, string $default = '') => Html::encode($s[$key] ?? $default);
$rawVal = fn(string $key, string $default = '') => $s[$key] ?? $default;

function field(string $name, string $label, string $placeholder, string $val, string $type = 'text', string $hint = ''): string {
    $id  = 'f_' . preg_replace('/[^a-zA-Z0-9_]/', '_', $name);
    $html  = '<div class="form-group mb-3">';
    $html .= '<label for="' . $id . '" class="dg-filter-label">' . $label . '</label>';
    $html .= '<input type="' . $type . '" id="' . $id . '" name="' . $name . '" class="form-control" placeholder="' . Html::encode($placeholder) . '" value="' . $val . '">';
    if ($hint !== '') {
        $html .= '<small class="text-muted d-block mt-1">' . $hint . '</small>';
    }
    $html .= '</div>';
    return $html;
}

function textarea(string $name, string $label, string $placeholder, string $val, int $rows = 3, string $hint = ''): string {
    $id   = 'f_' . preg_replace('/[^a-zA-Z0-9_]/', '_', $name);
    $html  = '<div class="form-group mb-3">';
    $html .= '<label for="' . $id . '" class="dg-filter-label">' . $label . '</label>';
    $html .= '<textarea id="' . $id . '" name="' . $name . '" class="form-control" rows="' . $rows . '" placeholder="' . Html::encode($placeholder) . '">' . $val . '</textarea>';
    if ($hint !== '') {
        $html .= '<small class="text-muted d-block mt-1">' . $hint . '</small>';
    }
    $html .= '</div>';
    return $html;
}

function imageWidget(string $key, string $label, string $currentVal, string $helpText = ''): string {
    $id = 'img_' . preg_replace('/[^a-zA-Z0-9_]/', '_', $key);
    $hasImage = trim($currentVal) !== '';
    $imgSrc = $hasImage ? Html::encode($currentVal) : '';

    $html  = '<div class="dg-image-widget" id="widget_' . $id . '">';
    $html .= '  <div class="dg-image-widget-header">';
    $html .= '    <span class="dg-image-widget-title"><i class="fas fa-image text-primary mr-1"></i> ' . $label . '</span>';
    if ($helpText !== '') {
        $html .= '    <small class="text-muted">' . $helpText . '</small>';
    }
    $html .= '  </div>';

    $html .= '  <div class="dg-image-widget-flex">';
    $html .= '    <div class="dg-image-widget-preview" id="prev_box_' . $id . '">';
    $html .= '      <img id="img_el_' . $id . '" src="' . $imgSrc . '" alt="Preview" style="' . ($hasImage ? '' : 'display:none;') . '">';
    $html .= '      <i class="fas fa-image no-img-icon" id="no_img_' . $id . '" style="' . ($hasImage ? 'display:none;' : '') . '"></i>';
    $html .= '    </div>';

    $html .= '    <div class="dg-image-widget-controls">';
    $html .= '      <div class="dg-upload-progress-text" id="prog_' . $id . '"><i class="fas fa-spinner fa-spin"></i> Uploading image...</div>';
    $html .= '      <div class="dg-image-actions">';
    $html .= '        <button type="button" class="btn-image-action btn-upload-trigger" onclick="document.getElementById(\'file_' . $id . '\').click()"><i class="fas fa-cloud-upload-alt"></i> ' . ($hasImage ? 'Change Image' : 'Upload New Image') . '</button>';
    $html .= '        <button type="button" class="btn-image-action btn-image-remove" id="rem_btn_' . $id . '" onclick="window.dgRemoveImage(\'' . $id . '\')" style="' . ($hasImage ? '' : 'display:none;') . '"><i class="fas fa-trash fa-xs"></i> Remove</button>';
    $html .= '      </div>';

    $html .= '      <input type="file" id="file_' . $id . '" accept="image/jpeg,image/png,image/webp,image/gif" style="display:none;" onchange="window.dgUploadImageWidget(\'' . $id . '\', this.files[0])">';
    $html .= '      <input type="url" name="s[' . $key . ']" id="url_' . $id . '" class="form-control form-control-sm" placeholder="Paste image URL (https://...) or upload above" value="' . Html::encode($currentVal) . '" oninput="window.dgUpdatePreviewFromUrl(\'' . $id . '\', this.value)">';
    $html .= '      <input type="hidden" name="s[' . $key . ']" id="empty_' . $id . '" value="" ' . ($hasImage ? 'disabled' : '') . '>';
    $html .= '    </div>';
    $html .= '  </div>';
    $html .= '</div>';

    return $html;
}

$csrf      = Yii::$app->request->csrfParam;
$csrfTok   = Yii::$app->request->csrfToken;
$saveUrl   = Url::to(['/cms/about']);
$clearUrl  = Url::to(['/cms/clear-section']);
$uploadUrl = Url::to(['/cms/upload-image']);

function sectionOpen(string $key, string $icon, string $title, string $badge, string $saveUrl, string $clearUrl, string $csrf, string $csrfTok): void {
    echo '<div class="dg-card mb-4" id="section-' . $key . '">';
    echo '  <div class="cms-section-header">';
    echo '    <h4 class="dg-card-title"><i class="' . $icon . '"></i> ' . $title . '</h4>';
    echo '    <div class="cms-section-actions">';
    echo '      <span class="dg-total-badge">' . $badge . '</span>';
    echo '      <form method="post" action="' . $clearUrl . '" onsubmit="return confirm(\'Are you sure you want to clear ' . addslashes($title) . '?\')" class="m-0">';
    echo '        <input type="hidden" name="' . $csrf . '" value="' . $csrfTok . '">';
    echo '        <input type="hidden" name="section" value="' . $key . '">';
    echo '        <input type="hidden" name="return_url" value="/cms/about">';
    echo '        <button type="submit" class="btn-clear-section"><i class="fas fa-trash fa-xs"></i> Clear</button>';
    echo '      </form>';
    echo '    </div>';
    echo '  </div>';
    echo '  <form method="post" action="' . $saveUrl . '" novalidate>';
    echo '    <input type="hidden" name="' . $csrf . '" value="' . $csrfTok . '">';
    echo '    <input type="hidden" name="section" value="' . $key . '">';
    echo '    <div class="card-body p-4">';
}

function sectionClose(): void {
    echo '    </div>';
    echo '    <div class="dg-card-body border-top pt-3 pb-3 d-flex justify-content-end">';
    echo '      <button type="submit" class="btn-save-section"><i class="fas fa-save mr-1"></i> Save Section</button>';
    echo '    </div>';
    echo '  </form>';
    echo '</div>';
}
?>

<div class="cms-layout-wrapper">

    <!-- Flash Messages -->
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

    <!-- Heading -->
    <div class="dg-page-heading d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3">
        <div>
            <h4 class="mb-1">About Page Content Editor</h4>
            <p class="text-muted mb-0">Manage all text, story narratives, Viksit Bharat mission, and hero imagery for the About Us page.</p>
        </div>
        <div>
            <a href="http://127.0.0.1:8080/about" target="_blank" class="btn btn-sm btn-outline-secondary">
                <i class="fas fa-external-link-alt mr-1"></i> Preview About Page
            </a>
        </div>
    </div>

    <!-- Section 1: Hero -->
    <?php sectionOpen('about_hero', 'fas fa-info-circle', 'About Hero Section', 'Top Fold', $saveUrl, $clearUrl, $csrf, $csrfTok); ?>
    <div class="row">
        <div class="col-md-7">
            <?= field('s[about_hero_overline]', 'Overline Badge', 'About Degree Guru', $val('about_hero_overline', 'About Degree Guru')) ?>
            <?= field('s[about_hero_title]', 'Main Heading (H1)', 'India\'s Trusted Free Education Guide', $val('about_hero_title', 'India\'s Trusted Free Education Guide')) ?>
            <?= textarea('s[about_hero_subtitle]', 'Subtitle Description', 'A platform built on one simple belief: career counseling should be free, honest and accessible to every Indian, with easy EMI options on the programs we recommend.', $val('about_hero_subtitle'), 3) ?>
        </div>
        <div class="col-md-5">
            <?= imageWidget('about_hero_image', 'About Hero Image', $val('about_hero_image'), 'Aspect ratio: 4:3 landscape') ?>
        </div>
    </div>
    <?php sectionClose(); ?>

    <!-- Section 2: Story -->
    <?php sectionOpen('about_story', 'fas fa-book-open', 'Our Story Section', 'Origin & Mission', $saveUrl, $clearUrl, $csrf, $csrfTok); ?>
    <div class="cms-grid-2">
        <?= field('s[about_story_overline]', 'Overline', 'Our Story', $val('about_story_overline', 'Our Story')) ?>
        <?= field('s[about_story_title]', 'Heading (H2)', 'Built on a Simple Belief', $val('about_story_title', 'Built on a Simple Belief')) ?>
    </div>
    <?= textarea('s[about_story_body]', 'Story Narrative', 'Too many Indian students pay for biased counseling and end up in the wrong program. We started Degree Guru to change that...', $val('about_story_body'), 4) ?>
    <?php sectionClose(); ?>

    <!-- Section 3: Vision -->
    <?php sectionOpen('about_vision', 'fas fa-flag', 'Viksit Bharat Vision', 'National Mission', $saveUrl, $clearUrl, $csrf, $csrfTok); ?>
    <div class="cms-grid-2">
        <?= field('s[about_vision_overline]', 'Overline', 'Vision', $val('about_vision_overline', 'Vision')) ?>
        <?= field('s[about_vision_title]', 'Heading (H2)', 'Aligned With Viksit Bharat', $val('about_vision_title', 'Aligned With Viksit Bharat')) ?>
    </div>
    <?= textarea('s[about_vision_body]', 'Vision Statement', 'We believe an educated India is an empowered India. Every learner we guide brings the country one step closer to Viksit Bharat...', $val('about_vision_body'), 4) ?>
    <?php sectionClose(); ?>

    <!-- Section 4: What Makes Us Different -->
    <?php sectionOpen('about_diff', 'fas fa-award', 'What Makes Us Different', '4 Differentiator Cards', $saveUrl, $clearUrl, $csrf, $csrfTok); ?>
    <?= field('s[about_diff_title]', 'Section Heading (H2)', 'What Makes Us Different', $val('about_diff_title', 'What Makes Us Different')) ?>
    <div class="cms-grid-2">
        <?php foreach ([
            1 => ['Free Forever', 'No charges to students. Ever.'],
            2 => ['Top Universities', 'Direct ties with India\'s top UGC-approved universities.'],
            3 => ['Easy EMI Guidance', 'Guidance on no-cost and low-cost EMI options.'],
            4 => ['Career Support', 'Support beyond admission: resume guidance and career paths.'],
        ] as $n => [$defTitle, $defDesc]): ?>
            <div class="p-3 rounded mb-2" style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.08);">
                <div class="font-weight-bold text-primary mb-2">Pillar #<?= $n ?></div>
                <?= field("s[about_diff{$n}_title]", 'Pillar Title', $defTitle, $val("about_diff{$n}_title")) ?>
                <?= textarea("s[about_diff{$n}_desc]", 'Pillar Description', $defDesc, $val("about_diff{$n}_desc"), 2) ?>
            </div>
        <?php endforeach; ?>
    </div>
    <?php sectionClose(); ?>

</div>

<!-- Universal JavaScript Engine for Image Uploads -->
<script>
(function() {
    var uploadUrl = '<?= $uploadUrl ?>';
    var csrfName  = '<?= $csrf ?>';
    var csrfToken = '<?= $csrfTok ?>';

    window.dgUploadImageWidget = function(id, file) {
        if (!file) return;
        var prog = document.getElementById('prog_' + id);
        var imgEl = document.getElementById('img_el_' + id);
        var noImg = document.getElementById('no_img_' + id);
        var urlInput = document.getElementById('url_' + id);
        var emptyInput = document.getElementById('empty_' + id);
        var remBtn = document.getElementById('rem_btn_' + id);

        if (prog) prog.style.display = 'flex';

        var fd = new FormData();
        fd.append('image', file);
        fd.append(csrfName, csrfToken);

        fetch(uploadUrl, { method: 'POST', body: fd })
            .then(function(res) { return res.json(); })
            .then(function(data) {
                if (prog) prog.style.display = 'none';
                if (data.url) {
                    if (imgEl) {
                        imgEl.src = data.url;
                        imgEl.style.display = 'block';
                    }
                    if (noImg) noImg.style.display = 'none';
                    if (urlInput) urlInput.value = data.url;
                    if (emptyInput) emptyInput.disabled = true;
                    if (remBtn) remBtn.style.display = 'inline-flex';
                } else {
                    alert(data.error || 'Image upload failed.');
                }
            })
            .catch(function(err) {
                if (prog) prog.style.display = 'none';
                alert('Network error while uploading image.');
            });
    };

    window.dgRemoveImage = function(id) {
        var imgEl = document.getElementById('img_el_' + id);
        var noImg = document.getElementById('no_img_' + id);
        var urlInput = document.getElementById('url_' + id);
        var emptyInput = document.getElementById('empty_' + id);
        var remBtn = document.getElementById('rem_btn_' + id);

        if (imgEl) {
            imgEl.src = '';
            imgEl.style.display = 'none';
        }
        if (noImg) noImg.style.display = 'block';
        if (urlInput) urlInput.value = '';
        if (emptyInput) emptyInput.disabled = false;
        if (remBtn) remBtn.style.display = 'none';
    };

    window.dgUpdatePreviewFromUrl = function(id, val) {
        var imgEl = document.getElementById('img_el_' + id);
        var noImg = document.getElementById('no_img_' + id);
        var emptyInput = document.getElementById('empty_' + id);
        var remBtn = document.getElementById('rem_btn_' + id);

        if (val && val.trim() !== '') {
            if (imgEl) {
                imgEl.src = val.trim();
                imgEl.style.display = 'block';
            }
            if (noImg) noImg.style.display = 'none';
            if (emptyInput) emptyInput.disabled = true;
            if (remBtn) remBtn.style.display = 'inline-flex';
        } else {
            window.dgRemoveImage(id);
        }
    };
})();
</script>

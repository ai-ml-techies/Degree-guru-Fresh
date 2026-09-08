<?php

/** @var yii\web\View $this */
/** @var array  $s              key => value map of current settings */
/** @var array  $errors         field-key => error message */
/** @var string|null $activeSection */

use yii\helpers\Html;
use yii\helpers\Url;

$this->title = 'Contact Page Content Editor';

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
$saveUrl   = Url::to(['/cms/contact']);
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
    echo '        <input type="hidden" name="return_url" value="/cms/contact">';
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
            <h4 class="mb-1">Contact Page Content Editor</h4>
            <p class="text-muted mb-0">Manage contact information, office hours, location details, and header banners for the Contact page.</p>
        </div>
        <div>
            <a href="http://127.0.0.1:8080/contact" target="_blank" class="btn btn-sm btn-outline-secondary">
                <i class="fas fa-external-link-alt mr-1"></i> Preview Contact Page
            </a>
        </div>
    </div>

    <!-- Section: Header & Communication -->
    <?php sectionOpen('contact_page', 'fas fa-headset', 'Contact Page Details', 'Full Page Form', $saveUrl, $clearUrl, $csrf, $csrfTok); ?>
    <div class="row">
        <div class="col-md-7">
            <div class="cms-grid-2">
                <?= field('s[contact_page_overline]', 'Overline', 'Get in Touch', $val('contact_page_overline', 'Get in Touch')) ?>
                <?= field('s[contact_page_title]', 'Heading (H1)', 'Talk to an Education Expert', $val('contact_page_title', 'Talk to an Education Expert')) ?>
            </div>
            <?= textarea('s[contact_page_subtitle]', 'Subtitle Description', 'Have questions about eligibility, university rankings, fees, or online exams? Our team is here to help 7 days a week.', $val('contact_page_subtitle'), 3) ?>

            <label class="card-inner-label mt-2">Communication Channels</label>
            <div class="cms-grid-2">
                <?= field('s[contact_page_phone]', 'Calling Phone', '9350199001', $val('contact_page_phone', '9350199001')) ?>
                <?= field('s[contact_page_whatsapp]', 'WhatsApp Number', '919350199001', $val('contact_page_whatsapp', '919350199001')) ?>
            </div>
            <div class="cms-grid-2">
                <?= field('s[contact_page_email_admissions]', 'Admissions Email', 'admissions@degreeguru.in', $val('contact_page_email_admissions', 'admissions@degreeguru.in')) ?>
                <?= field('s[contact_page_email_queries]', 'General Queries Email', 'info@degreeguru.in', $val('contact_page_email_queries', 'info@degreeguru.in')) ?>
            </div>

            <label class="card-inner-label mt-2">Office Location & Hours</label>
            <div class="cms-grid-2">
                <?= field('s[contact_page_address]', 'Office Address', 'Gurugram, Haryana, India', $val('contact_page_address', 'Gurugram, Haryana, India')) ?>
                <?= field('s[contact_page_hours]', 'Business Hours', 'Monday to Sunday, 9:00 AM – 8:00 PM IST', $val('contact_page_hours', 'Monday to Sunday, 9:00 AM – 8:00 PM IST')) ?>
            </div>
            <?= field('s[contact_page_map_url]', 'Google Maps Embed URL (Optional)', 'https://maps.google.com/...', $val('contact_page_map_url')) ?>
        </div>

        <div class="col-md-5">
            <?= imageWidget('contact_header_image', 'Contact Header Graphic / Office Photo', $val('contact_header_image'), 'Optional image banner') ?>
            <div class="p-3 rounded" style="background: rgba(124, 58, 237, 0.06); border: 1px dashed rgba(124, 58, 237, 0.25);">
                <small class="text-muted d-block">
                    <i class="fas fa-shield-alt text-primary mr-1"></i>
                    Inquiries submitted via the Contact form on the website are automatically saved and displayed in real time in the <strong>Counseling Leads</strong> dashboard.
                </small>
            </div>
        </div>
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

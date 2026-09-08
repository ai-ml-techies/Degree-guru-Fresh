<?php

/** @var yii\web\View $this */
/** @var array  $s              key => value map of current settings */
/** @var array  $errors         field-key => error message */
/** @var string|null $activeSection  section that just failed validation */

use yii\helpers\Html;
use yii\helpers\Url;

$this->title = 'Home Page Content Editor';

// Helpers
$val  = fn(string $key, string $default = '') => Html::encode($s[$key] ?? $default);
$rawVal = fn(string $key, string $default = '') => $s[$key] ?? $default;
$err  = fn(string $key) => $errors[$key] ?? null;
$hasE = fn(string $key) => isset($errors[$key]);

// Basic text field
function field(string $name, string $label, string $placeholder, string $val, bool $hasErr = false, ?string $errMsg = null, string $type = 'text', string $extra = '', string $hint = ''): string {
    $cls = $hasErr ? 'form-control is-invalid' : 'form-control';
    $id  = 'f_' . preg_replace('/[^a-zA-Z0-9_]/', '_', $name);
    $html  = '<div class="form-group mb-3">';
    $html .= '<label for="' . $id . '" class="dg-filter-label">' . $label . '</label>';
    $html .= '<input type="' . $type . '" id="' . $id . '" name="' . $name . '" class="' . $cls . '" placeholder="' . Html::encode($placeholder) . '" value="' . $val . '" ' . $extra . '>';
    if ($hasErr) {
        $html .= '<div class="dg-field-error">' . Html::encode($errMsg) . '</div>';
    } elseif ($hint !== '') {
        $html .= '<small class="text-muted d-block mt-1">' . $hint . '</small>';
    }
    $html .= '</div>';
    return $html;
}

// Basic textarea
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

// Universal Interactive Image Widget
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
    // Preview box
    $html .= '    <div class="dg-image-widget-preview" id="prev_box_' . $id . '">';
    $html .= '      <img id="img_el_' . $id . '" src="' . $imgSrc . '" alt="Preview" style="' . ($hasImage ? '' : 'display:none;') . '">';
    $html .= '      <i class="fas fa-image no-img-icon" id="no_img_' . $id . '" style="' . ($hasImage ? 'display:none;' : '') . '"></i>';
    $html .= '    </div>';

    // Controls
    $html .= '    <div class="dg-image-widget-controls">';
    $html .= '      <div class="dg-upload-progress-text" id="prog_' . $id . '"><i class="fas fa-spinner fa-spin"></i> Uploading image...</div>';
    $html .= '      <div class="dg-image-actions">';
    $html .= '        <button type="button" class="btn-image-action btn-upload-trigger" onclick="document.getElementById(\'file_' . $id . '\').click()"><i class="fas fa-cloud-upload-alt"></i> ' . ($hasImage ? 'Change Image' : 'Upload New Image') . '</button>';
    $html .= '        <button type="button" class="btn-image-action btn-image-remove" id="rem_btn_' . $id . '" onclick="window.dgRemoveImage(\'' . $id . '\')" style="' . ($hasImage ? '' : 'display:none;') . '"><i class="fas fa-trash fa-xs"></i> Remove</button>';
    $html .= '      </div>';

    // Hidden file input
    $html .= '      <input type="file" id="file_' . $id . '" accept="image/jpeg,image/png,image/webp,image/gif" style="display:none;" onchange="window.dgUploadImageWidget(\'' . $id . '\', this.files[0])">';

    // Direct URL field with fallback
    $html .= '      <input type="url" name="s[' . $key . ']" id="url_' . $id . '" class="form-control form-control-sm" placeholder="Paste image URL (https://...) or upload above" value="' . Html::encode($currentVal) . '" oninput="window.dgUpdatePreviewFromUrl(\'' . $id . '\', this.value)">';
    $html .= '      <input type="hidden" name="s[' . $key . ']" id="empty_' . $id . '" value="" ' . ($hasImage ? 'disabled' : '') . '>';
    $html .= '    </div>';
    $html .= '  </div>';
    $html .= '</div>';

    return $html;
}

// CSRF tokens & endpoints
$csrf     = Yii::$app->request->csrfParam;
$csrfTok  = Yii::$app->request->csrfToken;
$saveUrl  = Url::to(['/cms/home']);
$clearUrl = Url::to(['/cms/clear-section']);
$uploadUrl = Url::to(['/cms/upload-image']);

// Macro for section container
function sectionOpen(string $key, string $icon, string $title, string $badge, string $saveUrl, string $clearUrl, string $csrf, string $csrfTok): void {
    echo '<div class="dg-card mb-4" id="section-' . $key . '">';
    echo '  <div class="cms-section-header">';
    echo '    <h4 class="dg-card-title"><i class="' . $icon . '"></i> ' . $title . '</h4>';
    echo '    <div class="cms-section-actions">';
    echo '      <span class="dg-total-badge">' . $badge . '</span>';
    echo '      <form method="post" action="' . $clearUrl . '" onsubmit="return confirm(\'Are you sure you want to clear the ' . addslashes($title) . ' section?\')" class="m-0">';
    echo '        <input type="hidden" name="' . $csrf . '" value="' . $csrfTok . '">';
    echo '        <input type="hidden" name="section" value="' . $key . '">';
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

    <!-- Header -->
    <div class="dg-page-heading d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3">
        <div>
            <h4 class="mb-1">Home Page Editor</h4>
            <p class="text-muted mb-0">Refined Hostinger-style CMS. Every element can be customized. Jump quickly using the section pills below.</p>
        </div>
        <div>
            <a href="http://127.0.0.1:8080" target="_blank" class="btn btn-sm btn-outline-secondary">
                <i class="fas fa-external-link-alt mr-1"></i> Preview Live Site
            </a>
        </div>
    </div>

    <!-- Sticky Section Navigation Pills (Ergonomic quick jump) -->
    <div class="cms-sticky-nav-container">
        <div class="cms-sticky-nav">
            <a href="#section-seo" class="cms-nav-pill"><i class="fas fa-search fa-xs"></i> SEO</a>
            <a href="#section-hero" class="cms-nav-pill"><i class="fas fa-rocket fa-xs"></i> Hero</a>
            <a href="#section-stats" class="cms-nav-pill"><i class="fas fa-chart-bar fa-xs"></i> Stats</a>
            <a href="#section-vision" class="cms-nav-pill"><i class="fas fa-bullseye fa-xs"></i> Vision</a>
            <a href="#section-programs" class="cms-nav-pill"><i class="fas fa-graduation-cap fa-xs"></i> Programs</a>
            <a href="#section-whyus" class="cms-nav-pill"><i class="fas fa-shield-alt fa-xs"></i> Why Us</a>
            <a href="#section-how" class="cms-nav-pill"><i class="fas fa-shoe-prints fa-xs"></i> Journey</a>
            <a href="#section-schooling" class="cms-nav-pill"><i class="fas fa-school fa-xs"></i> Schooling</a>
            <a href="#section-testimonials" class="cms-nav-pill"><i class="fas fa-comment-dots fa-xs"></i> Testimonials</a>
            <a href="#section-cta" class="cms-nav-pill"><i class="fas fa-bullhorn fa-xs"></i> CTA Banner</a>
            <a href="#section-faq" class="cms-nav-pill"><i class="fas fa-question-circle fa-xs"></i> FAQ</a>
            <a href="#section-contact" class="cms-nav-pill"><i class="fas fa-phone fa-xs"></i> Contact & Leads</a>
        </div>
    </div>

    <!-- ══════════════════════════════════════════════════════════════════════════
         0. SEO Section
    ══════════════════════════════════════════════════════════════════════════ -->
    <?php sectionOpen('seo', 'fas fa-search', 'SEO & Social Previews', 'Google & Meta Tags', $saveUrl, $clearUrl, $csrf, $csrfTok); ?>
    <div class="row">
        <div class="col-md-7">
            <?= field('s[seo_title]', 'SEO Title', 'Degree Guru | India\'s #1 Free Career Counseling Platform', $val('seo_title'), $hasE('seo_title'), $err('seo_title'), 'text', 'maxlength="70"', 'Ideal: 50–60 characters. Appears in search results and browser tab.') ?>
            <?= textarea('s[seo_description]', 'Meta Description', 'Explore 100% online degree programs from India\'s top UGC-approved universities...', $val('seo_description'), 3, 'Ideal: 140–160 characters. Search engines use this for the snippet.') ?>
            <div class="cms-grid-2">
                <?= field('s[seo_focus_keyword]', 'Focus Keyword', 'e.g. online degree counseling', $val('seo_focus_keyword'), false, null) ?>
                <div class="form-group mb-3">
                    <label class="dg-filter-label">Robots Directive</label>
                    <select name="s[seo_robots]" class="form-control">
                        <option value="index, follow" <?= $val('seo_robots') === 'index, follow' ? 'selected' : '' ?>>index, follow (Default)</option>
                        <option value="noindex, follow" <?= $val('seo_robots') === 'noindex, follow' ? 'selected' : '' ?>>noindex, follow</option>
                        <option value="noindex, nofollow" <?= $val('seo_robots') === 'noindex, nofollow' ? 'selected' : '' ?>>noindex, nofollow</option>
                    </select>
                </div>
            </div>
            <?= imageWidget('seo_og_image', 'Open Graph (Social Share) Image', $val('seo_og_image'), 'Recommended: 1200 x 630 px') ?>
        </div>
        <div class="col-md-5">
            <label class="card-inner-label">Google Search Result Preview</label>
            <div class="dg-seo-preview p-3 rounded mb-3">
                <div class="dg-seo-url">https://degreeguru.in</div>
                <div class="dg-seo-title font-weight-bold" id="seo_prev_title"><?= $val('seo_title') ?: 'Degree Guru | India\'s #1 Free Career Counseling Platform' ?></div>
                <div class="dg-seo-desc text-muted mt-1" id="seo_prev_desc"><?= $val('seo_description') ?: 'Explore 100% online degree programs from India\'s top UGC-approved universities. Get free, honest counseling and easy EMI options.' ?></div>
            </div>
        </div>
    </div>
    <?php sectionClose(); ?>

    <!-- ══════════════════════════════════════════════════════════════════════════
         1. HERO SECTION
    ══════════════════════════════════════════════════════════════════════════ -->
    <?php sectionOpen('hero', 'fas fa-rocket', 'Hero Section', 'Top Fold Banner & Badges', $saveUrl, $clearUrl, $csrf, $csrfTok); ?>
    <div class="row">
        <div class="col-md-7">
            <?= field('s[hero_h1]', 'Hero Heading (H1)', 'India\'s #1 Most Trusted Career Counselling Platform', $val('hero_h1'), $hasE('hero_h1'), $err('hero_h1'), 'text', '', 'Tip: Wrap words in &lt;span&gt;...&lt;/span&gt; to give them the purple gradient highlight.') ?>
            <?= textarea('s[hero_subtitle]', 'Hero Subtitle', '100% online degree courses from India\'s top universities. Honest counseling. Easy EMI options.', $val('hero_subtitle'), 3) ?>

            <div class="cms-grid-2">
                <?= field('s[hero_cta_primary]', 'Primary Button Text', 'Get Free Counseling', $val('hero_cta_primary')) ?>
                <?= field('s[hero_cta_primary_link]', 'Primary Button Target Link', '/contact', $val('hero_cta_primary_link', '/contact')) ?>
            </div>

            <div class="cms-grid-2">
                <?= field('s[hero_cta_secondary]', 'Secondary Button Text', 'Explore Programs', $val('hero_cta_secondary')) ?>
                <?= field('s[hero_cta_secondary_link]', 'Secondary Button Target Link', '/programs', $val('hero_cta_secondary_link', '/programs')) ?>
            </div>

            <label class="card-inner-label mt-2">Trust Pill Badges</label>
            <div class="cms-grid-3">
                <?= field('s[hero_badge_1]', 'Badge 1', 'AICTE Approved', $val('hero_badge_1', 'AICTE Approved')) ?>
                <?= field('s[hero_badge_2]', 'Badge 2', 'UGC Entitled', $val('hero_badge_2', 'UGC Entitled')) ?>
                <?= field('s[hero_badge_3]', 'Badge 3', 'Easy EMI', $val('hero_badge_3', 'Easy EMI')) ?>
            </div>

            <label class="card-inner-label mt-2">Social Proof & Floating Cards</label>
            <div class="cms-grid-3">
                <?= field('s[hero_students_count]', 'Enrolled Text', '700+ students enrolled', $val('hero_students_count', '700+ students enrolled this month')) ?>
                <?= field('s[hero_rating_value]', 'Rating Value', '4.9', $val('hero_rating_value', '4.9')) ?>
                <?= field('s[hero_rating_label]', 'Rating Label', 'Google Rating', $val('hero_rating_label', 'Google Rating')) ?>
            </div>
            <div class="cms-grid-2">
                <?= field('s[hero_card_badge]', 'Floating Card Badge', 'Today', $val('hero_card_badge', 'Today')) ?>
                <?= field('s[hero_card_text]', 'Floating Card Text', '700+ Students Enrolled', $val('hero_card_text', '700+ Students Enrolled')) ?>
            </div>
        </div>

        <div class="col-md-5">
            <label class="card-inner-label">Hero Featured Student Image</label>
            <?= imageWidget('hero_image', 'Hero Student Photo', $val('hero_image'), 'Aspect ratio: 4:5 or 4:3 portrait') ?>
            <div class="p-3 rounded" style="background: rgba(124, 58, 237, 0.06); border: 1px dashed rgba(124, 58, 237, 0.25);">
                <small class="text-muted d-block">
                    <i class="fas fa-info-circle text-primary mr-1"></i>
                    Uploading an image here instantly overrides the default model photo on the live homepage hero. Supported: WebP, PNG, JPG under 5MB.
                </small>
            </div>
        </div>
    </div>
    <?php sectionClose(); ?>

    <!-- ══════════════════════════════════════════════════════════════════════════
         2. STATS BAR SECTION
    ══════════════════════════════════════════════════════════════════════════ -->
    <?php sectionOpen('stats', 'fas fa-chart-bar', 'Stats Banner Strip', 'Counter Numbers', $saveUrl, $clearUrl, $csrf, $csrfTok); ?>
    <div class="row">
        <?php foreach ([1 => 'Students Guided', 2 => 'Top Universities', 3 => 'Free Forever'] as $n => $defaultLabel): ?>
            <div class="col-md-4">
                <div class="p-3 rounded mb-3" style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.08);">
                    <div class="font-weight-bold text-primary mb-2">Statistic #<?= $n ?></div>
                    <div class="row g-2">
                        <div class="col-8">
                            <?= field("s[stat{$n}_value]", 'Number Value', '5000', $val("stat{$n}_value"), $hasE("stat{$n}_value"), $err("stat{$n}_value"), 'text', '', 'Digits only') ?>
                        </div>
                        <div class="col-4">
                            <?= field("s[stat{$n}_suffix]", 'Suffix', '+', $val("stat{$n}_suffix")) ?>
                        </div>
                    </div>
                    <?= field("s[stat{$n}_label]", 'Description Label', $defaultLabel, $val("stat{$n}_label")) ?>
                </div>
            </div>
        <?php endforeach; ?>
    </div>
    <?php sectionClose(); ?>

    <!-- ══════════════════════════════════════════════════════════════════════════
         3. VISION SECTION
    ══════════════════════════════════════════════════════════════════════════ -->
    <?php sectionOpen('vision', 'fas fa-bullseye', 'Vision & Viksit Bharat', 'National Initiative Section', $saveUrl, $clearUrl, $csrf, $csrfTok); ?>
    <div class="row">
        <div class="col-md-7">
            <?= field('s[vision_overline]', 'Section Overline', 'Our Vision', $val('vision_overline', 'Our Vision')) ?>
            <?= field('s[vision_h2]', 'Section Heading (H2)', 'Empowering Viksit Bharat Initiative Through Education', $val('vision_h2')) ?>
            <?= textarea('s[vision_body]', 'Vision Body Paragraph', 'At Degree Guru, we believe every Indian deserves honest career guidance...', $val('vision_body'), 4) ?>

            <label class="card-inner-label mt-2">Checkmark Tags</label>
            <div class="cms-grid-2">
                <?= field('s[vision_tag1]', 'Tag 1', 'Free Counseling', $val('vision_tag1', 'Free Counseling')) ?>
                <?= field('s[vision_tag2]', 'Tag 2', 'No Pressure', $val('vision_tag2', 'No Pressure')) ?>
                <?= field('s[vision_tag3]', 'Tag 3', 'Honest Advice', $val('vision_tag3', 'Honest Advice')) ?>
                <?= field('s[vision_tag4]', 'Tag 4', 'Pan India', $val('vision_tag4', 'Pan India')) ?>
            </div>

            <label class="card-inner-label mt-2">4 Metric Cards</label>
            <div class="cms-grid-2">
                <div class="p-2 rounded mb-2" style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06);">
                    <?= field('s[vision_stat1_label]', 'Metric 1 Label', 'Students Served', $val('vision_stat1_label', 'Students Served')) ?>
                    <?= field('s[vision_stat1_val]', 'Metric 1 Value', '5,000+', $val('vision_stat1_val', '5,000+')) ?>
                </div>
                <div class="p-2 rounded mb-2" style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06);">
                    <?= field('s[vision_stat2_label]', 'Metric 2 Label', 'Universities', $val('vision_stat2_label', 'Universities')) ?>
                    <?= field('s[vision_stat2_val]', 'Metric 2 Value', '50+', $val('vision_stat2_val', '50+')) ?>
                </div>
                <div class="p-2 rounded mb-2" style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06);">
                    <?= field('s[vision_stat3_label]', 'Metric 3 Label', 'Placement Rate', $val('vision_stat3_label', 'Placement Rate')) ?>
                    <?= field('s[vision_stat3_val]', 'Metric 3 Value', '92%', $val('vision_stat3_val', '92%')) ?>
                </div>
                <div class="p-2 rounded mb-2" style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06);">
                    <?= field('s[vision_stat4_label]', 'Metric 4 Label', 'Response Time', $val('vision_stat4_label', 'Response Time')) ?>
                    <?= field('s[vision_stat4_val]', 'Metric 4 Value', '2 hrs', $val('vision_stat4_val', '2 hrs')) ?>
                </div>
            </div>
        </div>

        <div class="col-md-5">
            <label class="card-inner-label">Vision Graphic / Illustration</label>
            <?= imageWidget('vision_image', 'Vision Illustration / Campus Photo', $val('vision_image'), 'Optional visual representation') ?>
        </div>
    </div>
    <?php sectionClose(); ?>

    <!-- ══════════════════════════════════════════════════════════════════════════
         4. PROGRAMS SECTION HEADER
    ══════════════════════════════════════════════════════════════════════════ -->
    <?php sectionOpen('programs', 'fas fa-graduation-cap', 'Programs Showcase Header', 'Catalog Section Text', $saveUrl, $clearUrl, $csrf, $csrfTok); ?>
    <div class="row">
        <div class="col-md-8">
            <div class="cms-grid-2">
                <?= field('s[programs_overline]', 'Section Overline', 'Explore Programs', $val('programs_overline', 'Explore Programs')) ?>
                <?= field('s[programs_h2]', 'Section Heading (H2)', 'Online Programs for Every Career Stage', $val('programs_h2')) ?>
            </div>
            <?= textarea('s[programs_subtitle]', 'Section Subtitle', 'Bachelors, masters, doctorate, and certifications. All delivered online. All guided by us for free.', $val('programs_subtitle'), 2) ?>
        </div>
        <div class="col-md-4 d-flex align-items-center">
            <div class="p-3 rounded w-100" style="background: rgba(124, 58, 237, 0.08); border: 1px solid rgba(124, 58, 237, 0.2);">
                <div class="font-weight-bold mb-1"><i class="fas fa-list-alt text-primary mr-1"></i> Manage Degree Programs</div>
                <small class="text-muted d-block mb-2">Individual degree courses (MBA, MCA, BCA, etc.) are managed in the dedicated Programs Manager.</small>
                <a href="<?= Url::to(['/program/index']) ?>" class="btn btn-sm btn-primary"><i class="fas fa-cog mr-1"></i> Open Programs Manager</a>
            </div>
        </div>
    </div>
    <?php sectionClose(); ?>

    <!-- ══════════════════════════════════════════════════════════════════════════
         5. WHY US SECTION
    ══════════════════════════════════════════════════════════════════════════ -->
    <?php sectionOpen('whyus', 'fas fa-shield-alt', 'Why Us / Trust Pillars', '4 Benefit Cards', $saveUrl, $clearUrl, $csrf, $csrfTok); ?>
    <div class="cms-grid-2 mb-3">
        <?= field('s[whyus_overline]', 'Section Overline', 'Why Trust Us', $val('whyus_overline', 'Why Trust Us')) ?>
        <?= field('s[whyus_h2]', 'Section Heading (H2)', 'Why Thousands Choose Degree Guru', $val('whyus_h2')) ?>
    </div>

    <div class="cms-grid-2">
        <?php foreach ([
            1 => ['Completely Free Counseling', 'Top universities support our work, so students pay nothing.'],
            2 => ['Easy EMI Options', 'Top universities offer no-cost or low-cost EMI plans.'],
            3 => ['Scholarships & Recruitment Support', 'We help you find scholarships and connect with opportunities.'],
            4 => ['Industry Ready Advice', 'Our counselors understand current job markets and hiring trends.'],
        ] as $n => [$defTitle, $defDesc]): ?>
            <div class="p-3 rounded mb-2" style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.08);">
                <div class="font-weight-bold text-primary mb-2">Card #<?= $n ?></div>
                <?= field("s[why{$n}_title]", "Title #{$n}", $defTitle, $val("why{$n}_title")) ?>
                <?= textarea("s[why{$n}_desc]", "Description #{$n}", $defDesc, $val("why{$n}_desc"), 2) ?>
            </div>
        <?php endforeach; ?>
    </div>
    <?php sectionClose(); ?>

    <!-- ══════════════════════════════════════════════════════════════════════════
         6. HOW IT WORKS (JOURNEY)
    ══════════════════════════════════════════════════════════════════════════ -->
    <?php sectionOpen('how', 'fas fa-shoe-prints', 'How It Works (3 Steps)', 'Student Journey Process', $saveUrl, $clearUrl, $csrf, $csrfTok); ?>
    <div class="cms-grid-2 mb-3">
        <?= field('s[how_overline]', 'Section Overline', 'Your Journey', $val('how_overline', 'Your Journey')) ?>
        <?= field('s[how_h2]', 'Section Heading (H2)', '3 Steps to Your Online Degree', $val('how_h2')) ?>
    </div>

    <div class="cms-grid-3">
        <?php foreach ([
            1 => ['01', 'Share Your Profile', 'Tell us your background and career goals'],
            2 => ['02', 'Get Recommendations', 'Receive your personalized university shortlist'],
            3 => ['03', 'Enroll with Confidence', 'We guide your application until you are admitted'],
        ] as $n => [$defNum, $defTitle, $defDesc]): ?>
            <div class="p-3 rounded mb-2" style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.08);">
                <div class="font-weight-bold text-primary mb-2">Step #<?= $n ?></div>
                <div class="row g-2">
                    <div class="col-4">
                        <?= field("s[step{$n}_num]", 'Number', $defNum, $val("step{$n}_num")) ?>
                    </div>
                    <div class="col-8">
                        <?= field("s[step{$n}_title]", 'Title', $defTitle, $val("step{$n}_title")) ?>
                    </div>
                </div>
                <?= textarea("s[step{$n}_desc]", 'Description', $defDesc, $val("step{$n}_desc"), 2) ?>
            </div>
        <?php endforeach; ?>
    </div>

    <div class="cms-grid-2 mt-2">
        <?= field('s[how_cta_text]', 'Journey CTA Button Text', 'Start My Journey', $val('how_cta_text', 'Start My Journey')) ?>
        <?= field('s[how_cta_url]', 'Journey CTA Target URL', '/contact', $val('how_cta_url', '/contact')) ?>
    </div>
    <?php sectionClose(); ?>

    <!-- ══════════════════════════════════════════════════════════════════════════
         7. SCHOOLING ONLINE SECTION
    ══════════════════════════════════════════════════════════════════════════ -->
    <?php sectionOpen('schooling', 'fas fa-school', 'Schooling Online (Class 10 & 12)', 'Secondary Education Fold', $saveUrl, $clearUrl, $csrf, $csrfTok); ?>
    <div class="row">
        <div class="col-md-6">
            <?= field('s[schooling_overline]', 'Section Overline', 'Schooling Online', $val('schooling_overline', 'Schooling Online')) ?>
            <?= field('s[schooling_h2]', 'Section Heading (H2)', 'Complete Your Schooling Online', $val('schooling_h2')) ?>
            <?= textarea('s[schooling_body]', 'Description Body', 'Missed formal schooling? You can now complete Class 10 or Class 12 online from home.', $val('schooling_body'), 3) ?>
            <div class="cms-grid-2">
                <?= field('s[school_cta_text]', 'Button Text', 'Learn More', $val('school_cta_text', 'Learn More')) ?>
                <?= field('s[school_cta_url]', 'Target URL', '/class-10-12', $val('school_cta_url', '/class-10-12')) ?>
            </div>
        </div>

        <div class="col-md-6">
            <div class="p-3 rounded mb-3" style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.08);">
                <div class="font-weight-bold text-primary mb-2">Class 10 Card</div>
                <div class="cms-grid-2">
                    <?= field('s[school_card1_title]', 'Title', 'Class 10 Online', $val('school_card1_title', 'Class 10 Online')) ?>
                    <?= field('s[school_card1_sub]', 'Subtitle', 'Secondary education from home.', $val('school_card1_sub', 'Secondary education from home.')) ?>
                </div>
                <?= imageWidget('school_card1_image', 'Class 10 Badge / Image', $val('school_card1_image'), 'Optional card image') ?>
            </div>

            <div class="p-3 rounded mb-2" style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.08);">
                <div class="font-weight-bold text-primary mb-2">Class 12 Card</div>
                <div class="cms-grid-2">
                    <?= field('s[school_card2_title]', 'Title', 'Class 12 Online', $val('school_card2_title', 'Class 12 Online')) ?>
                    <?= field('s[school_card2_sub]', 'Subtitle', 'Senior secondary, your way.', $val('school_card2_sub', 'Senior secondary, your way.')) ?>
                </div>
                <?= imageWidget('school_card2_image', 'Class 12 Badge / Image', $val('school_card2_image'), 'Optional card image') ?>
            </div>
        </div>
    </div>
    <?php sectionClose(); ?>

    <!-- ══════════════════════════════════════════════════════════════════════════
         8. TESTIMONIALS SECTION
    ══════════════════════════════════════════════════════════════════════════ -->
    <?php sectionOpen('testimonials', 'fas fa-comment-dots', 'Testimonials & Reviews', 'Student Feedback Cards', $saveUrl, $clearUrl, $csrf, $csrfTok); ?>
    <div class="cms-grid-4 mb-3">
        <?= field('s[testimonials_overline]', 'Section Overline', 'Stories', $val('testimonials_overline', 'Stories')) ?>
        <?= field('s[testimonials_h2]', 'Section Heading (H2)', 'Real Learners, Real Results', $val('testimonials_h2')) ?>
        <?= field('s[testimonials_rating]', 'Average Rating', '4.9', $val('testimonials_rating', '4.9')) ?>
        <?= field('s[testimonials_rating_label]', 'Rating Label', 'Google Rating', $val('testimonials_rating_label', 'Google Rating')) ?>
    </div>

    <input type="hidden" name="s[testimonials_json]" id="testimonials_json_input" value="<?= Html::encode($rawVal('testimonials_json')) ?>">

    <div class="d-flex justify-content-between align-items-center mb-3">
        <label class="card-inner-label mb-0">Student Reviews List</label>
        <button type="button" class="dg-add-btn btn btn-sm" onclick="window.dgAddTestimonial()"><i class="fas fa-plus fa-xs mr-1"></i> Add Student Review</button>
    </div>

    <div id="testimonials_list_container">
        <!-- Rendered via JS from testimonials_json_input -->
    </div>
    <?php sectionClose(); ?>

    <!-- ══════════════════════════════════════════════════════════════════════════
         9. CTA BANNER SECTION
    ══════════════════════════════════════════════════════════════════════════ -->
    <?php sectionOpen('cta', 'fas fa-bullhorn', 'Bottom CTA Callout Banner', 'Conversion Strip', $saveUrl, $clearUrl, $csrf, $csrfTok); ?>
    <div class="row">
        <div class="col-md-7">
            <?= field('s[cta_badge]', 'Pill Badge Text', 'Limited Spots This Week', $val('cta_badge', 'Limited Spots This Week')) ?>
            <?= field('s[cta_h2]', 'Banner Heading (H2)', 'Ready to Choose Your Online Degree?', $val('cta_h2')) ?>
            <?= textarea('s[cta_subtext]', 'Banner Subtext', 'Join 5,000+ students who found their perfect program — for free.', $val('cta_subtext'), 2) ?>

            <div class="cms-grid-2">
                <?= field('s[cta_button]', 'Primary Button Text', 'Talk to a Counselor. It is Free.', $val('cta_button')) ?>
                <?= field('s[cta_button_url]', 'Primary Button URL', '/contact', $val('cta_button_url', '/contact')) ?>
            </div>

            <div class="cms-grid-2">
                <?= field('s[cta_whatsapp_text]', 'WhatsApp Button Text', 'WhatsApp Us', $val('cta_whatsapp_text', 'WhatsApp Us')) ?>
                <?= field('s[cta_whatsapp_num]', 'WhatsApp Number', '919350199001', $val('cta_whatsapp_num', '919350199001')) ?>
            </div>
        </div>

        <div class="col-md-5">
            <label class="card-inner-label">Banner Background / Illustration</label>
            <?= imageWidget('cta_image', 'CTA Banner Background Image', $val('cta_image'), 'Optional custom background graphic') ?>
        </div>
    </div>
    <?php sectionClose(); ?>

    <!-- ══════════════════════════════════════════════════════════════════════════
         10. FAQ SECTION
    ══════════════════════════════════════════════════════════════════════════ -->
    <?php sectionOpen('faq', 'fas fa-question-circle', 'Frequently Asked Questions', 'Accordion Items', $saveUrl, $clearUrl, $csrf, $csrfTok); ?>
    <div class="cms-grid-2 mb-3">
        <?= field('s[faq_overline]', 'Section Overline', 'Got Questions?', $val('faq_overline', 'Got Questions?')) ?>
        <?= field('s[faq_h2]', 'Section Heading (H2)', 'Frequently Asked Questions', $val('faq_h2', 'Frequently Asked Questions')) ?>
    </div>

    <input type="hidden" name="s[faqs_json]" id="faqs_json_input" value="<?= Html::encode($rawVal('faqs_json')) ?>">

    <div class="d-flex justify-content-between align-items-center mb-3">
        <label class="card-inner-label mb-0">Question & Answer Items</label>
        <button type="button" class="dg-add-btn btn btn-sm" onclick="window.dgAddFaq()"><i class="fas fa-plus fa-xs mr-1"></i> Add FAQ</button>
    </div>

    <div id="faqs_list_container">
        <!-- Rendered via JS -->
    </div>
    <?php sectionClose(); ?>

    <!-- ══════════════════════════════════════════════════════════════════════════
         11. ANNOUNCEMENTS TICKER
    ══════════════════════════════════════════════════════════════════════════ -->
    <?php sectionOpen('announcement', 'fas fa-bullhorn', 'Site Announcements Banner', 'Top Notification Ticker', $saveUrl, $clearUrl, $csrf, $csrfTok); ?>
    <input type="hidden" name="s[announcements_json]" id="announcements_json_input" value="<?= Html::encode($rawVal('announcements_json')) ?>">

    <div class="d-flex justify-content-between align-items-center mb-3">
        <label class="card-inner-label mb-0">Active Announcements</label>
        <button type="button" class="dg-add-btn btn btn-sm" onclick="window.dgAddAnnouncement()"><i class="fas fa-plus fa-xs mr-1"></i> Add Announcement</button>
    </div>

    <div id="announcements_list_container">
        <!-- Rendered via JS -->
    </div>
    <?php sectionClose(); ?>

    <!-- ══════════════════════════════════════════════════════════════════════════
         12. CONTACT INFO & LEADS SECTION
    ══════════════════════════════════════════════════════════════════════════ -->
    <?php sectionOpen('contact', 'fas fa-phone', 'Contact Info & Lead Form', 'Support Channels', $saveUrl, $clearUrl, $csrf, $csrfTok); ?>
    <div class="cms-grid-2">
        <?= field('s[contact_overline]', 'Section Overline', 'Talk To Us', $val('contact_overline', 'Talk To Us')) ?>
        <?= field('s[contact_h2]', 'Section Heading (H2)', 'Get Free Counseling', $val('contact_h2', 'Get Free Counseling')) ?>
    </div>
    <?= textarea('s[contact_subtitle]', 'Subtitle Description', 'Fill in your details. Our experts will call you back within 2 hours.', $val('contact_subtitle'), 2) ?>

    <div class="cms-grid-2">
        <?= field('s[phone]', 'Contact Phone (10 digits)', '9350199001', $val('phone'), $hasE('phone'), $err('phone')) ?>
        <?= field('s[whatsapp_number]', 'WhatsApp Number (with country code, no +)', '919350199001', $val('whatsapp_number'), $hasE('whatsapp_number'), $err('whatsapp_number')) ?>
    </div>

    <div class="cms-grid-2">
        <?= field('s[email_admissions]', 'Admissions Email', 'admissions@degreeguru.in', $val('email_admissions'), $hasE('email_admissions'), $err('email_admissions')) ?>
        <?= field('s[email_queries]', 'General Queries Email', 'info@degreeguru.in', $val('email_queries'), $hasE('email_queries'), $err('email_queries')) ?>
    </div>

    <div class="cms-grid-2">
        <?= field('s[address]', 'Office Location / Address', 'Gurugram, Haryana, India', $val('address')) ?>
        <?= field('s[availability]', 'Availability Hours', 'Available all 7 days (9 AM – 8 PM)', $val('availability', 'Available all 7 days')) ?>
    </div>
    <?php sectionClose(); ?>

</div>

<!-- Universal JavaScript Engine for Image Uploads & Dynamic Lists -->
<script>
(function() {
    var uploadUrl = '<?= $uploadUrl ?>';
    var csrfName  = '<?= $csrf ?>';
    var csrfToken = '<?= $csrfTok ?>';

    // Image Widget Handlers
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

    // Live SEO Title & Desc Sync
    var seoTitleInput = document.getElementById('f_s_seo_title_');
    var seoDescInput = document.getElementById('f_s_seo_description_');
    var seoPrevTitle = document.getElementById('seo_prev_title');
    var seoPrevDesc = document.getElementById('seo_prev_desc');

    if (seoTitleInput && seoPrevTitle) {
        seoTitleInput.addEventListener('input', function() {
            seoPrevTitle.textContent = this.value || 'Degree Guru | India\'s #1 Free Career Counseling Platform';
        });
    }
    if (seoDescInput && seoPrevDesc) {
        seoDescInput.addEventListener('input', function() {
            seoPrevDesc.textContent = this.value || 'Explore 100% online degree programs from India\'s top UGC-approved universities...';
        });
    }

    // ── Dynamic Testimonials Editor ─────────────────────────────────────────
    var testDataInput = document.getElementById('testimonials_json_input');
    var testContainer = document.getElementById('testimonials_list_container');
    var testimonials = [];

    try {
        testimonials = JSON.parse(testDataInput.value || '[]');
        if (!Array.isArray(testimonials)) testimonials = [];
    } catch(e) { testimonials = []; }

    function renderTestimonials() {
        if (!testContainer) return;
        testContainer.innerHTML = '';

        if (testimonials.length === 0) {
            testContainer.innerHTML = '<div class="text-muted p-3 text-center border rounded">No testimonials added yet. Click "+ Add Student Review" above to add one.</div>';
            return;
        }

        testimonials.forEach(function(item, idx) {
            var row = document.createElement('div');
            row.className = 'p-3 rounded mb-3';
            row.style.background = 'rgba(255, 255, 255, 0.02)';
            row.style.border = '1px solid rgba(255, 255, 255, 0.08)';

            var html = '<div class="d-flex justify-content-between align-items-center mb-2">' +
                '<span class="font-weight-bold text-primary">Student Review #' + (idx + 1) + '</span>' +
                '<button type="button" class="btn btn-sm btn-outline-danger" onclick="window.dgRemoveTestimonial(' + idx + ')"><i class="fas fa-trash fa-xs mr-1"></i> Remove</button>' +
                '</div>' +
                '<div class="cms-grid-3 mb-2">' +
                '  <div><label class="dg-filter-label mb-1">Student Name</label><input type="text" class="form-control form-control-sm" value="' + (item.name || '') + '" oninput="window.dgUpdateTestimonial(' + idx + ', \'name\', this.value)" placeholder="e.g. Priya Sharma"></div>' +
                '  <div><label class="dg-filter-label mb-1">Course / University</label><input type="text" class="form-control form-control-sm" value="' + (item.role || '') + '" oninput="window.dgUpdateTestimonial(' + idx + ', \'role\', this.value)" placeholder="e.g. Online MBA, NMIMS"></div>' +
                '  <div><label class="dg-filter-label mb-1">Avatar Photo URL</label><input type="url" class="form-control form-control-sm" value="' + (item.img || '') + '" oninput="window.dgUpdateTestimonial(' + idx + ', \'img\', this.value)" placeholder="https://... or leave empty"></div>' +
                '</div>' +
                '<div><label class="dg-filter-label mb-1">Review Quote</label><textarea class="form-control form-control-sm" rows="2" oninput="window.dgUpdateTestimonial(' + idx + ', \'text\', this.value)" placeholder="Write student feedback...">' + (item.text || '') + '</textarea></div>';

            row.innerHTML = html;
            testContainer.appendChild(row);
        });

        testDataInput.value = JSON.stringify(testimonials);
    }

    window.dgAddTestimonial = function() {
        testimonials.push({ name: '', role: '', text: '', img: '' });
        renderTestimonials();
    };

    window.dgRemoveTestimonial = function(idx) {
        testimonials.splice(idx, 1);
        renderTestimonials();
    };

    window.dgUpdateTestimonial = function(idx, field, val) {
        if (testimonials[idx]) {
            testimonials[idx][field] = val;
            testDataInput.value = JSON.stringify(testimonials);
        }
    };

    renderTestimonials();

    // ── Dynamic FAQs Editor ────────────────────────────────────────────────
    var faqDataInput = document.getElementById('faqs_json_input');
    var faqContainer = document.getElementById('faqs_list_container');
    var faqs = [];

    try {
        faqs = JSON.parse(faqDataInput.value || '[]');
        if (!Array.isArray(faqs)) faqs = [];
    } catch(e) { faqs = []; }

    function renderFaqs() {
        if (!faqContainer) return;
        faqContainer.innerHTML = '';

        if (faqs.length === 0) {
            faqContainer.innerHTML = '<div class="text-muted p-3 text-center border rounded">No FAQs added yet. Click "+ Add FAQ" above to add one.</div>';
            return;
        }

        faqs.forEach(function(item, idx) {
            var row = document.createElement('div');
            row.className = 'p-3 rounded mb-3';
            row.style.background = 'rgba(255, 255, 255, 0.02)';
            row.style.border = '1px solid rgba(255, 255, 255, 0.08)';

            var html = '<div class="d-flex justify-content-between align-items-center mb-2">' +
                '<span class="font-weight-bold text-primary">Question #' + (idx + 1) + '</span>' +
                '<button type="button" class="btn btn-sm btn-outline-danger" onclick="window.dgRemoveFaq(' + idx + ')"><i class="fas fa-trash fa-xs mr-1"></i> Remove</button>' +
                '</div>' +
                '<div class="mb-2"><label class="dg-filter-label mb-1">Question</label><input type="text" class="form-control form-control-sm" value="' + (item.q || '') + '" oninput="window.dgUpdateFaq(' + idx + ', \'q\', this.value)" placeholder="e.g. Is counseling really 100% free?"></div>' +
                '<div><label class="dg-filter-label mb-1">Answer</label><textarea class="form-control form-control-sm" rows="2" oninput="window.dgUpdateFaq(' + idx + ', \'a\', this.value)" placeholder="Enter clear explanation...">' + (item.a || '') + '</textarea></div>';

            row.innerHTML = html;
            faqContainer.appendChild(row);
        });

        faqDataInput.value = JSON.stringify(faqs);
    }

    window.dgAddFaq = function() {
        faqs.push({ q: '', a: '' });
        renderFaqs();
    };

    window.dgRemoveFaq = function(idx) {
        faqs.splice(idx, 1);
        renderFaqs();
    };

    window.dgUpdateFaq = function(idx, field, val) {
        if (faqs[idx]) {
            faqs[idx][field] = val;
            faqDataInput.value = JSON.stringify(faqs);
        }
    };

    renderFaqs();

    // ── Dynamic Announcements Editor ───────────────────────────────────────
    var annDataInput = document.getElementById('announcements_json_input');
    var annContainer = document.getElementById('announcements_list_container');
    var announcements = [];

    try {
        announcements = JSON.parse(annDataInput.value || '[]');
        if (!Array.isArray(announcements)) announcements = [];
    } catch(e) { announcements = []; }

    function renderAnnouncements() {
        if (!annContainer) return;
        annContainer.innerHTML = '';

        if (announcements.length === 0) {
            annContainer.innerHTML = '<div class="text-muted p-3 text-center border rounded">No announcements active. Click "+ Add Announcement" above to publish one.</div>';
            return;
        }

        announcements.forEach(function(item, idx) {
            var row = document.createElement('div');
            row.className = 'p-3 rounded mb-3';
            row.style.background = 'rgba(255, 255, 255, 0.02)';
            row.style.border = '1px solid rgba(255, 255, 255, 0.08)';

            var html = '<div class="d-flex justify-content-between align-items-center mb-2">' +
                '<span class="font-weight-bold text-primary">Announcement #' + (idx + 1) + '</span>' +
                '<button type="button" class="btn btn-sm btn-outline-danger" onclick="window.dgRemoveAnnouncement(' + idx + ')"><i class="fas fa-trash fa-xs mr-1"></i> Remove</button>' +
                '</div>' +
                '<div class="cms-grid-2 mb-2">' +
                '  <div><label class="dg-filter-label mb-1">Banner Message</label><input type="text" class="form-control form-control-sm" value="' + (item.text || '') + '" oninput="window.dgUpdateAnnouncement(' + idx + ', \'text\', this.value)" placeholder="e.g. Admissions open for July 2026 session!"></div>' +
                '  <div><label class="dg-filter-label mb-1">Target Link (Optional)</label><input type="text" class="form-control form-control-sm" value="' + (item.link || '') + '" oninput="window.dgUpdateAnnouncement(' + idx + ', \'link\', this.value)" placeholder="/programs"></div>' +
                '</div>';

            row.innerHTML = html;
            annContainer.appendChild(row);
        });

        annDataInput.value = JSON.stringify(announcements);
    }

    window.dgAddAnnouncement = function() {
        announcements.push({ text: '', link: '' });
        renderAnnouncements();
    };

    window.dgRemoveAnnouncement = function(idx) {
        announcements.splice(idx, 1);
        renderAnnouncements();
    };

    window.dgUpdateAnnouncement = function(idx, field, val) {
        if (announcements[idx]) {
            announcements[idx][field] = val;
            annDataInput.value = JSON.stringify(announcements);
        }
    };

    renderAnnouncements();

    // Smooth Scroll for Section Jump Pills
    document.querySelectorAll('.cms-nav-pill').forEach(function(pill) {
        pill.addEventListener('click', function(e) {
            var targetId = this.getAttribute('href');
            if (targetId && targetId.startsWith('#')) {
                var targetEl = document.querySelector(targetId);
                if (targetEl) {
                    e.preventDefault();
                    var offset = 80;
                    var bodyRect = document.body.getBoundingClientRect().top;
                    var elementRect = targetEl.getBoundingClientRect().top;
                    var elementPosition = elementRect - bodyRect;
                    var offsetPosition = elementPosition - offset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });

                    document.querySelectorAll('.cms-nav-pill').forEach(function(p) { p.classList.remove('active'); });
                    this.classList.add('active');
                }
            }
        });
    });

    // Auto-highlight active pill on scroll
    if ('IntersectionObserver' in window) {
        var sections = document.querySelectorAll('[id^="section-"]');
        var observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    var id = entry.target.getAttribute('id');
                    var activePill = document.querySelector('.cms-nav-pill[href="#' + id + '"]');
                    if (activePill) {
                        document.querySelectorAll('.cms-nav-pill').forEach(function(p) { p.classList.remove('active'); });
                        activePill.classList.add('active');
                        var pillContainer = document.querySelector('.cms-sticky-nav');
                        if (pillContainer) {
                            var pillLeft = activePill.offsetLeft;
                            var pillWidth = activePill.offsetWidth;
                            var containerWidth = pillContainer.offsetWidth;
                            pillContainer.scrollTo({
                                left: pillLeft - (containerWidth / 2) + (pillWidth / 2),
                                behavior: 'smooth'
                            });
                        }
                    }
                }
            });
        }, {
            rootMargin: '-15% 0px -65% 0px',
            threshold: 0
        });

        sections.forEach(function(sec) {
            observer.observe(sec);
        });
    }

})();
</script>

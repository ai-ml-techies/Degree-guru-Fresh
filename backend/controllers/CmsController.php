<?php

declare(strict_types=1);

namespace app\controllers;

use Yii;
use app\models\SiteSetting;
use yii\filters\AccessControl;
use yii\web\Controller;
use yii\web\UploadedFile;
use yii\web\Response;

class CmsController extends Controller
{
    public function behaviors(): array
    {
        return [
            'access' => [
                'class' => AccessControl::class,
                'rules' => [['allow' => true, 'roles' => ['@']]],
            ],
        ];
    }

    // ─── Section key map ──────────────────────────────────────────────────────

    private static function sectionKeys(): array
    {
        return [
            'seo'          => ['seo_title','seo_description','seo_og_image','seo_focus_keyword','seo_robots'],
            'hero'         => [
                'hero_h1','hero_subtitle','hero_cta_primary','hero_cta_primary_link',
                'hero_cta_secondary','hero_cta_secondary_link','hero_badge_1','hero_badge_2',
                'hero_badge_3','hero_image','hero_students_count','hero_rating_value',
                'hero_rating_label','hero_card_badge','hero_card_text'
            ],
            'stats'        => [
                'stat1_value','stat1_suffix','stat1_label',
                'stat2_value','stat2_suffix','stat2_label',
                'stat3_value','stat3_suffix','stat3_label'
            ],
            'vision'       => [
                'vision_overline','vision_h2','vision_body',
                'vision_tag1','vision_tag2','vision_tag3','vision_tag4',
                'vision_stat1_label','vision_stat1_val',
                'vision_stat2_label','vision_stat2_val',
                'vision_stat3_label','vision_stat3_val',
                'vision_stat4_label','vision_stat4_val',
                'vision_image'
            ],
            'programs'     => ['programs_overline','programs_h2','programs_subtitle'],
            'whyus'        => [
                'whyus_overline','whyus_h2',
                'why1_title','why1_desc',
                'why2_title','why2_desc',
                'why3_title','why3_desc',
                'why4_title','why4_desc'
            ],
            'how'          => [
                'how_overline','how_h2',
                'step1_num','step1_title','step1_desc',
                'step2_num','step2_title','step2_desc',
                'step3_num','step3_title','step3_desc',
                'how_cta_text','how_cta_url'
            ],
            'schooling'    => [
                'schooling_overline','schooling_h2','schooling_body',
                'school_cta_text','school_cta_url',
                'school_card1_title','school_card1_sub','school_card1_image',
                'school_card2_title','school_card2_sub','school_card2_image'
            ],
            'testimonials' => [
                'testimonials_overline','testimonials_h2',
                'testimonials_rating','testimonials_rating_label',
                'testimonials_json'
            ],
            'faq'          => ['faq_overline','faq_h2','faqs_json'],
            'cta'          => [
                'cta_badge','cta_h2','cta_subtext',
                'cta_button','cta_button_url',
                'cta_whatsapp_text','cta_whatsapp_num',
                'cta_image'
            ],
            'announcement' => ['announcements_json'],
            'contact'      => [
                'contact_overline','contact_h2','contact_subtitle',
                'phone','whatsapp_number','email_admissions','email_queries',
                'address','availability'
            ],
            // About Page
            'about_hero'   => ['about_hero_overline','about_hero_title','about_hero_subtitle','about_hero_image'],
            'about_story'  => ['about_story_overline','about_story_title','about_story_body'],
            'about_vision' => ['about_vision_overline','about_vision_title','about_vision_body'],
            'about_diff'   => [
                'about_diff_title',
                'about_diff1_title','about_diff1_desc',
                'about_diff2_title','about_diff2_desc',
                'about_diff3_title','about_diff3_desc',
                'about_diff4_title','about_diff4_desc'
            ],
            // Contact Page
            'contact_page' => [
                'contact_page_overline','contact_page_title','contact_page_subtitle',
                'contact_header_image','contact_page_phone','contact_page_whatsapp',
                'contact_page_email_admissions','contact_page_email_queries',
                'contact_page_address','contact_page_hours','contact_page_map_url'
            ],
        ];
    }

    // ─── Validation ───────────────────────────────────────────────────────────

    private function validateSection(string $section, array $post): array
    {
        $errors = [];

        if ($section === 'seo') {
            $title = trim($post['seo_title'] ?? '');
            if ($title !== '' && strlen($title) > 70) {
                $errors['seo_title'] = 'SEO title must be 70 characters or fewer.';
            }
            $desc = trim($post['seo_description'] ?? '');
            if ($desc !== '' && strlen($desc) > 160) {
                $errors['seo_description'] = 'Meta description must be 160 characters or fewer.';
            }
        }

        if ($section === 'hero') {
            if (trim($post['hero_h1'] ?? '') === '') {
                $errors['hero_h1'] = 'Hero heading is required.';
            }
        }

        if ($section === 'testimonials') {
            $json = trim($post['testimonials_json'] ?? '');
            if ($json !== '' && json_decode($json) === null) {
                $errors['testimonials_json'] = 'Invalid testimonials data. Please do not edit the JSON manually.';
            }
        }

        if ($section === 'faq') {
            $json = trim($post['faqs_json'] ?? '');
            if ($json !== '' && json_decode($json) === null) {
                $errors['faqs_json'] = 'Invalid FAQ data. Please do not edit the JSON manually.';
            }
        }

        if ($section === 'announcement') {
            $json = trim($post['announcements_json'] ?? '');
            if ($json !== '' && json_decode($json) === null) {
                $errors['announcements_json'] = 'Invalid announcement data. Please do not edit the JSON manually.';
            }
        }

        if ($section === 'stats') {
            foreach ([1, 2, 3] as $n) {
                $val = trim($post["stat{$n}_value"] ?? '');
                if ($val !== '' && !ctype_digit($val)) {
                    $errors["stat{$n}_value"] = 'Must be a whole number.';
                }
            }
        }

        if ($section === 'contact') {
            $phone = trim($post['phone'] ?? '');
            if ($phone !== '' && !preg_match('/^\d{10}$/', $phone)) {
                $errors['phone'] = 'Phone must be exactly 10 digits (numbers only, no spaces or symbols).';
            }

            $wa = trim($post['whatsapp_number'] ?? '');
            if ($wa !== '' && !preg_match('/^\d{10,13}$/', $wa)) {
                $errors['whatsapp_number'] = 'WhatsApp number must be 10–13 digits including country code (e.g. 919350199001). No + sign.';
            }

            $eAdm = trim($post['email_admissions'] ?? '');
            if ($eAdm !== '' && !filter_var($eAdm, FILTER_VALIDATE_EMAIL)) {
                $errors['email_admissions'] = 'Enter a valid email address (e.g. admissions@degreeguru.in).';
            }

            $eQ = trim($post['email_queries'] ?? '');
            if ($eQ !== '' && !filter_var($eQ, FILTER_VALIDATE_EMAIL)) {
                $errors['email_queries'] = 'Enter a valid email address (e.g. info@degreeguru.in).';
            }
        }

        return $errors;
    }

    // ─── Actions ──────────────────────────────────────────────────────────────

    public function actionHome(): string|\yii\web\Response
    {
        $settings    = SiteSetting::getAll();
        $fieldErrors = [];
        $activeSection = null;

        if (Yii::$app->request->isPost) {
            $section = Yii::$app->request->post('section', '');
            $post    = Yii::$app->request->post('s', []);

            $fieldErrors   = $this->validateSection($section, $post);
            $activeSection = $section;

            if (empty($fieldErrors)) {
                if (SiteSetting::setMany($post)) {
                    Yii::$app->session->setFlash('success', 'Section saved successfully.');
                } else {
                    Yii::$app->session->setFlash('error', 'Could not save. Please try again.');
                }
                return $this->redirect(['/cms/home']);
            }

            // Validation failed — merge submitted values so user sees what they typed
            $settings = array_merge($settings, $post);
        }

        $this->view->title = 'Home Page Content';
        return $this->render('home', [
            's'             => $settings,
            'errors'        => $fieldErrors,
            'activeSection' => $activeSection,
        ]);
    }

    // POST /cms/upload-image — AJAX image upload, returns {url} or {error}
    public function actionUploadImage(): Response
    {
        Yii::$app->response->format = Response::FORMAT_JSON;

        $file = UploadedFile::getInstanceByName('image');

        if (!$file) {
            return $this->asJson(['error' => 'No file received.']);
        }

        $allowed = ['jpg', 'jpeg', 'png', 'webp', 'gif'];
        $ext     = strtolower($file->extension);
        if (!in_array($ext, $allowed, true)) {
            return $this->asJson(['error' => 'Only JPG, PNG, WebP or GIF images are allowed.']);
        }

        if ($file->size > 5 * 1024 * 1024) {
            return $this->asJson(['error' => 'Image must be under 5 MB.']);
        }

        $uploadDir = Yii::getAlias('@webroot') . '/uploads/images/';
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0775, true);
        }

        $safeName = 'cms-' . time() . '-' . bin2hex(random_bytes(4)) . '.' . $ext;

        if (!$file->saveAs($uploadDir . $safeName)) {
            return $this->asJson(['error' => 'Could not save image. Check folder permissions.']);
        }

        $url = Yii::$app->request->hostInfo . '/uploads/images/' . $safeName;
        return $this->asJson(['url' => $url]);
    }

    // POST /cms/clear-section — delete all keys belonging to one section
    public function actionClearSection(): \yii\web\Response
    {
        $section   = Yii::$app->request->post('section', '');
        $returnUrl = Yii::$app->request->post('return_url', ['/cms/home']);
        $keys      = self::sectionKeys()[$section] ?? [];

        if (!empty($keys)) {
            Yii::$app->db
                ->createCommand()
                ->delete('site_settings', ['key' => $keys])
                ->execute();
        }

        Yii::$app->session->setFlash('success', ucfirst($section) . ' section cleared successfully.');
        return $this->redirect($returnUrl);
    }

    // GET / POST /cms/about — About Page Editor
    public function actionAbout(): string|\yii\web\Response
    {
        $settings      = SiteSetting::getAll();
        $fieldErrors   = [];
        $activeSection = null;

        if (Yii::$app->request->isPost) {
            $section = Yii::$app->request->post('section', '');
            $post    = Yii::$app->request->post('s', []);
            $activeSection = $section;

            if (SiteSetting::setMany($post)) {
                Yii::$app->session->setFlash('success', 'About page section saved successfully.');
            } else {
                Yii::$app->session->setFlash('error', 'Could not save. Please try again.');
            }
            return $this->redirect(['/cms/about']);
        }

        $this->view->title = 'About Page Content';
        return $this->render('about', [
            's'             => $settings,
            'errors'        => $fieldErrors,
            'activeSection' => $activeSection,
        ]);
    }

    // GET / POST /cms/contact — Contact Page Editor
    public function actionContact(): string|\yii\web\Response
    {
        $settings      = SiteSetting::getAll();
        $fieldErrors   = [];
        $activeSection = null;

        if (Yii::$app->request->isPost) {
            $section = Yii::$app->request->post('section', '');
            $post    = Yii::$app->request->post('s', []);
            $activeSection = $section;

            if (SiteSetting::setMany($post)) {
                Yii::$app->session->setFlash('success', 'Contact page section saved successfully.');
            } else {
                Yii::$app->session->setFlash('error', 'Could not save. Please try again.');
            }
            return $this->redirect(['/cms/contact']);
        }

        $this->view->title = 'Contact Page Content';
        return $this->render('contact', [
            's'             => $settings,
            'errors'        => $fieldErrors,
            'activeSection' => $activeSection,
        ]);
    }
}


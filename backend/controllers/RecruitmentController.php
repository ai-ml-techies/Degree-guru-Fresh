<?php

declare(strict_types=1);

namespace app\controllers;

use DateTime;
use Yii;
use app\models\ErrorLog;
use app\models\Recruitment;
use app\models\RecruitmentSearch;
use yii\filters\AccessControl;
use yii\web\Controller;
use yii\web\NotFoundHttpException;
use yii\web\Response;
use yii\web\UploadedFile;

class RecruitmentController extends Controller
{
    public $enableCsrfValidation = false;

    private function allowedOrigins(): array
    {
        return Yii::$app->params['corsAllowedOrigins'] ?? [];
    }


    public function behaviors(): array
    {
        return [
            'access' => [
                'class' => AccessControl::class,
                'except' => ['submit'],
                'rules' => [
                    [
                        'allow' => true,
                        'roles' => ['@'],
                    ],
                ],
            ],
        ];
    }

    // ─── PUBLIC API ───────────────────────────────────────────────────────────

    /**
     * POST /recruitment/submit  (also handles OPTIONS preflight)
     */
    public function actionSubmit(): Response
    {
        $this->setCorsHeaders();

        // Handle browser CORS preflight
        if (Yii::$app->request->method === 'OPTIONS') {
            return $this->asJson(['status' => 'ok']);
        }

        if (Yii::$app->request->method !== 'POST') {
            ErrorLog::write('server', 'recruitment/submit', 'Invalid HTTP method: ' . Yii::$app->request->method, [
                'origin'  => Yii::$app->request->headers->get('Origin', ''),
                'headers' => Yii::$app->request->headers->toArray(),
            ]);
            return $this->jsonError('Method not allowed.', 405);
        }

        Yii::$app->response->format = Response::FORMAT_JSON;

        $post = Yii::$app->request->post();

        // ── 1. Validate fields ────────────────────────────────────────────────
        $validationErrors = $this->validateFields($post);
        if (!empty($validationErrors)) {
            ErrorLog::write('validation', 'recruitment/submit', implode(' | ', $validationErrors), [
                'fields' => array_map('strval', array_filter($post)),
            ]);
            return $this->asJson([
                'success' => false,
                'errors'  => $validationErrors,
                'message' => $validationErrors[0],
            ]);
        }

        // ── 2. Validate resume file ───────────────────────────────────────────
        $file = UploadedFile::getInstanceByName('resume');

        if (!$file) {
            return $this->asJson(['success' => false, 'message' => 'Resume file is required. Please attach a PDF, DOC, or DOCX file.', 'errors' => ['Resume file is required.']]);
        }

        $ext = strtolower($file->extension);
        if (!in_array($ext, ['pdf', 'doc', 'docx'], true)) {
            return $this->asJson(['success' => false, 'message' => 'Invalid file type. Only PDF, DOC, or DOCX files are accepted.', 'errors' => ['Invalid resume file type.']]);
        }

        if ($file->size > 5 * 1024 * 1024) {
            return $this->asJson(['success' => false, 'message' => 'Resume file is too large. Maximum allowed size is 5 MB.', 'errors' => ['Resume must be under 5 MB.']]);
        }

        // ── 3. Save resume file ───────────────────────────────────────────────
        $uploadDir = Yii::getAlias('@webroot') . '/uploads/resumes/';
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0775, true);
        }

        $safeName = time() . '_' . bin2hex(random_bytes(8)) . '.' . $ext;
        if (!$file->saveAs($uploadDir . $safeName)) {
            ErrorLog::write('server', 'recruitment/submit', 'Failed to save resume file to disk.', [
                'upload_dir' => $uploadDir,
                'file_name'  => $file->name,
            ]);
            return $this->asJson(['success' => false, 'message' => 'Could not save your resume. Please try again.', 'errors' => ['File upload failed.']]);
        }

        // ── 4. Save to database ───────────────────────────────────────────────
        $model = new Recruitment();
        $model->name            = trim($post['name']);
        $model->email           = trim($post['email'] ?? '');
        $model->phone           = trim($post['phone']);
        $model->dob             = trim($post['dob']);
        $model->country         = trim($post['country']);
        $model->state           = trim($post['state']);
        $model->city            = trim($post['city']);
        $model->industry        = trim($post['industry']);
        $model->experience      = trim($post['experience'] ?? '');
        $model->resume_filename = $safeName;
        $model->resume_original = $file->name;

        if ($model->save(false)) {
            return $this->asJson(['success' => true, 'message' => 'Application received! Our recruitment team will reach out within 2 hours.']);
        }

        // DB save failed — clean up uploaded file
        @unlink($uploadDir . $safeName);
        ErrorLog::write('database', 'recruitment/submit', 'Failed to save recruitment record.', [
            'model_errors' => $model->getErrors(),
            'data'         => $model->getAttributes(),
        ]);

        return $this->asJson(['success' => false, 'message' => 'Could not save your application. Please try again.', 'errors' => ['Database error.']]);
    }

    // ─── ADMIN ────────────────────────────────────────────────────────────────

    public function actionIndex(): string
    {
        $searchModel  = new RecruitmentSearch();
        $dataProvider = $searchModel->search(Yii::$app->request->queryParams);

        $cities = Recruitment::find()
            ->select('city')
            ->distinct()
            ->orderBy(['city' => SORT_ASC])
            ->column();

        return $this->render('index', [
            'searchModel'  => $searchModel,
            'dataProvider' => $dataProvider,
            'cities'       => $cities,
        ]);
    }

    public function actionView(int $id): string
    {
        $model = $this->findModel($id);
        return $this->render('view', ['model' => $model]);
    }

    public function actionDownload(int $id): Response
    {
        $model    = $this->findModel($id);
        $filename = $model->resume_filename;

        $candidates = [];
        try {
            $candidates[] = Yii::getAlias('@webroot') . '/uploads/resumes/';
        } catch (\Throwable $e) {
        }
        try {
            $candidates[] = Yii::getAlias('@app') . '/web/uploads/resumes/';
        } catch (\Throwable $e) {
        }
        // common alternate locations
        $candidates[] = dirname(__DIR__) . '/web/uploads/resumes/';
        $candidates[] = dirname(__DIR__) . '/../web/uploads/resumes/';
        $candidates[] = dirname(__DIR__) . '/uploads/resumes/';

        $attempted = [];
        $foundPath = null;
        foreach ($candidates as $dir) {
            if (empty($dir)) {
                continue;
            }
            $path = rtrim($dir, DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR . $filename;
            $attempted[] = $path;
            if (is_file($path)) {
                $foundPath = $path;
                break;
            }
        }

        if ($foundPath === null) {
            ErrorLog::write('server', 'recruitment/download', 'Resume file missing on disk. Tried multiple locations.', [
                'id'              => $id,
                'resume_filename' => $filename,
                'attempted_paths' => $attempted,
            ]);
            throw new NotFoundHttpException('Resume file not found on server.');
        }

        return Yii::$app->response->sendFile($foundPath, $model->resume_original);
    }

    // ─── HELPERS ─────────────────────────────────────────────────────────────

    private function findModel(int $id): Recruitment
    {
        $model = Recruitment::findOne($id);
        if (!$model) {
            throw new NotFoundHttpException('Application not found.');
        }
        return $model;
    }

    private function validateFields(array $post): array
    {
        $errors = [];

        // Name
        $name = trim($post['name'] ?? '');
        if ($name === '') {
            $errors[] = 'Full name is required.';
        } elseif (strlen($name) < 2) {
            $errors[] = 'Full name must be at least 2 characters.';
        } elseif (strlen($name) > 100) {
            $errors[] = 'Full name must not exceed 100 characters.';
        } elseif (!preg_match('/^[\p{L} .\'-]{2,100}$/u', $name)) {
            $errors[] = 'Please enter a valid name (letters, spaces, dot, hyphen).';
        }

        // Phone
        $phone = preg_replace('/\D+/', '', (string)($post['phone'] ?? ''));
        if ($phone === '') {
            $errors[] = 'Phone number is required.';
        } elseif (!preg_match('/^[6-9][0-9]{9}$/', $phone)) {
            $errors[] = 'Phone number must be a valid 10-digit Indian mobile number.';
        }

        // Email (optional but validated if present)
        $email = trim($post['email'] ?? '');
        if ($email !== '') {
            if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
                $errors[] = 'Please enter a valid email address.';
            } else {
                $blocked = ['mailinator.com','10minutemail.com','tempmail.com','maildrop.cc','yopmail.com','guerrillamail.com'];
                $domain = strtolower(substr(strrchr($email, '@'), 1));
                if (in_array($domain, $blocked, true)) {
                    $errors[] = 'Disposable email addresses are not allowed.';
                }
            }
        }

        // Date of birth
        $dob = trim($post['dob'] ?? '');
        if ($dob === '') {
            $errors[] = 'Date of birth is required.';
        } else {
            $dobDate = DateTime::createFromFormat('Y-m-d', $dob);
            if (!$dobDate || $dobDate->format('Y-m-d') !== $dob) {
                $errors[] = 'Date of birth must be a valid date in YYYY-MM-DD format.';
            } else {
                $age = (new DateTime())->diff($dobDate)->y;
                if ($age < 16) {
                    $errors[] = 'You must be at least 16 years old to apply.';
                } elseif ($age > 80) {
                    $errors[] = 'Please enter a valid date of birth.';
                }
            }
        }

        // Location
        if (trim($post['country'] ?? '') === '') {
            $errors[] = 'Country is required.';
        }
        if (trim($post['state'] ?? '') === '') {
            $errors[] = 'State / province is required.';
        }
        if (trim($post['city'] ?? '') === '') {
            $errors[] = 'City is required.';
        }

        // Industry
        $industry = trim($post['industry'] ?? '');
        if ($industry === '') {
            $errors[] = 'Industry is required.';
        } elseif (strlen($industry) > 100) {
            $errors[] = 'Industry name must not exceed 100 characters.';
        }

        return $errors;
    }

    private function setCorsHeaders(): void
    {
        $origin = Yii::$app->request->headers->get('Origin', '');
        if (in_array($origin, $this->allowedOrigins(), true)) {
            Yii::$app->response->headers->set('Access-Control-Allow-Origin', $origin);
        }
        Yii::$app->response->headers->set('Access-Control-Allow-Methods', 'POST, OPTIONS');
        Yii::$app->response->headers->set('Access-Control-Allow-Headers', 'Content-Type, X-Requested-With');
        Yii::$app->response->headers->set('Access-Control-Allow-Credentials', 'true');
    }

    private function jsonError(string $message, int $status = 400): Response
    {
        Yii::$app->response->statusCode = $status;
        return $this->asJson(['success' => false, 'message' => $message, 'errors' => [$message]]);
    }
}

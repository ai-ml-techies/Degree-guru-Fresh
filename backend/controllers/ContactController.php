<?php

declare(strict_types=1);

namespace app\controllers;

use Yii;
use app\models\CounselingRequest;
use app\models\CounselingRequestSearch;
use app\models\ErrorLog;
use yii\filters\AccessControl;
use yii\web\Controller;
use yii\web\NotFoundHttpException;
use yii\web\Response;
use yii\filters\Cors;

class ContactController extends Controller
{
    public $enableCsrfValidation = false;



    public function behaviors(): array
    {
        $behaviors = parent::behaviors();

        $behaviors['corsFilter'] = [
            'class' => Cors::class,
            'cors' => [
                'Origin' => ['http://localhost:5173'],
                'Access-Control-Request-Method' => ['POST', 'OPTIONS'],
                'Access-Control-Request-Headers' => ['*'],
            ],
        ];

        return $behaviors;
    }

    /**
     * POST /contact/submit
     */
    public function actionSubmit(): Response
    {
        // Debugging line
        Yii::$app->response->format = Response::FORMAT_JSON;

        if (!Yii::$app->request->isPost) {
            return $this->jsonError('Method not allowed.', 405);
        }

        $name = trim((string) Yii::$app->request->post('name', ''));
        $phone = trim((string) Yii::$app->request->post('phone', ''));
        $email = trim((string) Yii::$app->request->post('email', '')) ?: null;
        $dob = trim((string) Yii::$app->request->post('dob', '')) ?: null;
        $message = trim((string) (Yii::$app->request->post('message') ?: Yii::$app->request->post('program', ''))) ?: null;
        $source = trim((string) Yii::$app->request->post('source', '')) ?: null;

        if (empty($name) || empty($phone)) {
            return $this->asJson([
                'success' => false,
                'message' => 'Please provide both your name and mobile number.',
            ]);
        }

        // 1. Save lead immediately to Excel-compatible CSV file with UTF-8 BOM
        try {
            $csvDir = Yii::getAlias('@app/web/uploads');
            if (!is_dir($csvDir)) {
                @mkdir($csvDir, 0777, true);
            }
            $csvFile = $csvDir . '/leads_excel.csv';
            $isNew = !file_exists($csvFile) || filesize($csvFile) === 0;
            $fp = fopen($csvFile, 'a');
            if ($fp) {
                if ($isNew) {
                    // Write UTF-8 BOM for Microsoft Excel
                    fputs($fp, "\xEF\xBB\xBF");
                    fputcsv($fp, ['Lead ID', 'Date & Time', 'Full Name', 'Phone', 'Email', 'Programme / Message', 'Source Page', 'Status'], ',', '"', '\\');
                }
                fputcsv($fp, [
                    'DG-' . date('Ymd') . '-' . substr(uniqid(), -4),
                    date('Y-m-d H:i:s'),
                    $name,
                    $phone,
                    $email ?? '',
                    $message ?? '',
                    $source ?? 'direct',
                    'New',
                ], ',', '"', '\\');
                fclose($fp);
            }
        } catch (\Throwable $e) {
            // Silently continue if file write fails
        }

        // 2. Persist to database if available
        try {
            $model = new CounselingRequest();
            $model->name = $name;
            $model->phone = $phone;
            $model->email = $email;
            $model->dob = $dob;
            $model->message = $message;
            $model->source_page = $source;
            $model->status = CounselingRequest::STATUS_NEW;

            if ($model->validate()) {
                $model->save(false);
            }
        } catch (\Throwable $dbEx) {
            // DB might be offline in some environments; lead is safely saved in Excel file
        }

        return $this->asJson([
            'success' => true,
            'message' => 'Request received! Our counselor will call you within 2 hours.',
            'excel_download' => '/uploads/leads_excel.csv',
        ]);
    }

    /**
     * POST /contact/send-otp
     */
    public function actionSendOtp(): Response
    {
        Yii::$app->response->format = Response::FORMAT_JSON;

        if (!Yii::$app->request->isPost) {
            return $this->jsonError('Method not allowed.', 405);
        }

        $email = strtolower(trim((string) Yii::$app->request->post('email', '')));
        if (!$email || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
            return $this->jsonError('Please provide a valid email address.');
        }

        $otp = (string) random_int(100000, 999999);

        // Store OTP in session or cache for 10 minutes (600s)
        if (Yii::$app->cache) {
            Yii::$app->cache->set('counseling_otp_' . $email, $otp, 600);
        } else {
            Yii::$app->session->set('counseling_otp_' . $email, [
                'otp' => $otp,
                'expires' => time() + 600,
            ]);
        }

        $sent = false;
        try {
            if (isset(Yii::$app->mailer)) {
                $sent = Yii::$app->mailer->compose()
                    ->setTo($email)
                    ->setSubject("Your Degree Guru Verification Code: {$otp}")
                    ->setHtmlBody("
                        <div style='font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px;'>
                            <h2 style='color: #6528f7; margin-bottom: 12px;'>Degree Guru Email Verification</h2>
                            <p style='color: #475569; font-size: 14px;'>Use the 6-digit verification code below to verify your email address for free career counseling:</p>
                            <div style='background: #f8fafc; border: 2px dashed #6528f7; padding: 18px; text-align: center; border-radius: 8px; margin: 20px 0;'>
                                <span style='font-size: 32px; font-weight: 800; letter-spacing: 6px; color: #6528f7;'>{$otp}</span>
                            </div>
                            <p style='color: #64748b; font-size: 12px;'>This code is valid for 10 minutes. If you did not request this, you can safely ignore this email.</p>
                            <hr style='border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;' />
                            <p style='color: #94a3b8; font-size: 11px;'>© 2026 Degree Guru. All rights reserved.</p>
                        </div>
                    ")
                    ->send();
            }
        } catch (\Throwable $e) {
            Yii::error("Failed to send OTP email: " . $e->getMessage(), __METHOD__);
        }

        return $this->asJson([
            'success' => true,
            'message' => 'Verification code sent to ' . $email,
            'dev_otp' => (defined('YII_ENV_DEV') && YII_ENV_DEV) || !$sent ? $otp : null,
        ]);
    }

    /**
     * POST /contact/verify-otp
     */
    public function actionVerifyOtp(): Response
    {
        Yii::$app->response->format = Response::FORMAT_JSON;

        if (!Yii::$app->request->isPost) {
            return $this->jsonError('Method not allowed.', 405);
        }

        $email = strtolower(trim((string) Yii::$app->request->post('email', '')));
        $otp = trim((string) Yii::$app->request->post('otp', ''));

        if (!$email || !$otp) {
            return $this->jsonError('Email and verification code are required.');
        }

        $storedOtp = null;
        if (Yii::$app->cache) {
            $storedOtp = Yii::$app->cache->get('counseling_otp_' . $email);
        } else {
            $sess = Yii::$app->session->get('counseling_otp_' . $email);
            if (is_array($sess) && isset($sess['otp'], $sess['expires']) && $sess['expires'] >= time()) {
                $storedOtp = $sess['otp'];
            }
        }

        if (!$storedOtp || (string) $storedOtp !== (string) $otp) {
            return $this->jsonError('Invalid or expired verification code. Please request a new code.');
        }

        // Successfully verified — clear the OTP
        if (Yii::$app->cache) {
            Yii::$app->cache->delete('counseling_otp_' . $email);
        } else {
            Yii::$app->session->remove('counseling_otp_' . $email);
        }

        return $this->asJson([
            'success' => true,
            'message' => 'Email verified successfully!',
        ]);
    }

    public function actionIndex(): string
    {
        $searchModel = new CounselingRequestSearch();

        $dataProvider = $searchModel->search(
            Yii::$app->request->queryParams
        );

        return $this->render('index', [
            'searchModel'  => $searchModel,
            'dataProvider' => $dataProvider,
        ]);
    }

    public function actionView(int $id): string
    {
        return $this->render('view', [
            'model' => $this->findModel($id),
        ]);
    }

    public function actionUpdateStatus(int $id): Response
    {
        Yii::$app->response->format = Response::FORMAT_JSON;

        $model = $this->findModel($id);

        $model->status = (int) Yii::$app->request->post(
            'status',
            $model->status
        );

        $model->save(false);

        return $this->asJson([
            'success' => true,
        ]);
    }



    public function actionExportExcel()
    {
        $filename = 'DegreeGuru_Leads_' . date('Y-m-d_His') . '.csv';

        header('Content-Type: text/csv; charset=UTF-8');
        header('Content-Disposition: attachment; filename="' . $filename . '"');
        header('Pragma: no-cache');
        header('Expires: 0');

        $output = fopen('php://output', 'w');
        // UTF-8 BOM for Microsoft Excel
        fputs($output, "\xEF\xBB\xBF");

        try {
            $models = CounselingRequest::find()->orderBy(['id' => SORT_DESC])->all();
            fputcsv($output, ['ID', 'Date', 'Full Name', 'Phone', 'Email', 'Programme / Message', 'Source Page', 'Status'], ',', '"', '\\');

            foreach ($models as $m) {
                fputcsv($output, [
                    $m->id,
                    $m->created_at ?? date('Y-m-d H:i:s'),
                    $m->name,
                    $m->phone,
                    $m->email ?? '',
                    $m->message ?? '',
                    $m->source_page ?? 'direct',
                    $m->status == CounselingRequest::STATUS_ENROLLED ? 'Enrolled' : ($m->status == CounselingRequest::STATUS_CONTACTED ? 'Contacted' : 'New'),
                ], ',', '"', '\\');
            }
        } catch (\Throwable $e) {
            // Fallback: Read from uploads/leads_excel.csv if database is unavailable
            $csvFile = Yii::getAlias('@app/web/uploads/leads_excel.csv');
            if (file_exists($csvFile)) {
                $fp = fopen($csvFile, 'r');
                // Read and check BOM
                $bom = fread($fp, 3);
                if ($bom !== "\xEF\xBB\xBF") {
                    rewind($fp);
                }
                while (($line = fgets($fp)) !== false) {
                    fputs($output, $line);
                }
                fclose($fp);
            } else {
                fputcsv($output, ['Lead ID', 'Date & Time', 'Full Name', 'Phone', 'Email', 'Programme / Message', 'Source Page', 'Status'], ',', '"', '\\');
            }
        }

        fclose($output);
        exit;
    }

    private function findModel(int $id): CounselingRequest
    {
        $model = CounselingRequest::findOne($id);

        if ($model === null) {
            throw new NotFoundHttpException(
                'Counseling request not found.'
            );
        }

        return $model;
    }

    private function jsonError(
        string $message,
        int $statusCode = 400
    ): Response {
        Yii::$app->response->statusCode = $statusCode;

        return $this->asJson([
            'success' => false,
            'message' => $message,
            'errors'  => [$message],
        ]);
    }
}

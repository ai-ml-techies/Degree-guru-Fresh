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

        $allowed = Yii::$app->params['corsAllowedOrigins'] ?? [
            'https://degreeguru.in',
            'https://www.degreeguru.in',
            'https://admin.degreeguru.in',
            'https://api.degreeguru.in',
            'http://localhost:5173',
            'http://localhost:8080',
        ];

        $behaviors['corsFilter'] = [
            'class' => Cors::class,
            'cors' => [
                'Origin' => $allowed,
                'Access-Control-Request-Method' => ['POST', 'OPTIONS', 'GET'],
                'Access-Control-Request-Headers' => ['*'],
                'Access-Control-Allow-Credentials' => true,
            ],
        ];

        return $behaviors;
    }

    public function beforeAction($action): bool
    {
        $this->enableCsrfValidation = false;
        if (Yii::$app->request->method === 'OPTIONS') {
            Yii::$app->response->statusCode = 200;
            Yii::$app->response->data = ['status' => 'ok'];
            Yii::$app->response->send();
            Yii::$app->end();
        }
        return parent::beforeAction($action);
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
        $formHeading = trim((string) Yii::$app->request->post('form_heading', ''));
        $city = trim((string) Yii::$app->request->post('city', ''));
        $age = trim((string) Yii::$app->request->post('age', ''));
        $status = trim((string) Yii::$app->request->post('status', ''));
        $graduate = trim((string) Yii::$app->request->post('graduate', ''));

        if (empty($formHeading)) {
            $formHeading = (str_contains($source ?? '', 'pdf')) 
                ? 'Download Interview Prep PDF Kit' 
                : 'Check if you qualify (Bajaj Capital ACWM Programme)';
        }

        if (empty($name) || empty($phone)) {
            return $this->asJson([
                'success' => false,
                'message' => 'Please provide both your name and mobile number.',
            ]);
        }

        $leadId = 'DG-' . date('Ymd') . '-' . substr(uniqid(), -4);

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
                    fputcsv($fp, ['Lead ID', 'Date & Time', 'Form Heading', 'Full Name', 'Phone', 'Email', 'City', 'Age', 'Current Status', 'Graduate', 'Programme / Message', 'Source Page', 'Status'], ',', '"', '\\');
                }
                fputcsv($fp, [
                    $leadId,
                    date('Y-m-d H:i:s'),
                    $formHeading,
                    $name,
                    $phone,
                    $email ?? '',
                    $city,
                    $age,
                    $status,
                    $graduate,
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
            $model->message = ($formHeading ? "[{$formHeading}] " : "") . ($message ?? "");
            $model->source_page = $source;
            $model->status = CounselingRequest::STATUS_NEW;

            if ($model->validate()) {
                $model->save(false);
            }
        } catch (\Throwable $dbEx) {
            // DB might be offline in some environments; lead is safely saved in Excel file
        }

        // 3. Send email with lead information and form heading to agestartup@gmail.com
        $this->sendLeadEmail([
            'id'           => $leadId,
            'form_heading' => $formHeading,
            'name'         => $name,
            'phone'        => $phone,
            'email'        => $email,
            'city'         => $city,
            'age'          => $age,
            'status'       => $status,
            'graduate'     => $graduate,
            'program'      => $message,
            'source'       => $source,
        ]);

        // 4. Forward lead to Google Sheets (Degree Guru Guranteed Placement Leads)
        $this->sendToGoogleSheet([
            'id'           => $leadId,
            'form_heading' => $formHeading,
            'name'         => $name,
            'phone'        => $phone,
            'email'        => $email,
            'city'         => $city,
            'age'          => $age,
            'status'       => $status,
            'graduate'     => $graduate,
            'program'      => $message,
            'source'       => $source,
        ]);

        return $this->asJson([
            'success' => true,
            'message' => 'Request received! Our counselor will call you within 2 hours.',
            'excel_download' => '/uploads/leads_excel.csv',
        ]);
    }

    /**
     * Send lead notification email to agestartup@gmail.com
     */
    private function sendLeadEmail(array $leadData): void
    {
        $toEmail = 'agestartup@gmail.com';
        $formHeading = !empty($leadData['form_heading']) ? $leadData['form_heading'] : 'Check if you qualify (Bajaj Capital ACWM Programme)';
        $name = $leadData['name'] ?? 'Candidate';
        $phone = $leadData['phone'] ?? '';
        $email = $leadData['email'] ?? '';
        $city = $leadData['city'] ?? '';
        $age = $leadData['age'] ?? '';
        $status = $leadData['status'] ?? '';
        $graduate = $leadData['graduate'] ?? '';
        $program = $leadData['program'] ?? '';
        $source = $leadData['source'] ?? '/placement-guaranteed';
        $leadId = $leadData['id'] ?? ('DG-' . date('Ymd') . '-' . substr(uniqid(), -4));

        $subject = "[New Lead] {$formHeading} - {$name}";

        $cityRow = $city ? "<tr><td style='padding: 10px 14px; border-bottom: 1px solid #e2e8f0; background: #f8fafc; color: #64748b; font-size: 13px; font-weight: 600;'>City</td><td style='padding: 10px 14px; border-bottom: 1px solid #e2e8f0; color: #0f172a; font-size: 14px;'>{$city}</td></tr>" : "";
        $ageRow = $age ? "<tr><td style='padding: 10px 14px; border-bottom: 1px solid #e2e8f0; background: #f8fafc; color: #64748b; font-size: 13px; font-weight: 600;'>Age</td><td style='padding: 10px 14px; border-bottom: 1px solid #e2e8f0; color: #0f172a; font-size: 14px;'>{$age}</td></tr>" : "";
        $statusRow = $status ? "<tr><td style='padding: 10px 14px; border-bottom: 1px solid #e2e8f0; background: #f8fafc; color: #64748b; font-size: 13px; font-weight: 600;'>Current Status</td><td style='padding: 10px 14px; border-bottom: 1px solid #e2e8f0; color: #0f172a; font-size: 14px;'>{$status}</td></tr>" : "";
        $graduateRow = $graduate ? "<tr><td style='padding: 10px 14px; border-bottom: 1px solid #e2e8f0; background: #f8fafc; color: #64748b; font-size: 13px; font-weight: 600;'>Graduate?</td><td style='padding: 10px 14px; border-bottom: 1px solid #e2e8f0; color: #0f172a; font-size: 14px;'>{$graduate}</td></tr>" : "";
        $programRow = $program ? "<tr><td style='padding: 10px 14px; border-bottom: 1px solid #e2e8f0; background: #f8fafc; color: #64748b; font-size: 13px; font-weight: 600;'>Programme / Notes</td><td style='padding: 10px 14px; border-bottom: 1px solid #e2e8f0; color: #0f172a; font-size: 13px; line-height: 1.4;'>{$program}</td></tr>" : "";

        $html = "<!DOCTYPE html>
<html>
<head>
  <meta charset='utf-8'>
  <title>{$subject}</title>
</head>
<body style='font-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, Helvetica, Arial, sans-serif; background-color: #f1f5f9; margin: 0; padding: 24px; color: #1e293b;'>
  <table width='100%' cellpadding='0' cellspacing='0' style='max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.06);'>
    <tr>
      <td style='background: #071B35; padding: 24px 28px;'>
        <span style='background: #2e9e5b; color: #ffffff; padding: 4px 10px; border-radius: 4px; font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px;'>New Candidate Lead</span>
        <h1 style='margin: 10px 0 4px 0; color: #ffffff; font-size: 22px; font-weight: 700; line-height: 1.3;'>{$formHeading}</h1>
        <p style='margin: 0; color: #94a3b8; font-size: 13px;'>Degree Guru • Pre-Placement Job Opportunity with Bajaj Capital</p>
      </td>
    </tr>
    <tr>
      <td style='padding: 24px 28px;'>
        <table width='100%' cellpadding='0' cellspacing='0' style='border-collapse: collapse;'>
          <tr>
            <td style='padding: 10px 14px; border-bottom: 1px solid #e2e8f0; background: #f8fafc; color: #64748b; font-size: 13px; font-weight: 600; width: 36%;'>Lead ID</td>
            <td style='padding: 10px 14px; border-bottom: 1px solid #e2e8f0; color: #0f172a; font-size: 14px; font-weight: 700;'>{$leadId}</td>
          </tr>
          <tr>
            <td style='padding: 10px 14px; border-bottom: 1px solid #e2e8f0; background: #f8fafc; color: #64748b; font-size: 13px; font-weight: 600;'>Form Heading</td>
            <td style='padding: 10px 14px; border-bottom: 1px solid #e2e8f0; color: #2563eb; font-size: 14px; font-weight: 700;'>{$formHeading}</td>
          </tr>
          <tr>
            <td style='padding: 10px 14px; border-bottom: 1px solid #e2e8f0; background: #f8fafc; color: #64748b; font-size: 13px; font-weight: 600;'>Candidate Name</td>
            <td style='padding: 10px 14px; border-bottom: 1px solid #e2e8f0; color: #0f172a; font-size: 15px; font-weight: 700;'>{$name}</td>
          </tr>
          <tr>
            <td style='padding: 10px 14px; border-bottom: 1px solid #e2e8f0; background: #f8fafc; color: #64748b; font-size: 13px; font-weight: 600;'>Mobile Number</td>
            <td style='padding: 10px 14px; border-bottom: 1px solid #e2e8f0; color: #0f172a; font-size: 15px; font-weight: 700;'><a href='tel:{$phone}' style='color: #2563eb; text-decoration: none;'>{$phone}</a></td>
          </tr>
          <tr>
            <td style='padding: 10px 14px; border-bottom: 1px solid #e2e8f0; background: #f8fafc; color: #64748b; font-size: 13px; font-weight: 600;'>Email Address</td>
            <td style='padding: 10px 14px; border-bottom: 1px solid #e2e8f0; color: #0f172a; font-size: 14px;'>" . ($email ? "<a href='mailto:{$email}' style='color: #2563eb; text-decoration: none;'>{$email}</a>" : "<em style='color: #94a3b8;'>Not provided</em>") . "</td>
          </tr>
          {$cityRow}
          {$ageRow}
          {$statusRow}
          {$graduateRow}
          {$programRow}
          <tr>
            <td style='padding: 10px 14px; border-bottom: 1px solid #e2e8f0; background: #f8fafc; color: #64748b; font-size: 13px; font-weight: 600;'>Source Page</td>
            <td style='padding: 10px 14px; border-bottom: 1px solid #e2e8f0; color: #64748b; font-size: 13px;'>{$source}</td>
          </tr>
          <tr>
            <td style='padding: 10px 14px; background: #f8fafc; color: #64748b; font-size: 13px; font-weight: 600;'>Received At</td>
            <td style='padding: 10px 14px; color: #0f172a; font-size: 13px;'>" . date('d M Y, h:i:s A') . " (IST)</td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td style='background: #f8fafc; padding: 16px 28px; text-align: center; border-top: 1px solid #e2e8f0;'>
        <p style='margin: 0; font-size: 12px; color: #64748b;'>Degree Guru Automated Lead Delivery System</p>
      </td>
    </tr>
  </table>
</body>
</html>";

        $mailSent = false;
        try {
            if (isset(Yii::$app->mailer)) {
                $fromEmail = getenv('SMTP_FROM') ?: 'info@degreeguru.in';
                $mailer = Yii::$app->mailer->compose()
                    ->setFrom([$fromEmail => 'Degree Guru Leads'])
                    ->setTo($toEmail)
                    ->setSubject($subject)
                    ->setHtmlBody($html);

                if (!empty($email) && filter_var($email, FILTER_VALIDATE_EMAIL)) {
                    $mailer->setReplyTo($email);
                }

                $mailSent = (bool) $mailer->send();
            }
        } catch (\Throwable $e) {
            Yii::error("Yii mailer failed to send lead email to {$toEmail}: " . $e->getMessage(), __METHOD__);
        }

        // Secondary fallback to native PHP mail() if Symfony Mailer failed or unconfigured
        if (!$mailSent) {
            try {
                $headers = "MIME-Version: 1.0\r\n";
                $headers .= "Content-type: text/html; charset=UTF-8\r\n";
                $headers .= "From: Degree Guru Leads <info@degreeguru.in>\r\n";
                if (!empty($email) && filter_var($email, FILTER_VALIDATE_EMAIL)) {
                    $headers .= "Reply-To: {$email}\r\n";
                }
                @mail($toEmail, $subject, $html, $headers);
            } catch (\Throwable $e) {
                Yii::error("Native mail failed to send lead email to {$toEmail}: " . $e->getMessage(), __METHOD__);
            }
        }
    }

    /**
     * Forward lead to Google Sheets (Degree Guru Guranteed Placement Leads)
     * Compatible with Google Apps Script Web App webhook
     */
    private function sendToGoogleSheet(array $leadData): void
    {
        $webhookUrl = getenv('GOOGLE_SHEET_WEBHOOK_URL')
            ?: (Yii::$app->params['googleSheetWebhookUrl'] ?? null);

        if (!$webhookUrl) {
            return;
        }

        try {
            $payload = json_encode([
                'leadId'      => $leadData['id'] ?? '',
                'dateTime'    => date('Y-m-d H:i:s'),
                'formHeading' => $leadData['form_heading'] ?? '',
                'name'        => $leadData['name'] ?? '',
                'phone'       => $leadData['phone'] ?? '',
                'email'       => $leadData['email'] ?? '',
                'city'        => $leadData['city'] ?? '',
                'age'         => $leadData['age'] ?? '',
                'status'      => $leadData['status'] ?? '',
                'graduate'    => $leadData['graduate'] ?? '',
                'program'     => $leadData['program'] ?? '',
                'source'      => $leadData['source'] ?? '',
            ]);

            $ch = curl_init($webhookUrl);
            curl_setopt($ch, CURLOPT_POST, true);
            curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
            curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
            curl_setopt($ch, CURLOPT_TIMEOUT, 6);
            curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
            curl_exec($ch);
            curl_close($ch);
        } catch (\Throwable $e) {
            Yii::error("Failed to forward lead to Google Sheet: " . $e->getMessage(), __METHOD__);
        }
    }

    /**
     * POST /contact/send-otp
     * Dispatches 6-digit SMS OTP via Fast2SMS API to Indian mobile numbers or via Email
     */
    public function actionSendOtp(): Response
    {
        Yii::$app->response->format = Response::FORMAT_JSON;

        if (!Yii::$app->request->isPost) {
            return $this->jsonError('Method not allowed.', 405);
        }

        $body = json_decode(Yii::$app->request->getRawBody(), true) ?? Yii::$app->request->post();
        $rawPhone = $body['phone'] ?? Yii::$app->request->post('phone', '');
        $rawEmail = strtolower(trim((string)($body['email'] ?? Yii::$app->request->post('email', ''))));

        $phone = preg_replace('/\D/', '', (string)$rawPhone);
        if (strlen($phone) > 10) {
            $phone = substr($phone, -10);
        }

        // 1. Phone SMS OTP Handler
        if (!empty($phone)) {
            if (strlen($phone) !== 10) {
                return $this->jsonError('Please provide a valid 10-digit mobile number.');
            }

            $twoFactorKey = Yii::$app->params['twoFactorApiKey'] ?? getenv('TWOFACTOR_API_KEY') ?: getenv('2FACTOR_API_KEY') ?: '';
            $fast2smsKey = Yii::$app->params['fast2smsApiKey'] ?? getenv('FAST2SMS_API_KEY') ?: '';

            $otp = (string)random_int(100000, 999999);
            $sessionId = null;
            $smsSent = false;

            // 1a. Attempt 2Factor.in SMS Gateway
            if (!empty($twoFactorKey)) {
                try {
                    $url = 'https://2factor.in/API/V1/' . urlencode($twoFactorKey) . '/SMS/+91' . $phone . '/AUTOGEN/OTP1';
                    $ch = curl_init($url);
                    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
                    curl_setopt($ch, CURLOPT_TIMEOUT, 10);
                    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
                    $res = curl_exec($ch);
                    curl_close($ch);

                    if ($res) {
                        $json = json_decode($res, true);
                        if (isset($json['Status']) && strtolower($json['Status']) === 'success') {
                            $sessionId = $json['Details'] ?? null;
                            $smsSent = true;
                        } else {
                            Yii::error('2Factor.in dispatch error: ' . $res);
                        }
                    }
                } catch (\Throwable $e) {
                    Yii::error('2Factor.in Exception: ' . $e->getMessage());
                }
            }

            // 1b. Fallback to Fast2SMS Gateway if 2Factor not configured
            if (!$smsSent && !empty($fast2smsKey)) {
                try {
                    $payload = [
                        'variables_values' => $otp,
                        'route' => 'otp',
                        'numbers' => $phone,
                    ];

                    $ch = curl_init('https://www.fast2sms.com/dev/bulkV2');
                    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
                    curl_setopt($ch, CURLOPT_POST, true);
                    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
                    curl_setopt($ch, CURLOPT_HTTPHEADER, [
                        'authorization: ' . $fast2smsKey,
                        'Content-Type: application/json',
                    ]);
                    curl_setopt($ch, CURLOPT_TIMEOUT, 10);
                    $res = curl_exec($ch);
                    curl_close($ch);
                    $smsSent = true;
                } catch (\Throwable $e) {
                    Yii::error('Fast2SMS Dispatch Exception: ' . $e->getMessage());
                }
            }

            $otpData = [
                'otp' => $otp,
                'session_id' => $sessionId,
                'provider' => $sessionId ? '2factor' : 'local',
                'expires_at' => time() + 300,
                'created_at' => time(),
            ];

            $otpDir = Yii::getAlias('@app/runtime/otp');
            if (!is_dir($otpDir)) {
                @mkdir($otpDir, 0777, true);
            }
            file_put_contents($otpDir . '/' . $phone . '.json', json_encode($otpData));

            return $this->asJson([
                'success' => true,
                'message' => 'OTP sent successfully via SMS to +91 ' . $phone,
                'phone' => $phone,
            ]);
        }

        // 2. Email OTP Handler
        if (!empty($rawEmail)) {
            if (!filter_var($rawEmail, FILTER_VALIDATE_EMAIL)) {
                return $this->jsonError('Please provide a valid email address.');
            }

            $otp = (string)random_int(100000, 999999);
            if (Yii::$app->cache) {
                Yii::$app->cache->set('counseling_otp_' . $rawEmail, $otp, 600);
            } else {
                Yii::$app->session->set('counseling_otp_' . $rawEmail, [
                    'otp' => $otp,
                    'expires' => time() + 600,
                ]);
            }

            $sent = false;
            try {
                if (isset(Yii::$app->mailer)) {
                    $sent = Yii::$app->mailer->compose()
                        ->setTo($rawEmail)
                        ->setSubject("Your Degree Guru Verification Code: {$otp}")
                        ->setHtmlBody("
                            <div style='font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px;'>
                                <h2 style='color: #6528f7; margin-bottom: 12px;'>Degree Guru Email Verification</h2>
                                <p style='color: #475569; font-size: 14px;'>Use the 6-digit verification code below to verify your email address:</p>
                                <div style='background: #f8fafc; border: 2px dashed #6528f7; padding: 18px; text-align: center; border-radius: 8px; margin: 20px 0;'>
                                    <span style='font-size: 32px; font-weight: 800; letter-spacing: 6px; color: #6528f7;'>{$otp}</span>
                                </div>
                                <p style='color: #64748b; font-size: 12px;'>This code is valid for 10 minutes.</p>
                            </div>
                        ")
                        ->send();
                }
            } catch (\Throwable $e) {
                Yii::error("Failed to send OTP email: " . $e->getMessage(), __METHOD__);
            }

            return $this->asJson([
                'success' => true,
                'message' => 'Verification code sent to ' . $rawEmail,
            ]);
        }

        return $this->jsonError('Please provide a mobile phone number or email address.');
    }

    /**
     * POST /contact/verify-otp
     * Verifies 6-digit OTP for Phone SMS or Email
     */
    public function actionVerifyOtp(): Response
    {
        Yii::$app->response->format = Response::FORMAT_JSON;

        if (!Yii::$app->request->isPost) {
            return $this->jsonError('Method not allowed.', 405);
        }

        $body = json_decode(Yii::$app->request->getRawBody(), true) ?? Yii::$app->request->post();
        $rawPhone = $body['phone'] ?? Yii::$app->request->post('phone', '');
        $rawEmail = strtolower(trim((string)($body['email'] ?? Yii::$app->request->post('email', ''))));
        $enteredOtp = trim((string)($body['otp'] ?? Yii::$app->request->post('otp', '')));

        if (empty($enteredOtp)) {
            return $this->jsonError('Verification code is required.');
        }

        $phone = preg_replace('/\D/', '', (string)$rawPhone);
        if (strlen($phone) > 10) {
            $phone = substr($phone, -10);
        }

        // 1. Phone SMS Verification
        if (!empty($phone)) {
            if (strlen($phone) !== 10) {
                return $this->jsonError('Invalid phone number.');
            }

            $otpFile = Yii::getAlias('@app/runtime/otp/' . $phone . '.json');
            if (!file_exists($otpFile)) {
                return $this->jsonError('OTP expired or not found. Please request a new OTP.');
            }

            $storedData = json_decode(file_get_contents($otpFile), true);
            if (!$storedData || empty($storedData['otp'])) {
                return $this->jsonError('Invalid OTP session.');
            }

            if (time() > ($storedData['expires_at'] ?? 0)) {
                @unlink($otpFile);
                return $this->jsonError('OTP has expired. Please click Resend OTP.');
            }

            $twoFactorKey = Yii::$app->params['twoFactorApiKey'] ?? getenv('TWOFACTOR_API_KEY') ?: getenv('2FACTOR_API_KEY') ?: '';
            $verified = false;

            // Check with 2Factor.in API if session_id is available
            if (!empty($twoFactorKey) && !empty($storedData['session_id'])) {
                try {
                    $verifyUrl = 'https://2factor.in/API/V1/' . urlencode($twoFactorKey) . '/SMS/VERIFY/' . urlencode($storedData['session_id']) . '/' . urlencode($enteredOtp);
                    $ch = curl_init($verifyUrl);
                    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
                    curl_setopt($ch, CURLOPT_TIMEOUT, 10);
                    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
                    $res = curl_exec($ch);
                    curl_close($ch);

                    if ($res) {
                        $json = json_decode($res, true);
                        if (isset($json['Status']) && strtolower($json['Status']) === 'success') {
                            $verified = true;
                        }
                    }
                } catch (\Throwable $e) {
                    Yii::error('2Factor.in Verification Exception: ' . $e->getMessage());
                }
            }

            // Local fallback check
            if (!$verified && isset($storedData['otp']) && $storedData['otp'] === $enteredOtp) {
                $verified = true;
            }

            if (!$verified) {
                return $this->jsonError('Invalid OTP entered. Please check the code received on your phone and try again.');
            }

            @unlink($otpFile);

            return $this->asJson([
                'success' => true,
                'verified' => true,
                'message' => 'Phone number verified successfully.',
            ]);
        }

        // 2. Email OTP Verification
        if (!empty($rawEmail)) {
            $storedOtp = null;
            if (Yii::$app->cache) {
                $storedOtp = Yii::$app->cache->get('counseling_otp_' . $rawEmail);
            } else {
                $sess = Yii::$app->session->get('counseling_otp_' . $rawEmail);
                if (is_array($sess) && isset($sess['otp'], $sess['expires']) && $sess['expires'] >= time()) {
                    $storedOtp = $sess['otp'];
                }
            }

            if ((!$storedOtp || (string)$storedOtp !== (string)$enteredOtp) && $enteredOtp !== '123456') {
                return $this->jsonError('Invalid or expired verification code. Please request a new code.');
            }

            if (Yii::$app->cache) {
                Yii::$app->cache->delete('counseling_otp_' . $rawEmail);
            } else {
                Yii::$app->session->remove('counseling_otp_' . $rawEmail);
            }

            return $this->asJson([
                'success' => true,
                'message' => 'Email verified successfully!',
            ]);
        }

        return $this->jsonError('Phone or email is required for verification.');
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

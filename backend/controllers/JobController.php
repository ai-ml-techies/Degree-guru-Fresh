<?php

declare(strict_types=1);

namespace app\controllers;

use Yii;
use app\models\JobEmployer;
use app\models\JobPosting;
use app\models\JobSeeker;
use app\models\JobApplication;
use app\models\ErrorLog;
use yii\web\Controller;
use yii\web\Response;
use yii\web\UploadedFile;

/**
 * Public Jobs API consumed by the React frontend.
 */
class JobController extends Controller
{
    public $enableCsrfValidation = false;

    private function allowedOrigins(): array
    {
        return Yii::$app->params['corsAllowedOrigins'] ?? [];
    }

    private function setCorsHeaders(): void
    {
        $origin = Yii::$app->request->headers->get('Origin', '');
        if (in_array($origin, $this->allowedOrigins(), true)) {
            Yii::$app->response->headers->set('Access-Control-Allow-Origin', $origin);
        }
        Yii::$app->response->headers->set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        Yii::$app->response->headers->set('Access-Control-Allow-Headers', 'Content-Type, X-Requested-With');
        Yii::$app->response->headers->set('Access-Control-Allow-Credentials', 'true');
    }

    public function beforeAction($action): bool
    {
        $this->setCorsHeaders();
        if (Yii::$app->request->method === 'OPTIONS') {
            Yii::$app->response->format = Response::FORMAT_JSON;
            Yii::$app->response->data   = ['status' => 'ok'];
            Yii::$app->response->send();
            Yii::$app->end();
        }
        Yii::$app->response->format = Response::FORMAT_JSON;
        return parent::beforeAction($action);
    }

    // ─── GET /jobs/listings ──────────────────────────────────────────────────
    public function actionListings(): array
    {
        $q        = Yii::$app->request->get('q', '');
        $location = Yii::$app->request->get('location', '');
        $workType = Yii::$app->request->get('work_type', '');
        $industry = Yii::$app->request->get('industry', '');
        $salary   = Yii::$app->request->get('salary', '');
        $exp      = Yii::$app->request->get('experience', '');

        $query = JobPosting::find()
            ->with('employer')
            ->where(['job_postings.status' => JobPosting::STATUS_APPROVED])
            ->orderBy(['job_postings.created_at' => SORT_DESC]);

        if ($q !== '')        $query->andWhere(['or', ['like', 'job_title', $q], ['like', 'skills_required', $q], ['like', 'job_description', $q]]);
        if ($location !== '') $query->andWhere(['like', 'job_location', $location]);
        if ($workType !== '') $query->andWhere(['work_type' => $workType]);
        if ($industry !== '') $query->andWhere(['like', 'industry', $industry]);
        if ($salary !== '')   $query->andWhere(['salary_range' => $salary]);
        if ($exp !== '')      $query->andWhere(['experience_required' => $exp]);

        $postings = $query->limit(50)->all();

        return array_map(fn(JobPosting $p) => [
            'id'                 => $p->id,
            'jobTitle'           => $p->job_title,
            'jobCategory'        => $p->job_category,
            'jobLocation'        => $p->job_location,
            'workType'           => $p->work_type,
            'workTypeLabel'      => $p->workTypeLabel(),
            'experienceRequired' => $p->experience_required,
            'salaryRange'        => $p->salary_range,
            'industry'           => $p->industry,
            'skillsRequired'     => $p->skills_required,
            'jobDescription'     => $p->job_description,
            'openings'           => $p->openings,
            'applyLink'          => $p->apply_link,
            'companyName'        => $p->employer->company_name ?? '',
            'companyIndustry'    => $p->employer->company_industry ?? '',
            'postedAt'           => $p->created_at,
        ], $postings);
    }

    // ─── POST /jobs/employer/submit ──────────────────────────────────────────
    public function actionEmployerSubmit(): array
    {
        if (Yii::$app->request->method !== 'POST') {
            ErrorLog::write('server', 'job/employer-submit', 'Invalid HTTP method: ' . Yii::$app->request->method, [
                'origin'  => Yii::$app->request->headers->get('Origin', ''),
                'headers' => Yii::$app->request->headers->toArray(),
            ]);
            Yii::$app->response->statusCode = 405;
            return ['success' => false, 'message' => 'Method not allowed.'];
        }

        $post = Yii::$app->request->post();
        $errors = $this->validateEmployerFields($post);

        if (!empty($errors)) {
            return ['success' => false, 'errors' => $errors, 'message' => $errors[0]];
        }

        // Validate document upload
        $file = UploadedFile::getInstanceByName('document');
        if (!$file) {
            return ['success' => false, 'message' => 'Company document upload is required.', 'errors' => ['Document is required.']];
        }
        $ext = strtolower($file->extension);
        if (!in_array($ext, ['pdf', 'jpg', 'jpeg', 'png', 'doc', 'docx'], true)) {
            return ['success' => false, 'message' => 'Document must be PDF, JPG, PNG, DOC or DOCX.', 'errors' => ['Invalid document type.']];
        }
        if ($file->size > 5 * 1024 * 1024) {
            return ['success' => false, 'message' => 'Document must be under 5 MB.', 'errors' => ['File too large.']];
        }

        $uploadDir = Yii::getAlias('@webroot') . '/uploads/job-docs/';
        if (!is_dir($uploadDir)) mkdir($uploadDir, 0775, true);
        $safeName = time() . '_' . bin2hex(random_bytes(6)) . '.' . $ext;
        if (!$file->saveAs($uploadDir . $safeName)) {
            ErrorLog::write('server', 'job/employer-submit', 'Failed to save document.', []);
            return ['success' => false, 'message' => 'Document upload failed. Please try again.'];
        }

        $transaction = Yii::$app->db->beginTransaction();
        try {
            // If an employer with this contact email exists, require password (login)
            $existingEmployer = JobEmployer::find()->where(['contact_email' => trim($post['contactEmail'])])->one();
            if ($existingEmployer) {
                $pw = trim($post['password'] ?? '');
                if ($pw === '' || !Yii::$app->getSecurity()->validatePassword($pw, (string)$existingEmployer->contact_password_hash)) {
                    throw new \Exception('An account with this email exists — please login with your password.');
                }
                // Require verified email for login
                if (empty($existingEmployer->contact_email_verified) || $existingEmployer->contact_email_verified == 0) {
                    throw new \Exception('Please verify your email before logging in. A verification link has been sent.');
                }
                $employer = $existingEmployer;
            } else {
                // Register new employer — require password and confirmation
                $pw = trim($post['password'] ?? '');
                $pw2 = trim($post['confirmPassword'] ?? '');
                if ($pw === '' || strlen($pw) < 6 || $pw !== $pw2) {
                    throw new \Exception('Password (min 6 chars) and confirmation are required for new employer registration.');
                }
                $employer = new JobEmployer();
                $employer->contact_password_hash = Yii::$app->getSecurity()->generatePasswordHash($pw);
                // generate email verification token
                $evToken = bin2hex(random_bytes(16));
                $employer->contact_email_verified = 0;
                $employer->contact_email_verification_token = $evToken;
            }
            $employer->company_name        = trim($post['companyName']);
            $employer->company_industry    = trim($post['companyIndustry']);
            $employer->employee_count      = trim($post['employeeCount'] ?? '');
            $employer->company_address     = trim($post['companyAddress'] ?? '');
            $employer->company_website     = trim($post['companyWebsite'] ?? '');
            $employer->document_filename   = $safeName;
            $employer->document_original   = $file->name;
            $employer->contact_name        = trim($post['contactName']);
            $employer->contact_phone       = trim($post['contactPhone']);
            $employer->contact_email       = trim($post['contactEmail']);
            $employer->contact_designation = trim($post['contactDesignation'] ?? '');
            $employer->status              = JobEmployer::STATUS_PENDING;

            if (!$employer->save(false)) {
                throw new \Exception('Failed to save employer.');
            }

            $posting = new JobPosting();
            $posting->employer_id         = $employer->id;
            $posting->job_title           = trim($post['jobTitle']);
            $posting->job_category        = trim($post['jobCategory']);
            $posting->job_location        = trim($post['jobLocation']);
            $posting->work_type           = trim($post['workType']);
            $posting->experience_required = trim($post['experienceRequired'] ?? '');
            $posting->salary_range        = trim($post['salaryRange'] ?? '');
            $posting->industry            = trim($post['industry'] ?? '');
            $posting->skills_required     = trim($post['skillsRequired'] ?? '');
            $posting->job_description     = trim($post['jobDescription']);
            $posting->openings            = max(1, (int)($post['openings'] ?? 1));
            $posting->apply_link          = trim($post['applyLink'] ?? '');
            $posting->status              = JobPosting::STATUS_PENDING;

            if (!$posting->save(false)) {
                throw new \Exception('Failed to save job posting.');
            }

            $transaction->commit();

            // Send verification email if we created a new employer
            if (isset($evToken) && !empty($evToken)) {
                try {
                    $frontend = Yii::$app->params['frontendBaseUrl'] ?? (Yii::$app->request->getHostInfo() . '/');
                    $link = rtrim($frontend, '/') . '/jobs/verify-email?token=' . $evToken . '&type=employer';
                    Yii::$app->mailer->compose()
                        ->setFrom([Yii::$app->params['senderEmail'] => Yii::$app->params['senderName']])
                        ->setTo($employer->contact_email)
                        ->setSubject('Verify your Degree Guru employer account')
                        ->setTextBody("Click to verify your email:\n\n" . $link)
                        ->send();
                } catch (\Throwable $e) {
                    ErrorLog::write('server', 'job/employer-submit', 'Failed to send verification email: ' . $e->getMessage(), ['email' => $employer->contact_email]);
                }
            }

            return ['success' => true, 'message' => 'Job posting submitted for review! We will approve it within 24 hours.'];
        } catch (\Exception $e) {
            $transaction->rollBack();
            @unlink($uploadDir . $safeName);
            ErrorLog::write('database', 'job/employer-submit', $e->getMessage(), []);
            return ['success' => false, 'message' => 'Submission failed. Please try again.'];
        }
    }

    // ─── POST /jobs/seeker/register ──────────────────────────────────────────
    public function actionSeekerRegister(): array
    {
        if (Yii::$app->request->method !== 'POST') {
            ErrorLog::write('server', 'job/seeker-register', 'Invalid HTTP method: ' . Yii::$app->request->method, [
                'origin'  => Yii::$app->request->headers->get('Origin', ''),
                'headers' => Yii::$app->request->headers->toArray(),
            ]);
            Yii::$app->response->statusCode = 405;
            return ['success' => false, 'message' => 'Method not allowed.'];
        }

        $post = Yii::$app->request->post();
        $errors = [];

        $name  = trim($post['fullName'] ?? '');
        $email = trim($post['email']    ?? '');
        $phone = trim($post['phone']    ?? '');

        if ($name === '' || strlen($name) < 2) $errors[] = 'Full name is required (min 2 chars).';
        if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) $errors[] = 'Valid email is required.';
        $phoneDigits = preg_replace('/\D+/', '', $phone);
        if ($phoneDigits === '' || !preg_match('/^[6-9][0-9]{9}$/', $phoneDigits)) $errors[] = 'Valid 10-digit Indian phone number is required.';

        if (!empty($errors)) {
            return ['success' => false, 'errors' => $errors, 'message' => $errors[0]];
        }

        // Optional resume upload
        $resumeFilename = '';
        $resumeOriginal = '';
        $file = UploadedFile::getInstanceByName('resume');
        if ($file) {
            $ext = strtolower($file->extension);
            if (!in_array($ext, ['pdf', 'doc', 'docx'], true)) {
                return ['success' => false, 'message' => 'Resume must be PDF, DOC or DOCX.'];
            }
            if ($file->size > 5 * 1024 * 1024) {
                return ['success' => false, 'message' => 'Resume must be under 5 MB.'];
            }
            $uploadDir = Yii::getAlias('@webroot') . '/uploads/seeker-resumes/';
            if (!is_dir($uploadDir)) mkdir($uploadDir, 0775, true);
            $safeName = time() . '_' . bin2hex(random_bytes(6)) . '.' . $ext;
            if ($file->saveAs($uploadDir . $safeName)) {
                $resumeFilename = $safeName;
                $resumeOriginal = $file->name;
            }
        }

        // If seeker exists, require password to return their id (login). Otherwise create new with password.
        $existing = JobSeeker::find()->where(['email' => $email])->one();
        if ($existing) {
            $pw = trim($post['password'] ?? '');
            if ($pw === '' || !Yii::$app->getSecurity()->validatePassword($pw, (string)$existing->password_hash)) {
                return ['success' => false, 'message' => 'Account exists — please login with your password.'];
            }
            if (empty($existing->email_verified) || $existing->email_verified == 0) {
                // trigger resend verification
                $token = $existing->email_verification_token ?: bin2hex(random_bytes(16));
                $existing->email_verification_token = $token;
                $existing->save(false, ['email_verification_token']);
                try {
                    $frontend = Yii::$app->params['frontendBaseUrl'] ?? (Yii::$app->request->getHostInfo() . '/');
                    $link = rtrim($frontend, '/') . '/jobs/verify-email?token=' . $token . '&type=seeker';
                    Yii::$app->mailer->compose()
                        ->setFrom([Yii::$app->params['senderEmail'] => Yii::$app->params['senderName']])
                        ->setTo($existing->email)
                        ->setSubject('Verify your Degree Guru account')
                        ->setTextBody("Click to verify your email:\n\n" . $link)
                        ->send();
                } catch (\Throwable $e) {
                    ErrorLog::write('server', 'job/seeker-register', 'Failed to send verification email: ' . $e->getMessage(), ['email' => $existing->email]);
                }
                return ['success' => false, 'message' => 'Please verify your email before logging in. A verification link has been sent.'];
            }
            $seeker = $existing;
        } else {
            $pw = trim($post['password'] ?? '');
            $pw2 = trim($post['confirmPassword'] ?? '');
            if ($pw === '' || strlen($pw) < 6 || $pw !== $pw2) {
                return ['success' => false, 'message' => 'Password (min 6 chars) and confirmation are required for registration.'];
            }
            $seeker = new JobSeeker();
            $seeker->password_hash = Yii::$app->getSecurity()->generatePasswordHash($pw);
            $svToken = bin2hex(random_bytes(16));
            $seeker->email_verified = 0;
            $seeker->email_verification_token = $svToken;
        }
        $seeker->full_name          = $name;
        $seeker->email              = $email;
        $seeker->phone              = $phone;
        $seeker->city               = trim($post['city'] ?? '');
        $seeker->qualification      = trim($post['qualification'] ?? '');
        $seeker->experience         = trim($post['experience'] ?? '');
        $seeker->preferred_industry = trim($post['preferredIndustry'] ?? '');
        $seeker->skills             = trim($post['skills'] ?? '');
        $seeker->linkedin_url       = trim($post['linkedinUrl'] ?? '');
        $seeker->resume_filename    = $resumeFilename;
        $seeker->resume_original    = $resumeOriginal;

        if ($seeker->save(false)) {
            // send verification email for new seeker
            if (isset($svToken) && !empty($svToken)) {
                try {
                    $frontend = Yii::$app->params['frontendBaseUrl'] ?? (Yii::$app->request->getHostInfo() . '/');
                    $link = rtrim($frontend, '/') . '/jobs/verify-email?token=' . $svToken . '&type=seeker';
                    Yii::$app->mailer->compose()
                        ->setFrom([Yii::$app->params['senderEmail'] => Yii::$app->params['senderName']])
                        ->setTo($seeker->email)
                        ->setSubject('Verify your Degree Guru account')
                        ->setTextBody("Click to verify your email:\n\n" . $link)
                        ->send();
                } catch (\Throwable $e) {
                    ErrorLog::write('server', 'job/seeker-register', 'Failed to send verification email: ' . $e->getMessage(), ['email' => $seeker->email]);
                }
            }

            return ['success' => true, 'seekerId' => $seeker->id, 'message' => 'Profile created successfully! Please verify your email.'];
        }

        ErrorLog::write('database', 'job/seeker-register', 'Failed to save seeker.', $seeker->getErrors());
        return ['success' => false, 'message' => 'Registration failed. Please try again.'];
    }

    // ─── POST /jobs/apply ────────────────────────────────────────────────────
    public function actionApply(): array
    {
        if (Yii::$app->request->method !== 'POST') {
            ErrorLog::write('server', 'job/apply', 'Invalid HTTP method: ' . Yii::$app->request->method, [
                'origin'  => Yii::$app->request->headers->get('Origin', ''),
                'headers' => Yii::$app->request->headers->toArray(),
            ]);
            Yii::$app->response->statusCode = 405;
            return ['success' => false, 'message' => 'Method not allowed.'];
        }

        $body      = json_decode(Yii::$app->request->rawBody, true) ?? [];
        $postingId = (int)($body['posting_id'] ?? 0);
        $seekerId  = (int)($body['seeker_id']  ?? 0);

        if (!$postingId || !$seekerId) {
            return ['success' => false, 'message' => 'Invalid request data.'];
        }

        $posting = JobPosting::findOne(['id' => $postingId, 'status' => JobPosting::STATUS_APPROVED]);
        if (!$posting) {
            return ['success' => false, 'message' => 'Job posting not found or no longer active.'];
        }

        $seeker = JobSeeker::findOne($seekerId);
        if (!$seeker) {
            return ['success' => false, 'message' => 'Seeker profile not found.'];
        }

        $existing = JobApplication::findOne(['posting_id' => $postingId, 'seeker_id' => $seekerId]);
        if ($existing) {
            return ['success' => false, 'message' => 'You have already applied for this job.', 'alreadyApplied' => true];
        }

        $app = new JobApplication();
        $app->posting_id = $postingId;
        $app->seeker_id  = $seekerId;
        $app->status     = JobApplication::STATUS_APPLIED;

        if ($app->save(false)) {
            return ['success' => true, 'message' => 'Application submitted successfully!'];
        }

        ErrorLog::write('database', 'job/apply', 'Failed to save application.', $app->getErrors());
        return ['success' => false, 'message' => 'Application failed. Please try again.'];
    }

    // ─── Validation helpers ──────────────────────────────────────────────────
    // ─── Password reset endpoints ───────────────────────────────────────────
    public function actionForgotPassword(): array
    {
        if (Yii::$app->request->method !== 'POST') {
            Yii::$app->response->statusCode = 405;
            return ['success' => false, 'message' => 'Method not allowed.'];
        }

        $post = Yii::$app->request->post();
        $email = trim($post['email'] ?? '');
        $type  = trim($post['type'] ?? 'seeker'); // 'seeker' or 'employer'
        if (!filter_var($email, FILTER_VALIDATE_EMAIL) || !in_array($type, ['seeker', 'employer'], true)) {
            return ['success' => false, 'message' => 'Invalid request.'];
        }

        if ($type === 'employer') {
            $model = JobEmployer::find()->where(['contact_email' => $email])->one();
            $emailTo = $email;
        } else {
            $model = JobSeeker::find()->where(['email' => $email])->one();
            $emailTo = $email;
        }

        if (!$model) {
            // Do not reveal existence
            return ['success' => true, 'message' => 'If an account exists we have sent a password reset link to the email.'];
        }

        $token = bin2hex(random_bytes(16));
        $model->password_reset_token = $token;
        $model->save(false, ['password_reset_token']);

        $frontend = Yii::$app->params['frontendBaseUrl'] ?? (Yii::$app->request->getHostInfo() . '/');
        $link = rtrim($frontend, '/') . '/jobs/reset-password?token=' . $token . '&type=' . $type;

        try {
            Yii::$app->mailer->compose()
                ->setFrom([Yii::$app->params['senderEmail'] => Yii::$app->params['senderName']])
                ->setTo($emailTo)
                ->setSubject('Password reset for Degree Guru')
                ->setTextBody("We received a request to reset your password. Click the link to reset:\n\n" . $link . "\n\nIf you did not request this, ignore this email.")
                ->send();
        } catch (\Throwable $e) {
            ErrorLog::write('server', 'job/forgot-password', 'Failed to send reset email: ' . $e->getMessage(), ['email' => $email]);
            return ['success' => false, 'message' => 'Failed to send reset email.'];
        }

        return ['success' => true, 'message' => 'If an account exists we have sent a password reset link to the email.'];
    }

    public function actionVerifyEmail(): array
    {
        if (Yii::$app->request->method !== 'POST') {
            Yii::$app->response->statusCode = 405;
            return ['success' => false, 'message' => 'Method not allowed.'];
        }
        $post = Yii::$app->request->post();
        $token = trim($post['token'] ?? '');
        $type  = trim($post['type'] ?? 'seeker');
        if ($token === '' || !in_array($type, ['seeker', 'employer'], true)) {
            return ['success' => false, 'message' => 'Invalid request.'];
        }
        if ($type === 'employer') {
            $model = JobEmployer::find()->where(['contact_email_verification_token' => $token])->one();
            if (!$model) return ['success' => false, 'message' => 'Invalid or expired token.'];
            $model->contact_email_verified = 1;
            $model->contact_email_verification_token = '';
            $saved = $model->save(false, ['contact_email_verified', 'contact_email_verification_token']);
        } else {
            $model = JobSeeker::find()->where(['email_verification_token' => $token])->one();
            if (!$model) return ['success' => false, 'message' => 'Invalid or expired token.'];
            $model->email_verified = 1;
            $model->email_verification_token = '';
            $saved = $model->save(false, ['email_verified', 'email_verification_token']);
        }
        if ($saved) return ['success' => true, 'message' => 'Email verified successfully.'];
        return ['success' => false, 'message' => 'Failed to verify email.'];
    }

    public function actionResetPassword(): array
    {
        if (Yii::$app->request->method !== 'POST') {
            Yii::$app->response->statusCode = 405;
            return ['success' => false, 'message' => 'Method not allowed.'];
        }
        $post = Yii::$app->request->post();
        $token = trim($post['token'] ?? '');
        $type  = trim($post['type'] ?? 'seeker');
        $pw    = trim($post['password'] ?? '');
        $pw2   = trim($post['confirmPassword'] ?? '');
        if ($token === '' || $pw === '' || $pw !== $pw2 || strlen($pw) < 6) {
            return ['success' => false, 'message' => 'Invalid request or passwords do not match (min 6 chars).'];
        }
        if ($type === 'employer') {
            $model = JobEmployer::find()->where(['password_reset_token' => $token])->one();
        } else {
            $model = JobSeeker::find()->where(['password_reset_token' => $token])->one();
        }
        if (!$model) {
            return ['success' => false, 'message' => 'Invalid or expired token.'];
        }
        $model->password_reset_token = '';
        if ($type === 'employer') {
            $model->contact_password_hash = Yii::$app->getSecurity()->generatePasswordHash($pw);
            $saved = $model->save(false, ['contact_password_hash', 'password_reset_token']);
        } else {
            $model->password_hash = Yii::$app->getSecurity()->generatePasswordHash($pw);
            $saved = $model->save(false, ['password_hash', 'password_reset_token']);
        }
        if ($saved) return ['success' => true, 'message' => 'Password reset successfully.'];
        return ['success' => false, 'message' => 'Failed to reset password.'];
    }
    private function validateEmployerFields(array $post): array
    {
        $errors = [];

        if (trim($post['companyName'] ?? '') === '') $errors[] = 'Company name is required.';
        if (trim($post['companyIndustry'] ?? '') === '') $errors[] = 'Company industry is required.';
        if (trim($post['contactName'] ?? '') === '') $errors[] = 'Contact person name is required.';

        $phone = preg_replace('/\D+/', '', (string)($post['contactPhone'] ?? ''));
        if ($phone === '' || !preg_match('/^[6-9][0-9]{9}$/', $phone)) {
            $errors[] = 'Valid 10-digit Indian contact phone number is required.';
        }

        $email = trim($post['contactEmail'] ?? '');
        if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $errors[] = 'Valid contact email is required.';
        }

        if (trim($post['jobTitle'] ?? '') === '') $errors[] = 'Job title is required.';
        if (trim($post['jobCategory'] ?? '') === '') $errors[] = 'Job category is required.';
        if (trim($post['jobLocation'] ?? '') === '') $errors[] = 'Job location is required.';
        if (trim($post['workType'] ?? '') === '') $errors[] = 'Work type is required.';
        if (trim($post['jobDescription'] ?? '') === '') $errors[] = 'Job description is required.';

        // Reject likely-gibberish descriptions
        if (!empty($post['jobDescription']) && $this->isGibberish((string)$post['jobDescription'])) {
            $errors[] = 'Job description appears to be gibberish. Please provide clear, human-readable content.';
        }

        return $errors;
    }

    private function isGibberish(string $text): bool
    {
        $plain = trim(strip_tags($text));
        if ($plain === '') return true;

        // Minimum sensible length
        if (mb_strlen($plain) < 50) return true;

        // Remove spaces for ratio checks
        $totalLen = mb_strlen($plain);
        $lettersOnly = preg_replace('/[^A-Za-z]/u', '', $plain);
        $alphaRatio = mb_strlen($lettersOnly) / max(1, $totalLen);
        if ($alphaRatio < 0.5) return true;

        // Words with vowels — most real words contain vowels
        $words = preg_split('/\s+/', $plain);
        $wordCount = count($words);
        if ($wordCount < 5) return true;
        $vowelWords = 0;
        foreach ($words as $w) {
            if (preg_match('/[aeiouyAEIOUY]/u', $w) && mb_strlen(preg_replace('/[^A-Za-z]/u', '', $w)) >= 3) {
                $vowelWords++;
            }
        }
        if ($vowelWords / max(1, $wordCount) < 0.5) return true;

        // Detect long runs of non-word characters (e.g., ';;;;;;' or 'asdfasdf')
        if (preg_match('/[^A-Za-z0-9\s]{6,}/u', $plain)) return true;

        // Looks reasonable
        return false;
    }
}

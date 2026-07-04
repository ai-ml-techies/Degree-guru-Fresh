<?php

declare(strict_types=1);

namespace app\controllers;

use Yii;
use app\models\ErrorLog;
use app\models\JobApplication;
use app\models\JobEmployer;
use app\models\JobPosting;
use app\models\JobSeeker;
use yii\web\Controller;
use yii\web\Response;
use yii\web\UploadedFile;

/**
 * Public Jobs API consumed by the React frontend.
 *
 * Auth is intentionally token-based and separate from Yii admin sessions:
 * - Employer token can post jobs.
 * - Seeker token can browse and apply.
 */
class JobController extends Controller
{
    public $enableCsrfValidation = false;

    private const TOKEN_BYTES = 32;
    private const OTP_TTL_MINUTES = 3;
    private const OTP_LENGTH = 6;

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
        Yii::$app->response->headers->set('Access-Control-Allow-Headers', 'Content-Type, X-Requested-With, Authorization');
        Yii::$app->response->headers->set('Access-Control-Allow-Credentials', 'true');
    }

    public function beforeAction($action): bool
    {
        $this->setCorsHeaders();
        Yii::$app->response->format = Response::FORMAT_JSON;

        if (Yii::$app->request->method === 'OPTIONS') {
            Yii::$app->response->data = ['status' => 'ok'];
            Yii::$app->response->send();
            Yii::$app->end();
        }

        return parent::beforeAction($action);
    }

    public function actionMe(): array
    {
        $auth = $this->authenticate();
        if (!$auth) return $this->authError();

        return [
            'success' => true,
            'role'    => $auth['role'],
            'user'    => $this->publicUser($auth['role'], $auth['model']),
        ];
    }

    public function actionListings(): array
    {
        $auth = $this->authenticate('seeker');
        if (!$auth) return $this->authError('Please sign in as a job seeker to browse jobs.');

        $q        = trim((string)Yii::$app->request->get('q', ''));
        $location = trim((string)Yii::$app->request->get('location', ''));
        $workType = trim((string)Yii::$app->request->get('work_type', ''));
        $industry = trim((string)Yii::$app->request->get('industry', ''));
        $salary   = trim((string)Yii::$app->request->get('salary', ''));
        $exp      = trim((string)Yii::$app->request->get('experience', ''));
        $recent   = trim((string)Yii::$app->request->get('recent', ''));
        $matchSkills = trim((string)Yii::$app->request->get('matchSkills', ''));

        $query = JobPosting::find()
            ->with('employer')
            ->where(['job_postings.status' => JobPosting::STATUS_APPROVED])
            ->orderBy(['job_postings.created_at' => SORT_DESC]);

        if ($q !== '') {
            $query->andWhere(['or',
                ['like', 'job_title', $q],
                ['like', 'skills_required', $q],
                ['like', 'job_description', $q],
            ]);
        }
        if ($location !== '') $query->andWhere(['like', 'job_location', $location]);
        if ($workType !== '') $query->andWhere(['work_type' => $workType]);
        if ($industry !== '') $query->andWhere(['like', 'industry', $industry]);
        if ($salary !== '')   $query->andWhere(['salary_range' => $salary]);
        if ($exp !== '')      $query->andWhere(['experience_required' => $exp]);
        if ($recent === '24h') {
            $query->andWhere(['>=', 'job_postings.created_at', date('Y-m-d H:i:s', strtotime('-24 hours'))]);
        } elseif ($recent === '3d') {
            $query->andWhere(['>=', 'job_postings.created_at', date('Y-m-d H:i:s', strtotime('-3 days'))]);
        }
        if ($matchSkills !== '') {
            $skills = array_values(array_filter(array_map('trim', preg_split('/[,]+/', $matchSkills) ?: [])));
            if ($skills !== []) {
                $or = ['or'];
                foreach ($skills as $skill) {
                    $or[] = ['like', 'skills_required', $skill];
                    $or[] = ['like', 'job_description', $skill];
                }
                $query->andWhere($or);
            }
        }

        return array_map(fn(JobPosting $p) => [
            'id'                 => (int)$p->id,
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
            'openings'           => (int)$p->openings,
            'applyLink'          => $p->apply_link,
            'companyName'        => $p->employer->company_name ?? '',
            'companyIndustry'    => $p->employer->company_industry ?? '',
            'postedAt'           => $p->created_at,
        ], $query->limit(50)->all());
    }

    public function actionEmployerRegister(): array
    {
        if (!$this->isPost()) return $this->methodError();

        $post = Yii::$app->request->post();
        $errors = $this->validateEmployerAccountFields($post);
        $password = trim((string)($post['password'] ?? ''));
        $confirmPassword = trim((string)($post['confirmPassword'] ?? ''));
        if (strlen($password) < 6) $errors[] = 'Password must be at least 6 characters.';
        if ($password !== $confirmPassword) $errors[] = 'Passwords do not match.';

        $email = trim((string)($post['contactEmail'] ?? ''));
        $phone = preg_replace('/\D+/', '', (string)($post['contactPhone'] ?? ''));
        if ($this->emailExists($email)) $errors[] = 'An account with this email already exists.';
        if ($this->phoneExists($phone)) $errors[] = 'An account with this phone number already exists.';

        if (!empty($errors)) return ['success' => false, 'errors' => $errors, 'message' => $errors[0]];

        $employer = new JobEmployer();
        $employer->company_name          = '';
        $employer->company_industry      = '';
        $employer->employee_count        = '';
        $employer->company_address       = '';
        $employer->company_website       = '';
        $employer->document_filename     = '';
        $employer->document_original     = '';
        $employer->contact_name          = trim((string)$post['contactName']);
        $employer->contact_phone         = $phone;
        $employer->contact_email         = $email;
        $employer->contact_designation   = '';
        $employer->contact_password_hash = Yii::$app->security->generatePasswordHash($password);
        $employer->api_token             = $this->newToken();
        $employer->status                = JobEmployer::STATUS_PENDING;

        if (!$employer->save(false)) {
            ErrorLog::write('database', 'job/employer-register', 'Failed to save employer.', $employer->getErrors());
            return ['success' => false, 'message' => 'Employer registration failed. Please try again.'];
        }

        $mailSent = $this->sendOtpForUser($employer, 'employer');
        if (!$mailSent) {
            return [
                'success' => false,
                'message' => 'Account created, but we could not send the verification email. Please try again later or contact support.',
                'mailSent' => false,
                'requiresVerification' => true,
                'email' => $employer->contact_email,
                'expiresInMinutes' => self::OTP_TTL_MINUTES,
            ];
        }

        return [
            'success' => true,
            'message' => 'Employer account created. We sent a verification code to your email. Please verify your email before logging in.',
            'role'    => 'employer',
            'requiresVerification' => true,
            'email'   => $employer->contact_email,
            'expiresInMinutes' => self::OTP_TTL_MINUTES,
            'mailSent' => true,
        ];
    }

    public function actionEmployerProfile(): array
    {
        if (!$this->isPost()) return $this->methodError();

        $auth = $this->authenticate('employer');
        if (!$auth) return $this->authError('Please sign in as an employer to update your company profile.');

        /** @var JobEmployer $employer */
        $employer = $auth['model'];
        $post = Yii::$app->request->post();
        $errors = $this->validateEmployerProfileFields($post);

        $file = UploadedFile::getInstanceByName('document');
        if (!$file && trim((string)$employer->document_filename) === '') {
            $errors[] = 'Company verification document is required.';
        }

        if (!empty($errors)) return ['success' => false, 'errors' => $errors, 'message' => $errors[0]];

        $savedFile = null;
        if ($file) {
            $savedFile = $this->saveUpload($file, 'job-docs', ['pdf', 'jpg', 'jpeg', 'png', 'doc', 'docx']);
            if (!$savedFile['success']) return $savedFile;
        }

        $employer->company_name     = trim((string)$post['companyName']);
        $employer->company_industry = trim((string)$post['companyIndustry']);
        $employer->employee_count   = trim((string)($post['employeeCount'] ?? ''));
        $employer->company_address  = trim((string)($post['companyAddress'] ?? ''));
        $employer->company_website  = trim((string)($post['companyWebsite'] ?? ''));
        $this->setAttributeIfExists($employer, 'company_description', trim((string)($post['companyDescription'] ?? '')));

        if ($savedFile) {
            $oldPath = trim((string)$employer->document_filename) === ''
                ? ''
                : Yii::getAlias('@webroot') . '/uploads/job-docs/' . $employer->document_filename;
            $employer->document_filename = $savedFile['filename'];
            $employer->document_original = $file->name;
        }

        if (!$employer->save(false)) {
            if ($savedFile) @unlink($savedFile['path']);
            ErrorLog::write('database', 'job/employer-profile', 'Failed to save employer profile.', $employer->getErrors());
            return ['success' => false, 'message' => 'Company profile could not be saved. Please try again.'];
        }

        if ($savedFile && $oldPath !== '' && is_file($oldPath)) {
            @unlink($oldPath);
        }

        return [
            'success' => true,
            'message' => 'Company profile completed successfully.',
            'role'    => 'employer',
            'user'    => $this->publicUser('employer', $employer),
        ];
    }

    public function actionEmployerSubmit(): array
    {
        if (!$this->isPost()) return $this->methodError();

        $auth = $this->authenticate('employer');
        if (!$auth) return $this->authError('Please sign in as an employer to post a job.');

        /** @var JobEmployer $employer */
        $employer = $auth['model'];
        if (!$this->isEmployerProfileComplete($employer)) {
            return [
                'success' => false,
                'message' => 'Complete your company profile before posting your first job.',
                'profileIncomplete' => true,
            ];
        }

        $post = Yii::$app->request->post();
        $errors = $this->validateJobFields($post);
        if (!empty($errors)) return ['success' => false, 'errors' => $errors, 'message' => $errors[0]];

        $posting = new JobPosting();
        $posting->employer_id         = $employer->id;
        $posting->job_title           = trim((string)$post['jobTitle']);
        $posting->job_category        = trim((string)$post['jobCategory']);
        $posting->job_location        = trim((string)$post['jobLocation']);
        $posting->work_type           = trim((string)$post['workType']);
        $posting->experience_required = trim((string)($post['experienceRequired'] ?? ''));
        $posting->salary_range        = trim((string)($post['salaryRange'] ?? ''));
        $posting->industry            = trim((string)($post['industry'] ?? ''));
        $posting->skills_required     = trim((string)($post['skillsRequired'] ?? ''));
        $posting->job_description     = trim((string)$post['jobDescription']);
        $posting->openings            = max(1, (int)($post['openings'] ?? 1));
        $posting->apply_link          = trim((string)($post['applyLink'] ?? ''));
        $posting->status              = JobPosting::STATUS_PENDING;

        if (!$posting->save(false)) {
            ErrorLog::write('database', 'job/employer-submit', 'Failed to save posting.', $posting->getErrors());
            return ['success' => false, 'message' => 'Job posting failed. Please try again.'];
        }

        return ['success' => true, 'message' => 'Job posting submitted for admin review.'];
    }

    public function actionEmployerJobs(): array
    {
        $auth = $this->authenticate('employer');
        if (!$auth) return $this->authError('Please sign in as an employer to view your jobs.');

        /** @var JobEmployer $employer */
        $employer = $auth['model'];
        $jobs = JobPosting::find()
            ->where(['employer_id' => $employer->id])
            ->orderBy(['created_at' => SORT_DESC])
            ->all();

        return [
            'success' => true,
            'jobs' => array_map(fn(JobPosting $posting): array => $this->publicPosting($posting), $jobs),
        ];
    }

    public function actionEmployerApplicants(): array
    {
        $auth = $this->authenticate('employer');
        if (!$auth) return $this->authError('Please sign in as an employer to view applicants.');

        /** @var JobEmployer $employer */
        $employer = $auth['model'];
        $postingId = (int)Yii::$app->request->get('posting_id', 0);

        $query = JobApplication::find()
            ->alias('a')
            ->joinWith(['posting p', 'seeker s'])
            ->andWhere(['p.employer_id' => $employer->id])
            ->orderBy(['a.created_at' => SORT_DESC]);

        if ($postingId > 0) {
            $query->andWhere(['a.posting_id' => $postingId]);
        }

        return [
            'success' => true,
            'applications' => array_map(fn(JobApplication $application): array => $this->publicApplication($application), $query->all()),
        ];
    }

    public function actionEmployerApplicationStatus(): array
    {
        if (!$this->isPost()) return $this->methodError();

        $auth = $this->authenticate('employer');
        if (!$auth) return $this->authError('Please sign in as an employer to update application status.');

        /** @var JobEmployer $employer */
        $employer = $auth['model'];
        $applicationId = (int)Yii::$app->request->post('applicationId', 0);
        $status = (int)Yii::$app->request->post('status', -1);
        $allowed = [
            JobApplication::STATUS_SHORTLISTED,
            JobApplication::STATUS_REJECTED,
            JobApplication::STATUS_INTERVIEWED,
            JobApplication::STATUS_HIRED,
        ];

        if ($applicationId <= 0 || !in_array($status, $allowed, true)) {
            return ['success' => false, 'message' => 'Invalid application status request.'];
        }

        $application = JobApplication::find()
            ->alias('a')
            ->joinWith(['posting p', 'seeker s'])
            ->andWhere(['a.id' => $applicationId, 'p.employer_id' => $employer->id])
            ->one();

        if (!$application) return ['success' => false, 'message' => 'Application not found.'];

        $application->status = $status;
        if (!$application->save(false, ['status'])) {
            ErrorLog::write('database', 'job/application-status', 'Failed to update application status.', $application->getErrors());
            return ['success' => false, 'message' => 'Could not update application status.'];
        }

        $this->sendApplicationStatusEmail($application);

        return [
            'success' => true,
            'message' => 'Application status updated.',
            'application' => $this->publicApplication($application),
        ];
    }

    public function actionEmployerApplicationActivity(): array
    {
        if (!$this->isPost()) return $this->methodError();

        $auth = $this->authenticate('employer');
        if (!$auth) return $this->authError('Please sign in as an employer.');

        /** @var JobEmployer $employer */
        $employer = $auth['model'];
        $applicationId = (int)Yii::$app->request->post('applicationId', 0);
        $activity = trim((string)Yii::$app->request->post('activity', ''));
        $labels = [
            'view_profile' => 'viewed your full profile',
            'download_resume' => 'downloaded your resume',
        ];

        if ($applicationId <= 0 || !isset($labels[$activity])) {
            return ['success' => false, 'message' => 'Invalid activity request.'];
        }

        $application = JobApplication::find()
            ->alias('a')
            ->joinWith(['posting p', 'seeker s'])
            ->andWhere(['a.id' => $applicationId, 'p.employer_id' => $employer->id])
            ->one();

        if (!$application) return ['success' => false, 'message' => 'Application not found.'];

        $this->sendEmployerActivityEmail($application, $labels[$activity]);

        return ['success' => true, 'message' => 'Candidate notified.'];
    }

    public function actionDownloadResume(int $id): Response|array
    {
        $auth = $this->authenticate('employer');
        if (!$auth) return $this->authError('Please sign in as an employer to download resumes.');

        /** @var JobEmployer $employer */
        $employer = $auth['model'];
        $application = JobApplication::find()
            ->alias('a')
            ->joinWith(['posting p', 'seeker s'])
            ->andWhere(['a.id' => $id, 'p.employer_id' => $employer->id])
            ->one();

        if (!$application || !$application->seeker || trim((string)$application->seeker->resume_filename) === '') {
            Yii::$app->response->statusCode = 404;
            return ['success' => false, 'message' => 'Resume not found.'];
        }

        $path = Yii::getAlias('@webroot') . '/uploads/seeker-resumes/' . $application->seeker->resume_filename;
        if (!is_file($path)) {
            Yii::$app->response->statusCode = 404;
            return ['success' => false, 'message' => 'Resume file not found.'];
        }

        $this->sendEmployerActivityEmail($application, 'downloaded your resume');

        return Yii::$app->response->sendFile($path, $application->seeker->resume_original ?: basename($path));
    }

    public function actionSeekerRegister(): array
    {
        if (!$this->isPost()) return $this->methodError();

        $post = Yii::$app->request->post();
        $errors = $this->validateSeekerFields($post);
        $password = trim((string)($post['password'] ?? ''));
        $confirmPassword = trim((string)($post['confirmPassword'] ?? ''));
        if (strlen($password) < 6) $errors[] = 'Password must be at least 6 characters.';
        if ($password !== $confirmPassword) $errors[] = 'Passwords do not match.';

        $email = trim((string)($post['email'] ?? ''));
        $phone = preg_replace('/\D+/', '', (string)($post['phone'] ?? ''));
        if ($this->emailExists($email)) $errors[] = 'An account with this email already exists.';
        if ($this->phoneExists($phone)) $errors[] = 'An account with this phone number already exists.';

        if (!empty($errors)) return ['success' => false, 'errors' => $errors, 'message' => $errors[0]];

        $resumeFilename = '';
        $resumeOriginal = '';
        $file = UploadedFile::getInstanceByName('resume');
        if ($file) {
            $savedFile = $this->saveUpload($file, 'seeker-resumes', ['pdf', 'doc', 'docx']);
            if (!$savedFile['success']) return $savedFile;
            $resumeFilename = $savedFile['filename'];
            $resumeOriginal = $file->name;
        }

        $seeker = new JobSeeker();
        $seeker->full_name          = trim((string)$post['fullName']);
        $seeker->email              = $email;
        $seeker->phone              = $phone;
        $seeker->city               = trim((string)($post['city'] ?? ''));
        $seeker->qualification      = trim((string)($post['qualification'] ?? ''));
        $seeker->experience         = trim((string)($post['experience'] ?? ''));
        $seeker->preferred_industry = trim((string)($post['preferredIndustry'] ?? ''));
        $seeker->skills             = trim((string)($post['skills'] ?? ''));
        $seeker->linkedin_url       = trim((string)($post['linkedinUrl'] ?? ''));
        $seeker->resume_filename    = $resumeFilename;
        $seeker->resume_original    = $resumeOriginal;
        $seeker->password_hash      = Yii::$app->security->generatePasswordHash($password);
        $seeker->api_token          = $this->newToken();

        if (!$seeker->save(false)) {
            ErrorLog::write('database', 'job/seeker-register', 'Failed to save seeker.', $seeker->getErrors());
            return ['success' => false, 'message' => 'Registration failed. Please try again.'];
        }

        $mailSent = $this->sendOtpForUser($seeker, 'seeker');
        if (!$mailSent) {
            return [
                'success' => false,
                'message' => 'Account created, but we could not send the verification email. Please try again later or contact support.',
                'mailSent' => false,
                'requiresVerification' => true,
                'email' => $seeker->email,
                'expiresInMinutes' => self::OTP_TTL_MINUTES,
            ];
        }

        return [
            'success'  => true,
            'message'  => 'Job seeker account created. We sent a verification code to your email. Please verify your email before logging in.',
            'seekerId' => (int)$seeker->id,
            'role'     => 'seeker',
            'requiresVerification' => true,
            'email'    => $seeker->email,
            'expiresInMinutes' => self::OTP_TTL_MINUTES,
            'mailSent' => true,
        ];
    }

    public function actionSeekerProfile(): array
    {
        if (!$this->isPost()) return $this->methodError();

        $auth = $this->authenticate('seeker');
        if (!$auth) return $this->authError('Please sign in as a job seeker to update your profile.');

        /** @var JobSeeker $seeker */
        $seeker = $auth['model'];
        $post = Yii::$app->request->post();
        $errors = [];
        if (trim((string)($post['qualification'] ?? '')) === '') $errors[] = 'Highest qualification is required.';
        if (trim((string)($post['experience'] ?? '')) === '') $errors[] = 'Experience is required.';
        if (trim((string)($post['skills'] ?? '')) === '') $errors[] = 'Skills are required.';

        $file = UploadedFile::getInstanceByName('resume');
        if (!$file && trim((string)$seeker->resume_filename) === '') {
            $errors[] = 'Resume upload is required.';
        }
        if (!empty($errors)) return ['success' => false, 'errors' => $errors, 'message' => $errors[0]];

        $savedFile = null;
        if ($file) {
            $savedFile = $this->saveUpload($file, 'seeker-resumes', ['pdf', 'doc', 'docx']);
            if (!$savedFile['success']) return $savedFile;
        }

        $seeker->city = trim((string)($post['city'] ?? $seeker->city));
        $seeker->qualification = trim((string)$post['qualification']);
        $seeker->experience = trim((string)$post['experience']);
        $seeker->preferred_industry = trim((string)($post['preferredIndustry'] ?? $seeker->preferred_industry));
        $seeker->skills = trim((string)$post['skills']);
        $seeker->linkedin_url = trim((string)($post['linkedinUrl'] ?? $seeker->linkedin_url));

        if ($savedFile) {
            $oldPath = trim((string)$seeker->resume_filename) === ''
                ? ''
                : Yii::getAlias('@webroot') . '/uploads/seeker-resumes/' . $seeker->resume_filename;
            $seeker->resume_filename = $savedFile['filename'];
            $seeker->resume_original = $file->name;
        }

        if (!$seeker->save(false)) {
            if ($savedFile) @unlink($savedFile['path']);
            ErrorLog::write('database', 'job/seeker-profile', 'Failed to save seeker profile.', $seeker->getErrors());
            return ['success' => false, 'message' => 'Profile could not be saved. Please try again.'];
        }

        if ($savedFile && $oldPath !== '' && is_file($oldPath)) {
            @unlink($oldPath);
        }

        return [
            'success' => true,
            'message' => 'Profile completed successfully.',
            'role' => 'seeker',
            'user' => $this->publicUser('seeker', $seeker),
        ];
    }

    public function actionLogin(): array
    {
        if (!$this->isPost()) return $this->methodError();

        $email = trim((string)Yii::$app->request->post('email', ''));
        $password = trim((string)Yii::$app->request->post('password', ''));
        $role = trim((string)Yii::$app->request->post('role', ''));
        if ($email === '' || $password === '') {
            return ['success' => false, 'message' => 'Email and password are required.'];
        }

        if ($role === '' || $role === 'employer') {
            $employer = JobEmployer::find()->where(['contact_email' => $email])->one();
            if ($employer) {
                if (!Yii::$app->security->validatePassword($password, (string)$employer->contact_password_hash)) {
                    return $this->handleInvalidLogin($email, $role, 'employer');
                }
                if (!$this->isEmailVerified($employer, 'employer')) {
                    return ['success' => false, 'message' => 'Please verify your email with the OTP sent to your inbox before logging in.', 'requiresVerification' => true, 'email' => $email, 'role' => 'employer'];
                }
                $employer->api_token = $this->newToken();
                $employer->save(false, ['api_token']);
                return ['success' => true, 'token' => $employer->api_token, 'role' => 'employer', 'user' => $this->publicUser('employer', $employer)];
            }
        }

        if ($role === '' || $role === 'seeker') {
            $seeker = JobSeeker::find()->where(['email' => $email])->one();
            if ($seeker) {
                if (!Yii::$app->security->validatePassword($password, (string)$seeker->password_hash)) {
                    return $this->handleInvalidLogin($email, $role, 'seeker');
                }
                if (!$this->isEmailVerified($seeker, 'seeker')) {
                    return ['success' => false, 'message' => 'Please verify your email with the OTP sent to your inbox before logging in.', 'requiresVerification' => true, 'email' => $email, 'role' => 'seeker'];
                }
                $seeker->api_token = $this->newToken();
                $seeker->save(false, ['api_token']);
                return ['success' => true, 'token' => $seeker->api_token, 'role' => 'seeker', 'user' => $this->publicUser('seeker', $seeker), 'seekerId' => (int)$seeker->id];
            }
        }

        return ['success' => false, 'message' => 'Invalid email or password.'];
    }

    public function actionLogout(): array
    {
        if (!$this->isPost()) return $this->methodError();

        $auth = $this->authenticate();
        if (!$auth) return ['success' => true, 'message' => 'Logged out.'];

        $auth['model']->api_token = '';
        $auth['model']->save(false, ['api_token']);
        return ['success' => true, 'message' => 'Logged out.'];
    }

    public function actionApply(): array
    {
        if (!$this->isPost()) return $this->methodError();

        $auth = $this->authenticate('seeker');
        if (!$auth) return $this->authError('Please sign in as a job seeker to apply.');

        $body = json_decode(Yii::$app->request->rawBody, true) ?: Yii::$app->request->post();
        $postingId = (int)($body['posting_id'] ?? 0);
        if (!$postingId) return ['success' => false, 'message' => 'Invalid request data.'];

        $posting = JobPosting::findOne(['id' => $postingId, 'status' => JobPosting::STATUS_APPROVED]);
        if (!$posting) return ['success' => false, 'message' => 'Job posting not found or no longer active.'];

        /** @var JobSeeker $seeker */
        $seeker = $auth['model'];
        if (!$this->isSeekerProfileComplete($seeker)) {
            return [
                'success' => false,
                'message' => 'Complete your profile and upload your resume to apply for jobs.',
                'profileIncomplete' => true,
            ];
        }

        if (JobApplication::findOne(['posting_id' => $postingId, 'seeker_id' => $seeker->id])) {
            return ['success' => false, 'message' => 'You have already applied for this job.', 'alreadyApplied' => true];
        }

        $app = new JobApplication();
        $app->posting_id = $postingId;
        $app->seeker_id  = $seeker->id;
        $app->status     = JobApplication::STATUS_APPLIED;

        if (!$app->save(false)) {
            ErrorLog::write('database', 'job/apply', 'Failed to save application.', $app->getErrors());
            return ['success' => false, 'message' => 'Application failed. Please try again.'];
        }

        $this->sendNewApplicationEmails($app);

        return ['success' => true, 'message' => 'Application submitted successfully!'];
    }

    public function actionSeekerApplications(): array
    {
        $auth = $this->authenticate('seeker');
        if (!$auth) return $this->authError('Please sign in as a job seeker to view applications.');

        /** @var JobSeeker $seeker */
        $seeker = $auth['model'];
        $applications = JobApplication::find()
            ->with(['posting', 'posting.employer'])
            ->where(['seeker_id' => $seeker->id])
            ->orderBy(['created_at' => SORT_DESC])
            ->all();

        return [
            'success' => true,
            'applications' => array_map(fn(JobApplication $application): array => $this->publicSeekerApplication($application), $applications),
        ];
    }

    public function actionForgotPassword(): array
    {
        if (!$this->isPost()) return $this->methodError();

        $post = Yii::$app->request->post();
        $email = trim((string)($post['email'] ?? ''));
        $role = trim((string)($post['role'] ?? ''));
        if ($email === '' || !in_array($role, ['employer', 'seeker'], true)) {
            return ['success' => false, 'message' => 'Email and role are required.'];
        }

        $account = $this->findUserByEmailAndRole($email, $role);
        if (!$account) {
            return ['success' => false, 'message' => 'No account was found for this email.'];
        }

        $token = $this->generateOtp();
        $this->setPasswordResetToken($account['model'], $role, $token);

        $mailSent = $this->sendPasswordResetEmail($email, $role === 'employer' ? $account['model']->contact_name : $account['model']->full_name, $token, $role);
        if (!$mailSent) {
            return ['success' => false, 'message' => 'We could not send the reset code right now. Please try again later.', 'mailSent' => false];
        }

        return ['success' => true, 'message' => 'We sent a password reset code to your email.', 'mailSent' => true];
    }

    public function actionVerifyEmail(): array
    {
        if (!$this->isPost()) return $this->methodError();

        $post = Yii::$app->request->post();
        $role = trim((string)($post['role'] ?? ''));
        $email = trim((string)($post['email'] ?? ''));
        $otp = trim((string)($post['otp'] ?? ''));

        if ($email === '' || $otp === '' || !in_array($role, ['employer', 'seeker'], true)) {
            return ['success' => false, 'message' => 'Email, role, and OTP are required.'];
        }

        $account = $this->findUserByEmailAndRole($email, $role);
        if (!$account) {
            return ['success' => false, 'message' => 'No account was found for this email.'];
        }

        if ($this->isEmailVerified($account['model'], $role)) {
            return ['success' => true, 'message' => 'Email is already verified. You can log in now.'];
        }

        $storedOtp = $this->getStoredOtp($account['model'], $role);
        $expiresAt = $this->getOtpExpiry($account['model'], $role);
        if ($storedOtp === '') {
            $mailSent = $this->sendOtpForUser($account['model'], $role);
            if (!$mailSent) {
                return ['success' => false, 'message' => 'We could not send a new verification code. Please try again later.', 'mailSent' => false];
            }
            return ['success' => false, 'message' => 'No OTP was found. A fresh code has been sent to your email.', 'resent' => true, 'mailSent' => true];
        }

        if ($expiresAt !== null && strtotime($expiresAt) < time()) {
            $this->clearOtp($account['model'], $role);
            $mailSent = $this->sendOtpForUser($account['model'], $role);
            if (!$mailSent) {
                return ['success' => false, 'message' => 'The previous OTP expired and we could not send a new one. Please try again later.', 'mailSent' => false];
            }
            return ['success' => false, 'message' => 'OTP expired. A new code has been sent to your email.', 'resent' => true, 'mailSent' => true];
        }

        if (!hash_equals($storedOtp, $otp)) {
            return ['success' => false, 'message' => 'Invalid OTP. Please try again.'];
        }

        $this->markEmailVerified($account['model'], $role);

        return ['success' => true, 'message' => 'Email verified successfully. You can now log in.'];
    }

    public function actionResendOtp(): array
    {
        if (!$this->isPost()) return $this->methodError();

        $post = Yii::$app->request->post();
        $role = trim((string)($post['role'] ?? ''));
        $email = trim((string)($post['email'] ?? ''));

        if ($email === '' || !in_array($role, ['employer', 'seeker'], true)) {
            return ['success' => false, 'message' => 'Email and role are required.'];
        }

        $account = $this->findUserByEmailAndRole($email, $role);
        if (!$account) {
            return ['success' => false, 'message' => 'No account was found for this email.'];
        }

        $this->clearOtp($account['model'], $role);
        $mailSent = $this->sendOtpForUser($account['model'], $role);
        if (!$mailSent) {
            return ['success' => false, 'message' => 'We could not send a new verification code. Please try again later.', 'mailSent' => false];
        }

        return ['success' => true, 'message' => 'A new verification code has been sent to your email.', 'mailSent' => true];
    }

    public function actionResetPassword(): array
    {
        if (!$this->isPost()) return $this->methodError();

        $post = Yii::$app->request->post();
        $email = trim((string)($post['email'] ?? ''));
        $role = trim((string)($post['role'] ?? ''));
        $token = trim((string)($post['token'] ?? ''));
        $password = trim((string)($post['password'] ?? ''));
        $confirmPassword = trim((string)($post['confirmPassword'] ?? ''));

        if ($email === '' || $token === '' || $password === '' || !in_array($role, ['employer', 'seeker'], true)) {
            return ['success' => false, 'message' => 'Email, reset code, and password are required.'];
        }
        if ($password !== $confirmPassword) {
            return ['success' => false, 'message' => 'Passwords do not match.'];
        }
        if (strlen($password) < 6) {
            return ['success' => false, 'message' => 'Password must be at least 6 characters.'];
        }

        $account = $this->findUserByEmailAndRole($email, $role);
        if (!$account) {
            return ['success' => false, 'message' => 'No account was found for this email.'];
        }

        $storedToken = $this->getPasswordResetToken($account['model'], $role);
        if ($storedToken === '' || !hash_equals($storedToken, $token)) {
            return ['success' => false, 'message' => 'The reset code is invalid or has already been used.'];
        }

        $this->setPasswordHash($account['model'], $role, Yii::$app->security->generatePasswordHash($password));
        $this->clearPasswordResetToken($account['model'], $role);

        return ['success' => true, 'message' => 'Your password has been reset successfully. You can sign in now.'];
    }

    private function handleInvalidLogin(string $email, string $role, string $fallbackRole): array
    {
        if ($role === '' || $role === $fallbackRole) {
            return ['success' => false, 'message' => 'Invalid email or password.'];
        }

        return ['success' => false, 'message' => 'Invalid email or password.'];
    }

    private function authenticate(?string $role = null): ?array
    {
        $header = Yii::$app->request->headers->get('Authorization', '');
        $token = str_starts_with($header, 'Bearer ') ? trim(substr($header, 7)) : '';
        if ($token === '') {
            $token = trim((string)Yii::$app->request->post('token', ''));
        }
        if ($token === '') return null;

        if ($role === null || $role === 'employer') {
            $employer = JobEmployer::find()->where(['api_token' => $token])->one();
            if ($employer) return ['role' => 'employer', 'model' => $employer];
        }

        if ($role === null || $role === 'seeker') {
            $seeker = JobSeeker::find()->where(['api_token' => $token])->one();
            if ($seeker) return ['role' => 'seeker', 'model' => $seeker];
        }

        return null;
    }

    private function authError(string $message = 'Authentication required.'): array
    {
        Yii::$app->response->statusCode = 401;
        return ['success' => false, 'message' => $message, 'authRequired' => true];
    }

    private function methodError(): array
    {
        Yii::$app->response->statusCode = 405;
        return ['success' => false, 'message' => 'Method not allowed.'];
    }

    private function isPost(): bool
    {
        return Yii::$app->request->method === 'POST';
    }

    private function newToken(): string
    {
        return bin2hex(random_bytes(self::TOKEN_BYTES));
    }

    private function publicUser(string $role, JobEmployer|JobSeeker $model): array
    {
        if ($role === 'employer') {
            return [
                'id'          => (int)$model->id,
                'name'        => $model->contact_name,
                'email'       => $model->contact_email,
                'phone'       => $model->contact_phone,
                'companyName' => $model->company_name,
                'companyIndustry' => $model->company_industry,
                'employeeCount' => $model->employee_count,
                'companyAddress' => $model->company_address,
                'companyWebsite' => $model->company_website,
                'companyDescription' => $model->hasAttribute('company_description') ? (string)$model->company_description : '',
                'documentOriginal' => $model->document_original,
                'profileComplete' => $this->isEmployerProfileComplete($model),
                'status'      => (int)$model->status,
            ];
        }

        return [
            'id'    => (int)$model->id,
            'name'  => $model->full_name,
            'email' => $model->email,
            'phone' => $model->phone,
            'city' => $model->city,
            'qualification' => $model->qualification,
            'experience' => $model->experience,
            'preferredIndustry' => $model->preferred_industry,
            'skills' => $model->skills,
            'linkedinUrl' => $model->linkedin_url,
            'resumeOriginal' => $model->resume_original,
            'profileComplete' => $this->isSeekerProfileComplete($model),
        ];
    }

    private function publicPosting(JobPosting $posting): array
    {
        return [
            'id' => (int)$posting->id,
            'jobTitle' => $posting->job_title,
            'jobCategory' => $posting->job_category,
            'jobLocation' => $posting->job_location,
            'workType' => $posting->work_type,
            'workTypeLabel' => $posting->workTypeLabel(),
            'experienceRequired' => $posting->experience_required,
            'salaryRange' => $posting->salary_range,
            'industry' => $posting->industry,
            'skillsRequired' => $posting->skills_required,
            'jobDescription' => $posting->job_description,
            'openings' => (int)$posting->openings,
            'applyLink' => $posting->apply_link,
            'status' => (int)$posting->status,
            'statusLabel' => JobPosting::statusLabel((int)$posting->status),
            'postedAt' => $posting->created_at,
        ];
    }

    private function publicApplication(JobApplication $application): array
    {
        $seeker = $application->seeker;
        $posting = $application->posting;
        $name = (string)($seeker->full_name ?? '');

        return [
            'id' => (int)$application->id,
            'postingId' => (int)$application->posting_id,
            'jobTitle' => $posting->job_title ?? '',
            'status' => (int)$application->status,
            'statusLabel' => JobApplication::statusLabel((int)$application->status),
            'applicationDate' => $application->created_at,
            'resumeAvailable' => trim((string)($seeker->resume_filename ?? '')) !== '',
            'applicant' => [
                'id' => (int)($seeker->id ?? 0),
                'initials' => $this->initials($name),
                'fullName' => $name,
                'email' => $seeker->email ?? '',
                'phone' => $seeker->phone ?? '',
                'currentDesignation' => $seeker->preferred_industry ?? '',
                'experience' => $seeker->experience ?? '',
                'highestQualification' => $seeker->qualification ?? '',
                'skills' => $seeker->skills ?? '',
                'city' => $seeker->city ?? '',
                'professionalSummary' => $seeker->skills ?? '',
                'education' => $seeker->qualification ?? '',
                'linkedinUrl' => $seeker->linkedin_url ?? '',
                'resumeOriginal' => $seeker->resume_original ?? '',
            ],
        ];
    }

    private function publicSeekerApplication(JobApplication $application): array
    {
        return [
            'id' => (int)$application->id,
            'postingId' => (int)$application->posting_id,
            'jobTitle' => $application->posting->job_title ?? '',
            'companyName' => $application->posting->employer->company_name ?? '',
            'jobLocation' => $application->posting->job_location ?? '',
            'status' => (int)$application->status,
            'statusLabel' => JobApplication::statusLabel((int)$application->status),
            'applicationDate' => $application->created_at,
        ];
    }

    private function initials(string $name): string
    {
        $parts = preg_split('/\s+/', trim($name)) ?: [];
        $letters = array_map(fn(string $part): string => mb_substr($part, 0, 1), array_slice(array_filter($parts), 0, 2));
        return mb_strtoupper(implode('', $letters) ?: 'DG');
    }

    private function validateEmployerAccountFields(array $post): array
    {
        $errors = [];
        if (trim((string)($post['contactName'] ?? '')) === '') $errors[] = 'Contact person name is required.';

        $phone = preg_replace('/\D+/', '', (string)($post['contactPhone'] ?? ''));
        if ($phone === '' || !preg_match('/^[6-9][0-9]{9}$/', $phone)) $errors[] = 'Valid 10-digit Indian contact phone number is required.';

        $email = trim((string)($post['contactEmail'] ?? ''));
        if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) $errors[] = 'Valid contact email is required.';

        return $errors;
    }

    private function validateEmployerProfileFields(array $post): array
    {
        $errors = [];
        if (trim((string)($post['companyName'] ?? '')) === '') $errors[] = 'Company name is required.';
        if (trim((string)($post['companyIndustry'] ?? '')) === '') $errors[] = 'Industry is required.';
        if (trim((string)($post['employeeCount'] ?? '')) === '') $errors[] = 'Company size is required.';
        if (trim((string)($post['companyAddress'] ?? '')) === '') $errors[] = 'Company address is required.';
        if (trim((string)($post['companyDescription'] ?? '')) === '') $errors[] = 'Company description is required.';

        $website = trim((string)($post['companyWebsite'] ?? ''));
        if ($website !== '' && !filter_var($website, FILTER_VALIDATE_URL)) {
            $errors[] = 'Company website must be a valid URL.';
        }

        return $errors;
    }

    private function isEmployerProfileComplete(JobEmployer $employer): bool
    {
        $description = $employer->hasAttribute('company_description') ? trim((string)$employer->company_description) : 'filled';

        return trim((string)$employer->company_name) !== ''
            && trim((string)$employer->company_industry) !== ''
            && trim((string)$employer->employee_count) !== ''
            && trim((string)$employer->company_address) !== ''
            && $description !== ''
            && trim((string)$employer->document_filename) !== '';
    }

    private function isSeekerProfileComplete(JobSeeker $seeker): bool
    {
        return trim((string)$seeker->full_name) !== ''
            && trim((string)$seeker->email) !== ''
            && trim((string)$seeker->phone) !== ''
            && trim((string)$seeker->qualification) !== ''
            && trim((string)$seeker->experience) !== ''
            && trim((string)$seeker->skills) !== ''
            && trim((string)$seeker->resume_filename) !== '';
    }

    private function validateJobFields(array $post): array
    {
        $errors = [];
        if (trim((string)($post['jobTitle'] ?? '')) === '') $errors[] = 'Job title is required.';
        if (trim((string)($post['jobCategory'] ?? '')) === '') $errors[] = 'Job category is required.';
        if (trim((string)($post['jobLocation'] ?? '')) === '') $errors[] = 'Job location is required.';
        if (trim((string)($post['workType'] ?? '')) === '') $errors[] = 'Work type is required.';
        if (trim((string)($post['jobDescription'] ?? '')) === '') $errors[] = 'Job description is required.';
        if (!empty($post['jobDescription']) && $this->isGibberish((string)$post['jobDescription'])) {
            $errors[] = 'Job description appears to be gibberish. Please provide clear, human-readable content.';
        }
        return $errors;
    }

    private function validateSeekerFields(array $post): array
    {
        $errors = [];
        $name = trim((string)($post['fullName'] ?? ''));
        $email = trim((string)($post['email'] ?? ''));
        $phone = preg_replace('/\D+/', '', (string)($post['phone'] ?? ''));

        if ($name === '' || mb_strlen($name) < 2) $errors[] = 'Full name is required.';
        if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) $errors[] = 'Valid email is required.';
        if ($phone === '' || !preg_match('/^[6-9][0-9]{9}$/', $phone)) $errors[] = 'Valid 10-digit Indian phone number is required.';

        return $errors;
    }

    private function emailExists(string $email): bool
    {
        return JobEmployer::find()->where(['contact_email' => $email])->exists()
            || JobSeeker::find()->where(['email' => $email])->exists();
    }

    private function phoneExists(string $phone): bool
    {
        return JobEmployer::find()->where(['contact_phone' => $phone])->exists()
            || JobSeeker::find()->where(['phone' => $phone])->exists();
    }

    private function findUserByEmailAndRole(string $email, string $role): ?array
    {
        if ($role === 'employer') {
            $employer = JobEmployer::find()->where(['contact_email' => $email])->one();
            if ($employer) return ['role' => 'employer', 'model' => $employer];
        }

        if ($role === 'seeker') {
            $seeker = JobSeeker::find()->where(['email' => $email])->one();
            if ($seeker) return ['role' => 'seeker', 'model' => $seeker];
        }

        return null;
    }

    private function sendOtpForUser(JobEmployer|JobSeeker $user, string $role): bool
    {
        $otp = $this->generateOtp();
        $expiresAt = date('Y-m-d H:i:s', strtotime('+' . self::OTP_TTL_MINUTES . ' minutes'));

        if ($role === 'employer') {
            $this->setAttributeIfExists($user, 'contact_email_verification_token', $otp);
            $this->setAttributeIfExists($user, 'contact_email_verification_expires_at', $expiresAt);
            $this->setAttributeIfExists($user, 'contact_email_verified', 0);
            $saved = $this->saveAttributesIfPresent($user, ['contact_email_verification_token', 'contact_email_verification_expires_at', 'contact_email_verified']);
        } else {
            $this->setAttributeIfExists($user, 'email_verification_token', $otp);
            $this->setAttributeIfExists($user, 'email_verification_expires_at', $expiresAt);
            $this->setAttributeIfExists($user, 'email_verified', 0);
            $saved = $this->saveAttributesIfPresent($user, ['email_verification_token', 'email_verification_expires_at', 'email_verified']);
        }

        if (!$saved) {
            ErrorLog::write('database', 'job/send-otp', 'Failed to store verification OTP.', $user->getErrors());
            return false;
        }

        $email = $role === 'employer' ? $user->contact_email : $user->email;
        $name = $role === 'employer' ? $user->contact_name : $user->full_name;
        return $this->sendOtpEmail($email, $name, $otp, $role);
    }

    private function clearOtp(JobEmployer|JobSeeker $user, string $role): void
    {
        if ($role === 'employer') {
            $this->setAttributeIfExists($user, 'contact_email_verification_token', '');
            $this->setAttributeIfExists($user, 'contact_email_verification_expires_at', null);
            $this->saveAttributesIfPresent($user, ['contact_email_verification_token', 'contact_email_verification_expires_at']);
            return;
        }

        $this->setAttributeIfExists($user, 'email_verification_token', '');
        $this->setAttributeIfExists($user, 'email_verification_expires_at', null);
        $this->saveAttributesIfPresent($user, ['email_verification_token', 'email_verification_expires_at']);
    }

    private function markEmailVerified(JobEmployer|JobSeeker $user, string $role): void
    {
        if ($role === 'employer') {
            $this->setAttributeIfExists($user, 'contact_email_verified', 1);
            $this->setAttributeIfExists($user, 'contact_email_verification_token', '');
            $this->setAttributeIfExists($user, 'contact_email_verification_expires_at', null);
            $this->saveAttributesIfPresent($user, ['contact_email_verified', 'contact_email_verification_token', 'contact_email_verification_expires_at']);
            return;
        }

        $this->setAttributeIfExists($user, 'email_verified', 1);
        $this->setAttributeIfExists($user, 'email_verification_token', '');
        $this->setAttributeIfExists($user, 'email_verification_expires_at', null);
        $this->saveAttributesIfPresent($user, ['email_verified', 'email_verification_token', 'email_verification_expires_at']);
    }

    private function isEmailVerified(JobEmployer|JobSeeker $user, string $role): bool
    {
        return $role === 'employer'
            ? (int)$user->contact_email_verified === 1
            : (int)$user->email_verified === 1;
    }

    private function getStoredOtp(JobEmployer|JobSeeker $user, string $role): string
    {
        return $role === 'employer'
            ? (string)$user->contact_email_verification_token
            : (string)$user->email_verification_token;
    }

    private function getOtpExpiry(JobEmployer|JobSeeker $user, string $role): ?string
    {
        return $role === 'employer'
            ? (string)($user->contact_email_verification_expires_at ?? '')
            : (string)($user->email_verification_expires_at ?? '');
    }

    private function generateOtp(): string
    {
        return str_pad((string)random_int(0, 10 ** self::OTP_LENGTH - 1), self::OTP_LENGTH, '0', STR_PAD_LEFT);
    }

    private function setAttributeIfExists(JobEmployer|JobSeeker $user, string $attribute, $value): void
    {
        if ($user->hasAttribute($attribute)) {
            $user->$attribute = $value;
        }
    }

    private function setPasswordResetToken(JobEmployer|JobSeeker $user, string $role, string $token): void
    {
        if ($role === 'employer') {
            $this->setAttributeIfExists($user, 'password_reset_token', $token);
            $this->saveAttributesIfPresent($user, ['password_reset_token']);
            return;
        }

        $this->setAttributeIfExists($user, 'password_reset_token', $token);
        $this->saveAttributesIfPresent($user, ['password_reset_token']);
    }

    private function clearPasswordResetToken(JobEmployer|JobSeeker $user, string $role): void
    {
        $this->setAttributeIfExists($user, 'password_reset_token', '');
        $this->saveAttributesIfPresent($user, ['password_reset_token']);
    }

    private function getPasswordResetToken(JobEmployer|JobSeeker $user, string $role): string
    {
        return (string)$user->password_reset_token;
    }

    private function setPasswordHash(JobEmployer|JobSeeker $user, string $role, string $hash): void
    {
        if ($role === 'employer') {
            $this->setAttributeIfExists($user, 'contact_password_hash', $hash);
            $this->saveAttributesIfPresent($user, ['contact_password_hash']);
            return;
        }

        $this->setAttributeIfExists($user, 'password_hash', $hash);
        $this->saveAttributesIfPresent($user, ['password_hash']);
    }

    private function saveAttributesIfPresent(JobEmployer|JobSeeker $user, array $attributes): bool
    {
        $present = array_values(array_filter($attributes, fn(string $attribute): bool => $user->hasAttribute($attribute)));
        if ($present === []) {
            return true;
        }

        return $user->save(false, $present);
    }

    private function sendOtpEmail(string $email, string $name, string $otp, string $role): bool
    {
        $subject = $role === 'employer'
            ? 'Verify your employer account on Degree Guru'
            : 'Verify your job seeker account on Degree Guru';

        $body = "Hello {$name},\n\nYour verification code is {$otp}.\nThis code is valid for " . self::OTP_TTL_MINUTES . " minutes.\n\nIf you did not request this, you can ignore this email.";

        try {
            Yii::$app->mailer->compose()
                ->setFrom([getenv('SMTP_FROM') ?: 'info@degreeguru.in' => 'Degree Guru'])
                ->setTo($email)
                ->setSubject($subject)
                ->setTextBody($body)
                ->send();
            return true;
        } catch (\Throwable $e) {
            ErrorLog::write('mail', 'job/send-otp', 'Failed to send verification email.', ['email' => $email, 'error' => $e->getMessage()]);
            return false;
        }
    }

    private function sendPasswordResetEmail(string $email, string $name, string $token, string $role): bool
    {
        $subject = 'Reset your Degree Guru password';
        $body = "Hello {$name},\n\nUse the following reset code to set a new password: {$token}\n\nIf you did not request this, you can ignore this email.";

        try {
            Yii::$app->mailer->compose()
                ->setFrom([getenv('SMTP_FROM') ?: 'info@degreeguru.in' => 'Degree Guru'])
                ->setTo($email)
                ->setSubject($subject)
                ->setTextBody($body)
                ->send();
            return true;
        } catch (\Throwable $e) {
            ErrorLog::write('mail', 'job/reset-password', 'Failed to send password reset email.', ['email' => $email, 'error' => $e->getMessage()]);
            return false;
        }
    }

    private function sendNewApplicationEmails(JobApplication $application): void
    {
        $application->populateRelation('posting', $application->posting);
        $application->populateRelation('seeker', $application->seeker);
        $posting = $application->posting;
        $seeker = $application->seeker;
        $employer = $posting?->employer;

        if (!$posting || !$seeker || !$employer) return;

        $employerBody = "Hello {$employer->contact_name},\n\n"
            . "A new candidate has applied for your job posting.\n\n"
            . "Job Title: {$posting->job_title}\n\n"
            . "Candidate Name: {$seeker->full_name}\n"
            . "Email: {$seeker->email}\n"
            . "Phone: {$seeker->phone}\n\n"
            . "Log in to your Employer Dashboard to view the complete profile and download the candidate's resume.\n\n"
            . "Regards,\nDegree Guru";

        $seekerBody = "Hello {$seeker->full_name},\n\n"
            . "Your application for \"{$posting->job_title}\" has been successfully submitted.\n\n"
            . "You can track the status of your application from your Job Seeker Dashboard.\n\n"
            . "Thank you,\nDegree Guru";

        $this->sendPlainEmail($employer->contact_email, 'New Job Application Received', $employerBody, 'job/application-employer');
        $this->sendPlainEmail($seeker->email, 'Application Submitted Successfully', $seekerBody, 'job/application-seeker');
    }

    private function sendApplicationStatusEmail(JobApplication $application): void
    {
        $posting = $application->posting;
        $seeker = $application->seeker;
        if (!$posting || !$seeker) return;

        $status = JobApplication::statusLabel((int)$application->status);
        $body = "Hello {$seeker->full_name},\n\n"
            . "Your application status for \"{$posting->job_title}\" has been updated to: {$status}.\n\n"
            . "You can view the latest status from your Job Seeker Dashboard:\n"
            . $this->jobSeekerDashboardUrl() . "\n\n"
            . "Regards,\nDegree Guru";

        $this->sendPlainEmail($seeker->email, 'Application Status Updated', $body, 'job/application-status');
    }

    private function sendEmployerActivityEmail(JobApplication $application, string $activity): void
    {
        $posting = $application->posting;
        $seeker = $application->seeker;
        $employer = $posting?->employer;
        if (!$posting || !$seeker || !$employer) return;

        $body = "Hello {$seeker->full_name},\n\n"
            . "{$employer->company_name} has {$activity} for your application.\n\n"
            . "Job Title: {$posting->job_title}\n\n"
            . "Log in to your Job Seeker Dashboard to check the latest status:\n"
            . $this->jobSeekerDashboardUrl() . "\n\n"
            . "Regards,\nDegree Guru";

        $this->sendPlainEmail($seeker->email, 'Application Activity Update', $body, 'job/application-activity');
    }

    private function jobSeekerDashboardUrl(): string
    {
        $base = rtrim((string)(getenv('FRONTEND_URL') ?: getenv('APP_FRONTEND_URL') ?: 'http://localhost:5173'), '/');
        return $base . '/jobseeker/dashboard';
    }

    private function sendPlainEmail(string $email, string $subject, string $body, string $context): bool
    {
        try {
            Yii::$app->mailer->compose()
                ->setFrom([getenv('SMTP_FROM') ?: 'info@degreeguru.in' => 'Degree Guru'])
                ->setTo($email)
                ->setSubject($subject)
                ->setTextBody($body)
                ->send();
            return true;
        } catch (\Throwable $e) {
            ErrorLog::write('mail', $context, 'Failed to send email.', ['email' => $email, 'error' => $e->getMessage()]);
            return false;
        }
    }

    private function saveUpload(?UploadedFile $file, string $folder, array $allowedExt): array
    {
        if (!$file) return ['success' => false, 'message' => 'Upload is required.'];

        $ext = strtolower($file->extension);
        if (!in_array($ext, $allowedExt, true)) {
            return ['success' => false, 'message' => 'Invalid file type.'];
        }
        if ($file->size > 5 * 1024 * 1024) {
            return ['success' => false, 'message' => 'File must be under 5 MB.'];
        }

        $uploadDir = Yii::getAlias('@webroot') . '/uploads/' . trim($folder, '/') . '/';
        if (!is_dir($uploadDir)) mkdir($uploadDir, 0775, true);

        $safeName = time() . '_' . bin2hex(random_bytes(6)) . '.' . $ext;
        $path = $uploadDir . $safeName;
        if (!$file->saveAs($path)) {
            ErrorLog::write('server', 'job/upload', 'Failed to save upload.', ['folder' => $folder]);
            return ['success' => false, 'message' => 'Upload failed. Please try again.'];
        }

        return ['success' => true, 'filename' => $safeName, 'path' => $path];
    }

    private function isGibberish(string $text): bool
    {
        $plain = trim(strip_tags($text));
        if ($plain === '') return true;
        if (mb_strlen($plain) < 20) return true;

        $lettersOnly = preg_replace('/[^A-Za-z]/u', '', $plain);
        $alphaRatio = mb_strlen($lettersOnly) / max(1, mb_strlen($plain));
        if ($alphaRatio < 0.35) return true;

        $words = preg_split('/\s+/', $plain) ?: [];
        if (count($words) < 4) return true;

        return (bool)preg_match('/[^A-Za-z0-9\s]{6,}/u', $plain);
    }
}

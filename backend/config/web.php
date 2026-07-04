<?php

$params = require __DIR__ . '/params.php';
$db     = require __DIR__ . '/db.php';

$config = [
    'id'       => 'degree-guru',
    'name'     => 'Degree Guru',
    'basePath' => dirname(__DIR__),
    'bootstrap' => ['log'],

    'container' => [
        'singletons' => [
            \yii\mail\MailerInterface::class => [
                'class'            => \yii\symfonymailer\Mailer::class,
                'useFileTransport' => filter_var(getenv('MAIL_USE_FILE_TRANSPORT') ?: '0', FILTER_VALIDATE_BOOLEAN),
                'viewPath'         => '@app/mail',
                'messageConfig' => [
                    'from' => [getenv('SMTP_FROM') ?: 'info@degreeguru.in' => 'Degree Guru'],
                ],
                // Transport can be configured via SMTP DSN in env var `SMTP_DSN` or individual vars below.
                'transport' => [
                    'dsn' => getenv('SMTP_DSN') ?: (function () {
                        $host = getenv('SMTP_HOST') ?: 'smtp.hostinger.com';
                        $user = getenv('SMTP_USER') ?: 'info@degreeguru.in';
                        $pass = getenv('SMTP_PASS') ?: 'Degreeguru@12';
                        $port = getenv('SMTP_PORT') ?: '465';
                        $enc  = getenv('SMTP_ENCRYPTION') ?: 'tls';
                        return sprintf('smtp://%s:%s@%s:%s?encryption=%s', rawurlencode($user), rawurlencode($pass), $host, $port, $enc);
                    })(),
                ],
            ],
        ],
    ],

    'aliases' => [
        '@bower' => '@vendor/bower-asset',
        '@npm'   => '@vendor/npm-asset',
    ],

    'components' => [

        'request' => [
            'cookieValidationKey' => 'M-aPK4DBVGF8umqFplk2T7ksXq38Rr3X',
        ],

        'cache' => [
            'class' => \yii\caching\FileCache::class,
        ],

        'user' => [
            'identityClass'   => \app\models\User::class,
            'enableAutoLogin' => true,
        ],

        'errorHandler' => [
            'errorAction' => 'site/error',
        ],

        'mailer' => \yii\mail\MailerInterface::class,

        'log' => [
            'traceLevel' => YII_DEBUG ? 3 : 0,
            'targets'    => [
                [
                    'class'  => \yii\log\FileTarget::class,
                    'levels' => ['error', 'warning'],
                ],
            ],
        ],

        'db' => array_merge($db, YII_ENV !== 'dev' ? [
            'enableSchemaCache'   => true,
            'schemaCacheDuration' => 3600,
            'schemaCache'         => 'cache',
        ] : []),

        // Yii RBAC using DB-backed manager
        'authManager' => [
            'class' => \yii\rbac\DbManager::class,
        ],

        'urlManager' => [
            'enablePrettyUrl' => true,
            'showScriptName'  => false,
            'rules'           => [
                // Public API (consumed by React frontend)
                'api/home'             => 'api/home',
                'api/programs'         => 'api/programs',
                // Provide backwards-compatible API-prefixed routes that map
                // to existing controllers/actions. Frontend should call /api/...
                // so these are explicitly routed to the existing actions.
                'api/contact/submit'   => 'contact/submit',
                'api/contact/index'    => 'contact/index',
                'api/contact/view'     => 'contact/view',

                'api/recruitment/submit'   => 'recruitment/submit',
                'api/recruitment/download' => 'recruitment/download',
                'api/recruitment/view'     => 'recruitment/view',

                'api/jobs/listings'        => 'job/listings',
                'api/jobs/me'              => 'job/me',
                'api/jobs/login'           => 'job/login',
                'api/jobs/logout'          => 'job/logout',
                'api/jobs/employer/register' => 'job/employer-register',
                'api/jobs/employer/profile' => 'job/employer-profile',
                'api/jobs/employer/submit' => 'job/employer-submit',
                'api/jobs/employer/jobs' => 'job/employer-jobs',
                'api/jobs/employer/applicants' => 'job/employer-applicants',
                'api/jobs/employer/application-status' => 'job/employer-application-status',
                'api/jobs/employer/application-activity' => 'job/employer-application-activity',
                'api/jobs/employer/download-resume' => 'job/download-resume',
                'api/jobs/seeker/register' => 'job/seeker-register',
                'api/jobs/seeker/profile' => 'job/seeker-profile',
                'api/jobs/seeker/applications' => 'job/seeker-applications',
                'api/jobs/apply'           => 'job/apply',

                // CMS — Home
                'cms/home'             => 'cms/home',
                'cms/clear-section'    => 'cms/clear-section',

                // CMS — Programs
                'program/index'        => 'program/index',
                'program/create'       => 'program/create',
                'program/update'       => 'program/update',
                'program/delete'       => 'program/delete',
                'program/toggle'       => 'program/toggle',

                // Profile
                'profile'              => 'profile/index',

                // Recruitment
                'recruitment/submit'   => 'recruitment/submit',
                'recruitment/download' => 'recruitment/download',
                'recruitment/view'     => 'recruitment/view',
                'recruitment/index'    => 'recruitment/index',

                // Counseling leads
                'contact/submit'        => 'contact/submit',
                'contact/index'         => 'contact/index',
                'contact/view'          => 'contact/view',
                'contact/update-status' => 'contact/update-status',

                // Error logs
                'error-log/index'      => 'error-log/index',
                'error-log/clear'      => 'error-log/clear',

                // Jobs — Public API
                'jobs/listings'          => 'job/listings',
                'jobs/me'                => 'job/me',
                'jobs/login'             => 'job/login',
                'jobs/logout'            => 'job/logout',
                'jobs/employer/register' => 'job/employer-register',
                'jobs/employer/profile'  => 'job/employer-profile',
                'jobs/employer/submit'   => 'job/employer-submit',
                'jobs/employer/jobs'     => 'job/employer-jobs',
                'jobs/employer/applicants' => 'job/employer-applicants',
                'jobs/employer/application-status' => 'job/employer-application-status',
                'jobs/employer/application-activity' => 'job/employer-application-activity',
                'jobs/employer/download-resume' => 'job/download-resume',
                'jobs/forgot-password'   => 'job/forgot-password',
                'jobs/reset-password'    => 'job/reset-password',
                'jobs/verify-email'      => 'job/verify-email',
                'jobs/resend-otp'        => 'job/resend-otp',
                'jobs/seeker/register'   => 'job/seeker-register',
                'jobs/seeker/profile'    => 'job/seeker-profile',
                'jobs/seeker/applications' => 'job/seeker-applications',
                'jobs/apply'             => 'job/apply',
                'api/jobs/verify-email'  => 'job/verify-email',
                'api/jobs/resend-otp'    => 'job/resend-otp',

                // Jobs — Admin
                'job-admin'                        => 'job-admin/index',
                'job-admin/employers'              => 'job-admin/employers',
                'job-admin/view-employer'          => 'job-admin/view-employer',
                'job-admin/approve-employer'       => 'job-admin/approve-employer',
                'job-admin/reject-employer'        => 'job-admin/reject-employer',
                'job-admin/download-doc'           => 'job-admin/download-doc',
                'job-admin/postings'               => 'job-admin/postings',
                'job-admin/view-posting'           => 'job-admin/view-posting',
                'job-admin/approve-posting'        => 'job-admin/approve-posting',
                'job-admin/reject-posting'         => 'job-admin/reject-posting',
                'job-admin/delete-posting'         => 'job-admin/delete-posting',
                'job-admin/seekers'                => 'job-admin/seekers',
                'job-admin/applications'           => 'job-admin/applications',
                'job-admin/update-app-status'      => 'job-admin/update-app-status',
            ],
        ],

        'response' => [
            'class'   => \yii\web\Response::class,
            'on beforeSend' => function ($event) use ($params) {
                $response = $event->sender;

                // Security headers
                $response->headers->set('X-Content-Type-Options', 'nosniff');
                $response->headers->set('X-Frame-Options', 'SAMEORIGIN');
                $response->headers->set('X-XSS-Protection', '1; mode=block');
                if (!YII_DEBUG) {
                    $response->headers->set('Referrer-Policy', 'strict-origin-when-cross-origin');
                }

                // CORS — allow configured origins on every response
                $origin = Yii::$app->request->headers->get('Origin', '');
                $allowed = $params['corsAllowedOrigins'] ?? [];
                if ($origin !== '' && in_array($origin, $allowed, true)) {
                    $response->headers->set('Access-Control-Allow-Origin', $origin);
                    $response->headers->set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
                    $response->headers->set('Access-Control-Allow-Headers', 'Content-Type, X-Requested-With, Authorization');
                    $response->headers->set('Access-Control-Allow-Credentials', 'true');
                }
            },
        ],
    ],

    'params' => $params,
];

if (YII_ENV_DEV) {
    $config['bootstrap'][] = 'debug';
    $config['modules']['debug'] = [
        'class' => \yii\debug\Module::class,
    ];
    $config['bootstrap'][] = 'gii';
    $config['modules']['gii'] = [
        'class' => \yii\gii\Module::class,
    ];
}

return $config;

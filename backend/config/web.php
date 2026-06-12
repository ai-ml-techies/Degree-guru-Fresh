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
                'useFileTransport' => YII_ENV_DEV, // prod sends real emails
                'viewPath'         => '@app/mail',
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

        'urlManager' => [
            'enablePrettyUrl' => true,
            'showScriptName'  => false,
            'rules'           => [
                // Public API (consumed by React frontend)
                'api/home'             => 'api/home',
                'api/programs'         => 'api/programs',

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
                'jobs/employer/submit'   => 'job/employer-submit',
                'jobs/forgot-password'   => 'job/forgot-password',
                'jobs/reset-password'    => 'job/reset-password',
                'jobs/verify-email'      => 'job/verify-email',
                'jobs/seeker/register'   => 'job/seeker-register',
                'jobs/apply'             => 'job/apply',

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
                    $response->headers->set('Access-Control-Allow-Headers', 'Content-Type, X-Requested-With');
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

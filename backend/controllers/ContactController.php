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

class ContactController extends Controller
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
     * POST /contact/submit  (also handles OPTIONS preflight)
     */
    public function actionSubmit(): Response
    {
        $this->setCorsHeaders();

        if (Yii::$app->request->method === 'OPTIONS') {
            return $this->asJson(['status' => 'ok']);
        }

        if (Yii::$app->request->method !== 'POST') {
            ErrorLog::write('server', 'contact/submit', 'Invalid HTTP method: ' . Yii::$app->request->method, [
                'origin'  => Yii::$app->request->headers->get('Origin', ''),
                'headers' => Yii::$app->request->headers->toArray(),
            ]);
            return $this->jsonError('Method not allowed.', 405);
        }

        Yii::$app->response->format = Response::FORMAT_JSON;

        $post = Yii::$app->request->post();

        $errors = $this->validateFields($post);
        if (!empty($errors)) {
            ErrorLog::write('validation', 'contact/submit', implode(' | ', $errors), [
                'fields' => array_map('strval', array_filter($post)),
            ]);
            return $this->asJson([
                'success' => false,
                'errors'  => $errors,
                'message' => $errors[0],
            ]);
        }

        $model = new CounselingRequest();
        $model->name        = trim($post['name']);
        $model->phone       = trim($post['phone']);
        $model->email       = trim($post['email'] ?? '') ?: null;
        $model->dob         = trim($post['dob'] ?? '') ?: null;
        $model->message     = trim($post['message'] ?? '') ?: null;
        $model->source_page = trim($post['source'] ?? '') ?: null;
        $model->status      = CounselingRequest::STATUS_NEW;

        if ($model->save(false)) {
            return $this->asJson([
                'success' => true,
                'message' => 'Request received! Our counselor will call you within 2 hours.',
            ]);
        }

        ErrorLog::write('database', 'contact/submit', 'Failed to save counseling request.', [
            'model_errors' => $model->getErrors(),
            'data'         => $model->getAttributes(),
        ]);

        return $this->asJson([
            'success' => false,
            'message' => 'Could not save your request. Please try again.',
            'errors'  => ['Database error.'],
        ]);
    }

    // ─── ADMIN ────────────────────────────────────────────────────────────────

    public function actionIndex(): string
    {
        $searchModel  = new CounselingRequestSearch();
        $dataProvider = $searchModel->search(Yii::$app->request->queryParams);

        return $this->render('index', [
            'searchModel'  => $searchModel,
            'dataProvider' => $dataProvider,
        ]);
    }

    public function actionView(int $id): string
    {
        return $this->render('view', ['model' => $this->findModel($id)]);
    }

    public function actionUpdateStatus(int $id): Response
    {
        Yii::$app->response->format = Response::FORMAT_JSON;
        $model  = $this->findModel($id);
        $status = (int) Yii::$app->request->post('status', $model->status);
        $model->status = $status;
        $model->save(false);
        return $this->asJson(['success' => true]);
    }

    // ─── HELPERS ─────────────────────────────────────────────────────────────

    private function findModel(int $id): CounselingRequest
    {
        $model = CounselingRequest::findOne($id);
        if (!$model) {
            throw new NotFoundHttpException('Lead not found.');
        }
        return $model;
    }

    private function validateFields(array $post): array
    {
        $errors = [];

        $name = trim($post['name'] ?? '');
        if ($name === '') {
            $errors[] = 'Full name is required.';
        } elseif (strlen($name) < 2) {
            $errors[] = 'Full name must be at least 2 characters.';
        } elseif (strlen($name) > 150) {
            $errors[] = 'Full name must not exceed 150 characters.';
        } elseif (!preg_match('/^[\p{L} .\'-]{2,150}$/u', $name)) {
            $errors[] = 'Please enter a valid name (letters, spaces, dot, hyphen).';
        }

        $phone = preg_replace('/\D+/', '', (string)($post['phone'] ?? ''));
        if ($phone === '') {
            $errors[] = 'Phone number is required.';
        } elseif (!preg_match('/^[6-9][0-9]{9}$/', $phone)) {
            $errors[] = 'Phone number must be a valid 10-digit Indian mobile number.';
        }

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

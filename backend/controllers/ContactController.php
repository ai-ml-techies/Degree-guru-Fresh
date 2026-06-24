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

    /**
     * POST /contact/submit
     */
    public function actionSubmit(): Response
    {
        Yii::$app->response->format = Response::FORMAT_JSON;

        if (!Yii::$app->request->isPost) {
            return $this->jsonError('Method not allowed.', 405);
        }

        $model = new CounselingRequest();

        $model->name = trim((string) Yii::$app->request->post('name', ''));
        $model->phone = trim((string) Yii::$app->request->post('phone', ''));
        $model->email = trim((string) Yii::$app->request->post('email', '')) ?: null;
        $model->dob = trim((string) Yii::$app->request->post('dob', '')) ?: null;
        $model->message = trim((string) Yii::$app->request->post('message', '')) ?: null;
        $model->source_page = trim((string) Yii::$app->request->post('source', '')) ?: null;
        $model->status = CounselingRequest::STATUS_NEW;

        if (!$model->validate()) {

            ErrorLog::write(
                'validation',
                'contact/submit',
                json_encode($model->getErrors()),
                [
                    'errors' => $model->getErrors(),
                ]
            );

            return $this->asJson([
                'success' => false,
                'message' => implode(', ', $model->getFirstErrors()),
                'errors' => $model->getErrors(),
            ]);
        }

        if (!$model->save(false)) {

            ErrorLog::write(
                'database',
                'contact/submit',
                'Failed to save counseling request.',
                [
                    'errors' => $model->getErrors(),
                    'data' => $model->getAttributes(),
                ]
            );

            return $this->asJson([
                'success' => false,
                'message' => 'Could not save your request. Please try again.',
            ]);
        }

        return $this->asJson([
            'success' => true,
            'message' => 'Request received! Our counselor will call you within 2 hours.',
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

<?php

declare(strict_types=1);

namespace app\controllers;

use app\models\ErrorLog;
use yii\filters\AccessControl;
use yii\web\Controller;

class ErrorLogController extends Controller
{
    public function behaviors(): array
    {
        return [
            'access' => [
                'class' => AccessControl::class,
                'rules' => [
                    [
                        'allow' => true,
                        'roles' => ['@'],
                    ],
                ],
            ],
        ];
    }

    public function actionIndex(): string
    {
        $logs = ErrorLog::find()->orderBy(['created_at' => SORT_DESC])->limit(200)->all();
        return $this->render('index', ['logs' => $logs]);
    }

    public function actionClear(): \yii\web\Response
    {
        ErrorLog::deleteAll();
        \Yii::$app->session->setFlash('success', 'All error logs cleared.');
        return $this->redirect(['index']);
    }
}

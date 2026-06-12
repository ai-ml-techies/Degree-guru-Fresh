<?php

declare(strict_types=1);

namespace app\controllers;

use Yii;
use app\models\Program;
use yii\filters\AccessControl;
use yii\web\Controller;
use yii\web\NotFoundHttpException;

class ProgramController extends Controller
{
    public function behaviors(): array
    {
        return [
            'access' => [
                'class' => AccessControl::class,
                'rules' => [['allow' => true, 'roles' => ['@']]],
            ],
        ];
    }

    // ─── List ─────────────────────────────────────────────────────────────────

    public function actionIndex(): string
    {
        $programs = Program::find()->orderBy(['sort_order' => SORT_ASC, 'id' => SORT_ASC])->all();

        $this->view->title = 'Programs';
        return $this->render('index', ['programs' => $programs]);
    }

    // ─── Create ───────────────────────────────────────────────────────────────

    public function actionCreate(): string|\yii\web\Response
    {
        $model = new Program();

        if (Yii::$app->request->isPost) {
            $post = Yii::$app->request->post('Program', []);

            // Convert textarea lines → JSON before loading into model
            $post['enroll_for']   = Program::linesToJson($post['enroll_for']   ?? '');
            $post['career_roles'] = Program::linesToJson($post['career_roles'] ?? '');

            $model->load(['Program' => $post], 'Program');

            if ($model->save()) {
                Yii::$app->session->setFlash('success', 'Program "' . $model->name . '" created successfully.');
                return $this->redirect(['/program/index']);
            }
        }

        $this->view->title = 'Add Program';
        return $this->render('_form', ['model' => $model, 'isNew' => true]);
    }

    // ─── Update ───────────────────────────────────────────────────────────────

    public function actionUpdate(int $id): string|\yii\web\Response
    {
        $model = $this->findModel($id);

        if (Yii::$app->request->isPost) {
            $post = Yii::$app->request->post('Program', []);

            $post['enroll_for']   = Program::linesToJson($post['enroll_for']   ?? '');
            $post['career_roles'] = Program::linesToJson($post['career_roles'] ?? '');

            $model->load(['Program' => $post], 'Program');

            if ($model->save()) {
                Yii::$app->session->setFlash('success', 'Program "' . $model->name . '" updated successfully.');
                return $this->redirect(['/program/index']);
            }
        }

        $this->view->title = "Edit: {$model->name}";
        return $this->render('_form', ['model' => $model, 'isNew' => false]);
    }

    // ─── Delete ───────────────────────────────────────────────────────────────

    public function actionDelete(int $id): \yii\web\Response
    {
        $model = $this->findModel($id);
        $name  = $model->name;
        $model->delete();

        Yii::$app->session->setFlash('success', 'Program "' . $name . '" deleted.');
        return $this->redirect(['/program/index']);
    }

    // ─── Toggle active ────────────────────────────────────────────────────────

    public function actionToggle(int $id): \yii\web\Response
    {
        $model = $this->findModel($id);
        $model->is_active = $model->is_active ? 0 : 1;
        $model->save(false);

        return $this->redirect(['/program/index']);
    }

    // ─── Private ──────────────────────────────────────────────────────────────

    private function findModel(int $id): Program
    {
        $model = Program::findOne($id);
        if (!$model) throw new NotFoundHttpException('Program not found.');
        return $model;
    }
}

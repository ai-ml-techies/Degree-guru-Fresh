<?php

declare(strict_types=1);

namespace app\controllers;

use Yii;
use app\models\JobEmployer;
use app\models\JobPosting;
use app\models\JobSeeker;
use app\models\JobApplication;
use app\models\ErrorLog;
use yii\filters\AccessControl;
use yii\web\Controller;
use yii\web\NotFoundHttpException;
use yii\web\Response;

class JobAdminController extends Controller
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

    // ─── Dashboard ───────────────────────────────────────────────────────────
    public function actionIndex(): string
    {
        $this->view->title = 'Jobs Dashboard';
        return $this->render('index', [
            'pendingEmployers' => JobEmployer::find()->where(['status' => JobEmployer::STATUS_PENDING])->count(),
            'pendingPostings'  => JobPosting::find()->where(['status'  => JobPosting::STATUS_PENDING])->count(),
            'totalSeekers'     => JobSeeker::find()->count(),
            'totalApplications'=> JobApplication::find()->count(),
            'recentPostings'   => JobPosting::find()->with('employer')->orderBy(['created_at' => SORT_DESC])->limit(5)->all(),
        ]);
    }

    // ─── Employers ───────────────────────────────────────────────────────────
    public function actionEmployers(): string
    {
        $this->view->title = 'Job Employers';
        $status = Yii::$app->request->get('status', '');
        $query  = JobEmployer::find()->orderBy(['created_at' => SORT_DESC]);
        if ($status !== '') $query->andWhere(['status' => (int)$status]);

        return $this->render('employers', [
            'employers' => $query->all(),
            'filter'    => $status,
        ]);
    }

    public function actionViewEmployer(int $id): string
    {
        $employer = $this->findEmployer($id);
        $this->view->title = 'Employer — ' . $employer->company_name;
        return $this->render('view-employer', [
            'employer' => $employer,
            'postings' => JobPosting::find()->where(['employer_id' => $id])->orderBy(['created_at' => SORT_DESC])->all(),
        ]);
    }

    public function actionApproveEmployer(int $id): Response
    {
        $employer = $this->findEmployer($id);
        $employer->status = JobEmployer::STATUS_APPROVED;
        $employer->save(false);
        Yii::$app->session->setFlash('success', 'Employer approved.');
        return $this->redirect(['view-employer', 'id' => $id]);
    }

    public function actionRejectEmployer(int $id): Response
    {
        $employer = $this->findEmployer($id);
        $employer->status = JobEmployer::STATUS_REJECTED;
        $employer->admin_note = trim(Yii::$app->request->post('note', ''));
        $employer->save(false);
        Yii::$app->session->setFlash('success', 'Employer rejected.');
        return $this->redirect(['view-employer', 'id' => $id]);
    }

    public function actionDownloadDoc(int $id): Response
    {
        $employer = $this->findEmployer($id);
        $path = Yii::getAlias('@webroot') . '/uploads/job-docs/' . $employer->document_filename;
        if (!is_file($path)) throw new NotFoundHttpException('Document not found.');
        return Yii::$app->response->sendFile($path, $employer->document_original);
    }

    // ─── Postings ─────────────────────────────────────────────────────────────
    public function actionPostings(): string
    {
        $this->view->title = 'Job Postings';
        $status = Yii::$app->request->get('status', '');
        $query  = JobPosting::find()->with('employer')->orderBy(['created_at' => SORT_DESC]);
        if ($status !== '') $query->andWhere(['job_postings.status' => (int)$status]);

        return $this->render('postings', [
            'postings' => $query->all(),
            'filter'   => $status,
        ]);
    }

    public function actionViewPosting(int $id): string
    {
        $posting = $this->findPosting($id);
        $this->view->title = 'Posting — ' . $posting->job_title;
        return $this->render('view-posting', [
            'posting'      => $posting,
            'applications' => JobApplication::find()
                ->with('seeker')
                ->where(['posting_id' => $id])
                ->orderBy(['created_at' => SORT_DESC])
                ->all(),
        ]);
    }

    public function actionApprovePosting(int $id): Response
    {
        $posting = $this->findPosting($id);
        $posting->status = JobPosting::STATUS_APPROVED;
        $posting->save(false);
        Yii::$app->session->setFlash('success', 'Job posting approved and is now live.');
        return $this->redirect(['view-posting', 'id' => $id]);
    }

    public function actionRejectPosting(int $id): Response
    {
        $posting = $this->findPosting($id);
        $posting->status     = JobPosting::STATUS_REJECTED;
        $posting->admin_note = trim(Yii::$app->request->post('note', ''));
        $posting->save(false);
        Yii::$app->session->setFlash('success', 'Job posting rejected.');
        return $this->redirect(['view-posting', 'id' => $id]);
    }

    public function actionDeletePosting(int $id): Response
    {
        $this->findPosting($id)->delete();
        Yii::$app->session->setFlash('success', 'Posting deleted.');
        return $this->redirect(['postings']);
    }

    // ─── Seekers ──────────────────────────────────────────────────────────────
    public function actionSeekers(): string
    {
        $this->view->title = 'Job Seekers';
        return $this->render('seekers', [
            'seekers' => JobSeeker::find()->orderBy(['created_at' => SORT_DESC])->all(),
        ]);
    }

    // ─── Applications ─────────────────────────────────────────────────────────
    public function actionApplications(): string
    {
        $this->view->title = 'Applications';
        return $this->render('applications', [
            'applications' => JobApplication::find()
                ->with(['seeker', 'posting', 'posting.employer'])
                ->orderBy(['created_at' => SORT_DESC])
                ->all(),
        ]);
    }

    public function actionUpdateAppStatus(int $id): Response
    {
        $app = JobApplication::findOne($id);
        if (!$app) throw new NotFoundHttpException('Application not found.');
        $app->status = (int)Yii::$app->request->post('status', $app->status);
        $app->save(false);
        Yii::$app->session->setFlash('success', 'Application status updated.');
        return $this->redirect(['view-posting', 'id' => $app->posting_id]);
    }

    // ─── Helpers ──────────────────────────────────────────────────────────────
    private function findEmployer(int $id): JobEmployer
    {
        $m = JobEmployer::findOne($id);
        if (!$m) throw new NotFoundHttpException('Employer not found.');
        return $m;
    }

    private function findPosting(int $id): JobPosting
    {
        $m = JobPosting::findOne($id);
        if (!$m) throw new NotFoundHttpException('Posting not found.');
        return $m;
    }
}

<?php

declare(strict_types=1);

namespace app\controllers;

use Yii;
use app\models\SiteSetting;
use app\models\Program;
use yii\web\Controller;
use yii\web\Response;

/**
 * Public JSON API consumed by the React frontend.
 * No auth required — data is public read-only.
 */
class ApiController extends Controller
{
    public $enableCsrfValidation = false;

    public function beforeAction($action): bool
    {
        Yii::$app->response->format = Response::FORMAT_JSON;
        if (Yii::$app->request->method === 'OPTIONS') {
            Yii::$app->response->statusCode = 200;
            Yii::$app->response->data = ['status' => 'ok'];
            Yii::$app->response->send();
            Yii::$app->end();
        }
        return parent::beforeAction($action);
    }

    // GET /api/home  → all home-page settings as { key: value, ... }
    public function actionHome(): array
    {
        return SiteSetting::getAll();
    }

    // GET /api/programs  → active programs ordered by sort_order
    public function actionPrograms(): array
    {
        $programs = Program::findActive()->all();

        return array_map(function (Program $p) {
            return [
                'id'            => $p->id,
                'slug'          => $p->slug,
                'name'          => $p->name,
                'full'          => $p->full_name,
                'level'         => $p->level,
                'desc'          => $p->desc,
                'tagline'       => $p->tagline,
                'about'         => $p->about,
                'enrollFor'     => $p->getEnrollForArray(),
                'emiNote'       => $p->emi_note,
                'careerRoles'   => $p->getCareerRolesArray(),
                'careerSalary'  => $p->career_salary,
                'metaTitle'     => $p->meta_title,
                'metaDesc'      => $p->meta_desc,
                'ogImage'       => $p->og_image,
                'focusKeyword'  => $p->focus_keyword,
            ];
        }, $programs);
    }
}

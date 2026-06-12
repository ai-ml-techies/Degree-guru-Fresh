<?php

declare(strict_types=1);

namespace app\models;

use yii\base\Model;
use yii\data\ActiveDataProvider;

class CounselingRequestSearch extends CounselingRequest
{
    public function rules(): array
    {
        return [
            [['name', 'email', 'phone', 'source_page'], 'safe'],
            [['status'], 'integer'],
        ];
    }

    public function scenarios(): array
    {
        return Model::scenarios();
    }

    public function search(array $params): ActiveDataProvider
    {
        $query = CounselingRequest::find();

        $dataProvider = new ActiveDataProvider([
            'query'      => $query,
            'sort'       => ['defaultOrder' => ['created_at' => SORT_DESC]],
            'pagination' => ['pageSize' => 25],
        ]);

        $this->load($params);

        if (!$this->validate()) {
            return $dataProvider;
        }

        $query
            ->andFilterWhere(['like', 'name',        $this->name])
            ->andFilterWhere(['like', 'email',        $this->email])
            ->andFilterWhere(['like', 'phone',        $this->phone])
            ->andFilterWhere(['like', 'source_page',  $this->source_page])
            ->andFilterWhere(['=',    'status',       $this->status]);

        return $dataProvider;
    }
}

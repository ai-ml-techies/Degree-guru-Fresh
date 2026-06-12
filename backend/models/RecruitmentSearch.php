<?php

declare(strict_types=1);

namespace app\models;

use yii\base\Model;
use yii\data\ActiveDataProvider;

class RecruitmentSearch extends Recruitment
{
    public function rules(): array
    {
        return [
            [['name', 'email', 'phone', 'industry', 'country', 'city', 'experience'], 'safe'],
        ];
    }

    public function scenarios(): array
    {
        return Model::scenarios();
    }

    public function search(array $params): ActiveDataProvider
    {
        $query = Recruitment::find();

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
            ->andFilterWhere(['like', 'name',       $this->name])
            ->andFilterWhere(['like', 'email',      $this->email])
            ->andFilterWhere(['like', 'phone',      $this->phone])
            ->andFilterWhere(['like', 'industry',   $this->industry])
            ->andFilterWhere(['like', 'country',    $this->country])
            ->andFilterWhere(['like', 'city',       $this->city])
            ->andFilterWhere(['like', 'experience', $this->experience]);

        return $dataProvider;
    }
}

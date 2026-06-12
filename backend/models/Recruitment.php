<?php

declare(strict_types=1);

namespace app\models;

use yii\db\ActiveRecord;

class Recruitment extends ActiveRecord
{
    public static function tableName(): string
    {
        return 'recruitment';
    }

    public function rules(): array
    {
        return [
            [['name', 'phone', 'dob', 'country', 'state', 'city', 'industry', 'resume_filename', 'resume_original'], 'required'],
            [['name'], 'string', 'max' => 100],
            [['email'], 'email'],
            [['email', 'resume_filename', 'resume_original'], 'string', 'max' => 255],
            [['phone'], 'string', 'max' => 20],
            [['country', 'state', 'city', 'industry'], 'string', 'max' => 100],
            [['experience'], 'string', 'max' => 100],
            [['dob'], 'date', 'format' => 'php:Y-m-d'],
            [['email', 'experience'], 'default', 'value' => ''],
        ];
    }

    public function attributeLabels(): array
    {
        return [
            'id'              => 'ID',
            'name'            => 'Full Name',
            'email'           => 'Email',
            'phone'           => 'Phone',
            'dob'             => 'Date of Birth',
            'country'         => 'Country',
            'state'           => 'State',
            'city'            => 'City',
            'industry'        => 'Industry',
            'experience'      => 'Experience',
            'resume_filename' => 'Resume File',
            'resume_original' => 'Resume Name',
            'created_at'      => 'Submitted At',
        ];
    }
}

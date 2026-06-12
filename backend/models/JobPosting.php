<?php

declare(strict_types=1);

namespace app\models;

use yii\db\ActiveRecord;

class JobPosting extends ActiveRecord
{
    public const STATUS_PENDING  = 0;
    public const STATUS_APPROVED = 1;
    public const STATUS_REJECTED = 2;

    public const WORK_TYPES = [
        'full-time'  => 'Full Time',
        'part-time'  => 'Part Time',
        'internship' => 'Internship',
        'remote'     => 'Remote',
        'hybrid'     => 'Hybrid',
    ];

    public static function tableName(): string
    {
        return 'job_postings';
    }

    public function rules(): array
    {
        return [
            [['employer_id', 'job_title', 'job_category', 'job_location', 'work_type', 'job_description'], 'required'],
            [['job_title', 'job_location'], 'string', 'max' => 200],
            [['job_category', 'experience_required', 'salary_range', 'industry'], 'string', 'max' => 100],
            [['work_type'], 'in', 'range' => array_keys(self::WORK_TYPES)],
            [['skills_required', 'job_description', 'admin_note'], 'string'],
            [['apply_link'], 'string', 'max' => 255],
            [['openings'], 'integer', 'min' => 1],
            [['employer_id', 'status'], 'integer'],
            [['status'], 'default', 'value' => self::STATUS_PENDING],
            [['openings'], 'default', 'value' => 1],
            [['experience_required', 'salary_range', 'industry', 'skills_required', 'apply_link', 'admin_note'], 'default', 'value' => ''],
        ];
    }

    public function attributeLabels(): array
    {
        return [
            'id'                  => 'ID',
            'employer_id'         => 'Employer',
            'job_title'           => 'Job Title',
            'job_category'        => 'Category',
            'job_location'        => 'Location',
            'work_type'           => 'Work Type',
            'experience_required' => 'Experience',
            'salary_range'        => 'Salary Range',
            'industry'            => 'Industry',
            'skills_required'     => 'Skills',
            'job_description'     => 'Description',
            'openings'            => 'Openings',
            'apply_link'          => 'External Apply Link',
            'status'              => 'Status',
            'created_at'          => 'Posted At',
        ];
    }

    public function getEmployer(): \yii\db\ActiveQuery
    {
        return $this->hasOne(JobEmployer::class, ['id' => 'employer_id']);
    }

    public function getApplications(): \yii\db\ActiveQuery
    {
        return $this->hasMany(JobApplication::class, ['posting_id' => 'id']);
    }

    public static function statusLabel(int $status): string
    {
        return match ($status) {
            self::STATUS_APPROVED => 'Approved',
            self::STATUS_REJECTED => 'Rejected',
            default               => 'Pending Review',
        };
    }

    public static function statusColor(int $status): array
    {
        return match ($status) {
            self::STATUS_APPROVED => ['bg' => '#d1fae5', 'text' => '#059669'],
            self::STATUS_REJECTED => ['bg' => '#fee2e2', 'text' => '#dc2626'],
            default               => ['bg' => '#fef3c7', 'text' => '#d97706'],
        };
    }

    public function workTypeLabel(): string
    {
        return self::WORK_TYPES[$this->work_type] ?? ucfirst($this->work_type);
    }
}

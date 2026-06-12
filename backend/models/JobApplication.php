<?php

declare(strict_types=1);

namespace app\models;

use yii\db\ActiveRecord;

class JobApplication extends ActiveRecord
{
    public const STATUS_APPLIED      = 0;
    public const STATUS_SHORTLISTED  = 1;
    public const STATUS_REJECTED     = 2;

    public static function tableName(): string
    {
        return 'job_applications';
    }

    public function rules(): array
    {
        return [
            [['posting_id', 'seeker_id'], 'required'],
            [['posting_id', 'seeker_id', 'status'], 'integer'],
            [['status'], 'default', 'value' => self::STATUS_APPLIED],
        ];
    }

    public function attributeLabels(): array
    {
        return [
            'id'         => 'ID',
            'posting_id' => 'Job Posting',
            'seeker_id'  => 'Applicant',
            'status'     => 'Status',
            'created_at' => 'Applied At',
        ];
    }

    public function getPosting(): \yii\db\ActiveQuery
    {
        return $this->hasOne(JobPosting::class, ['id' => 'posting_id']);
    }

    public function getSeeker(): \yii\db\ActiveQuery
    {
        return $this->hasOne(JobSeeker::class, ['id' => 'seeker_id']);
    }

    public static function statusLabel(int $status): string
    {
        return match ($status) {
            self::STATUS_SHORTLISTED => 'Shortlisted',
            self::STATUS_REJECTED    => 'Rejected',
            default                  => 'Applied',
        };
    }

    public static function statusColor(int $status): array
    {
        return match ($status) {
            self::STATUS_SHORTLISTED => ['bg' => '#d1fae5', 'text' => '#059669'],
            self::STATUS_REJECTED    => ['bg' => '#fee2e2', 'text' => '#dc2626'],
            default                  => ['bg' => '#dbeafe', 'text' => '#2563eb'],
        };
    }
}

<?php

declare(strict_types=1);

namespace app\models;

use yii\db\ActiveRecord;

class CounselingRequest extends ActiveRecord
{
    public const STATUS_NEW         = 0;
    public const STATUS_CONTACTED   = 1;
    public const STATUS_ENROLLED    = 2;
    public const STATUS_NOT_INTERESTED = 3;

    public static function tableName(): string
    {
        return 'counseling_requests';
    }

    public function rules(): array
    {
        return [
            [['name', 'phone'], 'required'],
            [['name'], 'string', 'max' => 150],
            [['phone'], 'string', 'max' => 30],
            [['email'], 'email'],
            [['email', 'resume_path', 'source_page'], 'string', 'max' => 255],
            [['message'], 'string'],
            [['dob'], 'date', 'format' => 'php:Y-m-d'],
            [['status'], 'integer'],
            [['email', 'dob', 'message', 'resume_path', 'source_page'], 'default', 'value' => null],
            [['status'], 'default', 'value' => self::STATUS_NEW],
        ];
    }

    public function attributeLabels(): array
    {
        return [
            'id'          => 'ID',
            'name'        => 'Full Name',
            'email'       => 'Email',
            'phone'       => 'Phone',
            'dob'         => 'Date of Birth',
            'message'     => 'Message',
            'source_page' => 'Source Page',
            'status'      => 'Status',
            'created_at'  => 'Submitted At',
        ];
    }

    public static function statusLabel(int $status): string
    {
        return match ($status) {
            self::STATUS_CONTACTED      => 'Contacted',
            self::STATUS_ENROLLED       => 'Enrolled',
            self::STATUS_NOT_INTERESTED => 'Not Interested',
            default                     => 'New',
        };
    }

    public static function statusColor(int $status): array
    {
        return match ($status) {
            self::STATUS_CONTACTED      => ['bg' => '#dbeafe', 'text' => '#2563eb'],
            self::STATUS_ENROLLED       => ['bg' => '#d1fae5', 'text' => '#059669'],
            self::STATUS_NOT_INTERESTED => ['bg' => '#fee2e2', 'text' => '#dc2626'],
            default                     => ['bg' => '#fef3c7', 'text' => '#d97706'],
        };
    }
}

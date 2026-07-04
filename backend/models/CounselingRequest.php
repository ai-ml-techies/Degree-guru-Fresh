<?php

declare(strict_types=1);

namespace app\models;

use app\validators\AppValidator;
use yii\db\ActiveRecord;

class CounselingRequest extends ActiveRecord
{
    public const STATUS_NEW = 0;
    public const STATUS_CONTACTED = 1;
    public const STATUS_ENROLLED = 2;
    public const STATUS_NOT_INTERESTED = 3;

    private const STATUS_CONFIG = [
        self::STATUS_NEW => [
            'label' => 'New',
            'bg' => '#fef3c7',
            'text' => '#d97706',
        ],
        self::STATUS_CONTACTED => [
            'label' => 'Contacted',
            'bg' => '#dbeafe',
            'text' => '#2563eb',
        ],
        self::STATUS_ENROLLED => [
            'label' => 'Enrolled',
            'bg' => '#d1fae5',
            'text' => '#059669',
        ],
        self::STATUS_NOT_INTERESTED => [
            'label' => 'Not Interested',
            'bg' => '#fee2e2',
            'text' => '#dc2626',
        ],
    ];

    public static function tableName(): string
    {
        return 'counseling_requests';
    }

    public function rules(): array
    {
        return [
            [['name', 'phone','email', 'dob', 'message'], 'required'],

            [['name'], 'string', 'max' => 150],
            [['message'], 'string'],
            [['status'], 'integer'],

            [['email', 'resume_path', 'source_page'], 'string', 'max' => 255],

            [['dob'], 'date', 'format' => 'php:Y-m-d'],
            // Phone numbers are stored as strings; enforce max length 10 (digits)
            [['phone'], 'string', 'max' => 10],
            [['name'], 'validateNameField'],
    
            [['email'], 'validateEmailField'],
            [['email'], 'validateUniqueEmailField'],
            [['phone'], 'validatePhoneField'],
            [['dob'], 'validateDobField'],

            [['email', 'dob', 'message', 'resume_path', 'source_page'], 'default', 'value' => null],
            [['status'], 'default', 'value' => self::STATUS_NEW],
        ];
    }

    public function validateEmailField(string $attribute): void
    {
        AppValidator::validateEmail($this, $attribute);
    }

    public function validatePhoneField(string $attribute): void
    {
        AppValidator::validatePhone($this, $attribute);
    }

    public function validateNameField(string $attribute): void
    {
        AppValidator::validateName($this, $attribute);
    }

    public function validateUniqueEmailField(string $attribute): void
    {
        AppValidator::validateUniqueEmail(
            $this,
            $attribute,
            self::class
        );
    }

    public function validateDobField(string $attribute): void
    {
        AppValidator::validateDob(
            $this,
            $attribute
        );
    }

    public function attributeLabels(): array
    {
        return [
            'id' => 'ID',
            'name' => 'Full Name',
            'email' => 'Email',
            'phone' => 'Phone',
            'dob' => 'Date of Birth',
            'message' => 'Message',
            'source_page' => 'Source Page',
            'status' => 'Status',
            'created_at' => 'Submitted At',
        ];
    }

    public static function statusLabel(int $status): string
    {
        return self::STATUS_CONFIG[$status]['label'] ?? 'New';
    }

    public static function statusColor(int $status): array
    {
        return [
            'bg' => self::STATUS_CONFIG[$status]['bg'] ?? '#fef3c7',
            'text' => self::STATUS_CONFIG[$status]['text'] ?? '#d97706',
        ];
    }
}
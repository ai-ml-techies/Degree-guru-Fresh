<?php

declare(strict_types=1);

namespace app\models;

use yii\db\ActiveRecord;

class JobEmployer extends ActiveRecord
{
    public const STATUS_PENDING  = 0;
    public const STATUS_APPROVED = 1;
    public const STATUS_REJECTED = 2;

    public static function tableName(): string
    {
        return 'job_employers';
    }

    public function rules(): array
    {
                return [
                        [['company_name', 'company_industry', 'document_filename', 'document_original',
                            'contact_name', 'contact_phone', 'contact_email'], 'required'],
                        [['company_name', 'contact_name'], 'string', 'max' => 200],
                        [['company_industry', 'contact_designation', 'employee_count'], 'string', 'max' => 100],
                        [['company_website', 'document_filename', 'document_original', 'contact_email'], 'string', 'max' => 255],
                        [['contact_phone'], 'string', 'max' => 20],
                        [['company_address', 'admin_note'], 'string'],
                        [['contact_email'], 'email'],
                        [['status'], 'integer'],
                        [['status'], 'default', 'value' => self::STATUS_PENDING],
                        [['company_website', 'contact_designation', 'employee_count', 'company_address', 'admin_note'], 'default', 'value' => ''],
                        // Custom validators
                        ['contact_phone', 'validateIndianPhone'],
                        ['contact_name', 'validateName'],
                        ['contact_email', 'validateDisposableEmail'],
                        [['contact_password_hash', 'password_reset_token', 'contact_email_verified', 'contact_email_verification_token'], 'safe'],
                ];
    }

    public function attributeLabels(): array
    {
        return [
            'id'                   => 'ID',
            'company_name'         => 'Company Name',
            'company_industry'     => 'Industry',
            'employee_count'       => 'Employee Count',
            'company_address'      => 'Address',
            'company_website'      => 'Website',
            'document_filename'    => 'Document',
            'document_original'    => 'Document Name',
            'contact_name'         => 'Contact Name',
            'contact_phone'        => 'Phone',
            'contact_email'        => 'Email',
            'contact_designation'  => 'Designation',
            'status'               => 'Status',
            'created_at'           => 'Submitted At',
        ];
    }

    public function getPostings(): \yii\db\ActiveQuery
    {
        return $this->hasMany(JobPosting::class, ['employer_id' => 'id']);
    }

    public static function statusLabel(int $status): string
    {
        return match ($status) {
            self::STATUS_APPROVED => 'Approved',
            self::STATUS_REJECTED => 'Rejected',
            default               => 'Pending',
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

    public function validateIndianPhone($attribute): void
    {
        $val = preg_replace('/\D+/', '', (string)$this->$attribute);
        if ($val === '') {
            $this->addError($attribute, 'Phone number is required.');
            return;
        }
        if (!preg_match('/^[6-9][0-9]{9}$/', $val)) {
            $this->addError($attribute, 'Enter a valid 10-digit Indian mobile number.');
        }
    }

    public function validateName($attribute): void
    {
        $val = trim((string)$this->$attribute);
        if ($val === '' || mb_strlen($val) < 2) {
            $this->addError($attribute, 'Name is required (min 2 characters).');
            return;
        }
        if (!preg_match('/^[\p{L} .\'-]{2,150}$/u', $val)) {
            $this->addError($attribute, 'Please enter a valid name (letters, spaces, dot, hyphen).');
        }
    }

    public function validateDisposableEmail($attribute): void
    {
        $email = trim((string)$this->$attribute);
        if ($email === '') {
            $this->addError($attribute, 'Email is required.');
            return;
        }
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $this->addError($attribute, 'Please enter a valid email address.');
            return;
        }
        $blocked = [
            'mailinator.com','10minutemail.com','tempmail.com','maildrop.cc','yopmail.com','guerrillamail.com'
        ];
        $domain = strtolower(substr(strrchr($email, '@'), 1));
        if (in_array($domain, $blocked, true)) {
            $this->addError($attribute, 'Disposable email addresses are not allowed.');
        }
    }
}

<?php

declare(strict_types=1);

namespace app\models;

use yii\db\ActiveRecord;

class JobSeeker extends ActiveRecord
{
    public static function tableName(): string
    {
        return 'job_seekers';
    }

    public function rules(): array
    {
        return [
                        [['full_name', 'email', 'phone'], 'required'],
                        [['full_name'], 'string', 'max' => 150],
                        [['email', 'resume_filename', 'resume_original', 'linkedin_url'], 'string', 'max' => 255],
                        [['phone'], 'string', 'max' => 20],
                        [['city', 'qualification', 'experience', 'preferred_industry'], 'string', 'max' => 100],
                        [['skills'], 'string'],
                        [['email'], 'email'],
                        [['city', 'qualification', 'experience', 'preferred_industry', 'skills',
                            'linkedin_url', 'resume_filename', 'resume_original'], 'default', 'value' => ''],
                        ['phone', 'validateIndianPhone'],
                        ['full_name', 'validateName'],
                        ['email', 'validateDisposableEmail'],
                        [['password_hash', 'password_reset_token', 'email_verified', 'email_verification_token'], 'safe'],
        ];
    }

    public function attributeLabels(): array
    {
        return [
            'id'                  => 'ID',
            'full_name'           => 'Full Name',
            'email'               => 'Email',
            'phone'               => 'Phone',
            'city'                => 'City',
            'qualification'       => 'Highest Qualification',
            'experience'          => 'Experience',
            'preferred_industry'  => 'Preferred Industry',
            'skills'              => 'Skills',
            'linkedin_url'        => 'LinkedIn URL',
            'resume_filename'     => 'Resume',
            'resume_original'     => 'Resume Name',
            'created_at'          => 'Registered At',
        ];
    }

    public function getApplications(): \yii\db\ActiveQuery
    {
        return $this->hasMany(JobApplication::class, ['seeker_id' => 'id']);
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

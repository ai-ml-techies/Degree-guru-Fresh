<?php

namespace app\validators;

use yii\base\Model;

class AppValidator
{
    /**
     * Validate  Mobile Number
     */
    public static function validatePhone(Model $model, string $attribute): void
    {
        $phone = preg_replace('/\D/', '', (string)$model->$attribute);

        if (!preg_match('/^[6-9]\d{9}$/', $phone)) {
            $model->addError(
                $attribute,
                'Please enter a valid 10-digit  mobile number.'
            );
        }
    }

    /**
     * Validate Email Address
     */
    public static function validateEmail(Model $model, string $attribute): void
    {
        $email = trim(strtolower((string)$model->$attribute));

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $model->addError(
                $attribute,
                'Please enter a valid email address.'
            );
            return;
        }

        $blockedDomains = [
            'mailinator.com',
            'tempmail.com',
            '10minutemail.com',
            'guerrillamail.com',
            'yopmail.com',
            'temp-mail.org',
            'dyleris.com'
        ];

        $domain = substr(strrchr($email, '@'), 1);

        if (in_array($domain, $blockedDomains)) {
            $model->addError(
                $attribute,
                'Temporary email addresses are not allowed.'
            );
        }

        // Ensure the email domain actually accepts mail: check MX or A/AAAA records.
        // This prevents typos like user@bmail.com from being accepted when the domain
        // doesn't resolve for mail delivery.
        // Use checkdnsrr when available; fall back to dns_get_record.
        $hasMail = false;
        if (function_exists('checkdnsrr')) {
            if (checkdnsrr($domain, 'MX') || checkdnsrr($domain, 'A') || checkdnsrr($domain, 'AAAA')) {
                $hasMail = true;
            }
        } elseif (function_exists('dns_get_record')) {
            $records = @dns_get_record($domain, DNS_MX | DNS_A | DNS_AAAA);
            if (!empty($records)) {
                $hasMail = true;
            }
        }

        if (!$hasMail) {
            $model->addError(
                $attribute,
                'Email domain does not appear to accept mail. Please use a valid email address.'
            );
        }
    }

    /**
     * Check Duplicate Email
     */
    public static function validateUniqueEmail(
        Model $model,
        string $attribute,
        string $className,
        string $column = 'email'
    ): void {
        if ($className::find()->where([$column => $model->$attribute])->exists()) {
            $model->addError(
                $attribute,
                'This email already exists.'
            );
        }
    }

    public static function validateDob(Model $model, string $attribute): void
    {
        if (!empty($model->$attribute)) {
            $dob = strtotime($model->$attribute);
            $today = strtotime(date('Y-m-d'));

            if ($dob > $today) {
                $model->addError($attribute, 'Date of Birth cannot be a future date.');
            }
        }
    }

    /**
     * Validate Name fields: ensure at least 2 characters and no digits.
     */
    public static function validateName(Model $model, string $attribute): void
    {
        $name = trim((string)$model->$attribute);
        if (mb_strlen($name) < 2) {
            $model->addError($attribute, 'Please enter your full name.');
            return;
        }

        // Allow letters (unicode), spaces and common name punctuation, but disallow digits
        if (!preg_match('/^[\p{L} .\'-]{2,}$/u', $name)) {
            $model->addError($attribute, 'Name contains invalid characters.');
        }
    }
}

<?php

namespace app\validators;

use yii\base\Model;

class AppValidator
{
    /**
     * Validate Mobile Number:
     * - Indian numbers (10 digits or prefixed with +91/91/0) MUST start with 6, 7, 8, or 9.
     * - Indian numbers NEVER start with 0, 1, 2, 3, 4, or 5.
     * - Rejects repetitive digits (e.g. 9999999999) and sequential dummy numbers.
     * - Supports international formats (7 to 15 digits).
     */
    public static function validatePhone(Model $model, string $attribute): void
    {
        $raw = (string)$model->$attribute;
        $digits = preg_replace('/\D/', '', $raw);

        if (empty($digits)) {
            $model->addError($attribute, 'Please enter your mobile number.');
            return;
        }

        // Normalize Indian phone numbers:
        // 12 digits starting with 91 -> strip 91
        // 11 digits starting with 0 -> strip 0
        $clean10 = $digits;
        if (strlen($digits) === 12 && str_starts_with($digits, '91')) {
            $clean10 = substr($digits, 2);
        } elseif (strlen($digits) === 11 && str_starts_with($digits, '0')) {
            $clean10 = substr($digits, 1);
        }

        if (strlen($clean10) === 10) {
            $firstDigit = $clean10[0];

            if (in_array($firstDigit, ['0', '1', '2', '3', '4', '5'], true)) {
                $model->addError(
                    $attribute,
                    "Indian mobile numbers cannot start with '{$firstDigit}'. They must start with 6, 7, 8, or 9."
                );
                return;
            }

            if (!preg_match('/^[6-9]\d{9}$/', $clean10)) {
                $model->addError(
                    $attribute,
                    'Please enter a valid 10-digit Indian mobile number starting with 6, 7, 8, or 9.'
                );
                return;
            }

            // Reject all identical digits (e.g. 9999999999)
            if (preg_match('/^(\d)\1{9}$/', $clean10)) {
                $model->addError(
                    $attribute,
                    'Please enter a genuine mobile number, not repetitive digits.'
                );
                return;
            }

            // Reject dummy sequences
            $dummyNumbers = [
                '9876543210', '9876543211', '9876543212', '8765432109',
                '7890123456', '6789012345', '9898989898', '9797979797',
                '9191919191', '9090909090'
            ];
            if (in_array($clean10, $dummyNumbers, true)) {
                $model->addError(
                    $attribute,
                    'Please enter a genuine personal mobile number.'
                );
                return;
            }

            return;
        }

        // For international numbers with country code prefix (7 to 15 digits total)
        if (strlen($digits) < 7 || strlen($digits) > 15) {
            $model->addError(
                $attribute,
                'Please enter a valid mobile number (7 to 15 digits).'
            );
        }
    }

    /**
     * Validate Full Name:
     * - Rejects keyboard mashing (e.g. "dafklahslf", "asdfghjkl", "qwerty").
     * - Rejects placeholder/dummy names ("test", "dummy", "admin", "fake", "xyz", "abc").
     * - Requires at least 2 characters, vowels in words, and proper structure.
     */
    public static function validateName(Model $model, string $attribute): void
    {
        $name = trim((string)$model->$attribute);

        if (mb_strlen($name) < 2) {
            $model->addError($attribute, 'Full name must be at least 2 characters long.');
            return;
        }

        if (mb_strlen($name) > 70) {
            $model->addError($attribute, 'Full name cannot exceed 70 characters.');
            return;
        }

        // Allow letters (unicode), spaces, hyphens, and apostrophes
        if (!preg_match('/^[\p{L}\s.\'-]+$/u', $name)) {
            $model->addError($attribute, 'Full name can only contain letters and spaces.');
            return;
        }

        $lower = mb_strtolower($name);

        // Dummy names blacklist
        $dummyNames = [
            'test', 'testing', 'tester', 'dummy', 'admin', 'administrator',
            'fake', 'fakename', 'sample', 'user', 'guest', 'someone',
            'nobody', 'null', 'undefined', 'na', 'n/a', 'unknown',
            'demo', 'xyz', 'abc', 'asdf', 'qwerty', 'temp', 'foo',
            'bar', 'baz', 'none', 'noname', 'student', 'name', 'yourname'
        ];

        $words = preg_split('/\s+/', $lower, -1, PREG_SPLIT_NO_EMPTY);
        foreach ($words as $w) {
            $cleanWord = preg_replace('/[^a-z]/', '', $w);
            if (in_array($cleanWord, $dummyNames, true)) {
                $model->addError($attribute, "Please enter your genuine full name, not a placeholder like '{$w}'.");
                return;
            }
        }

        // Check for 3+ identical consecutive characters
        if (preg_match('/(.)\1{2,}/i', $lower)) {
            $model->addError($attribute, 'Name cannot contain repetitive characters.');
            return;
        }

        // Keyboard sequences (4+ characters)
        $keyboardSeqs = [
            'asdf', 'sdfg', 'dfgh', 'fghj', 'ghjk', 'hjkl', 'lkjh', 'kjhg', 'jhgf', 'hgfd', 'gfds', 'fdsa',
            'qwer', 'wert', 'erty', 'rtyu', 'tyui', 'yuio', 'uiop', 'poiu', 'oiuy', 'iuyt', 'uytr', 'ytre',
            'trew', 'rewq', 'zxcv', 'xcvb', 'cvbn', 'vbnm', 'mnbv', 'nbvc', 'bvcx', 'vcxz',
            'qazw', 'wsxe', 'edcr', 'rfvt', 'tgby'
        ];
        $strippedAlpha = preg_replace('/[^a-z]/', '', $lower);
        foreach ($keyboardSeqs as $seq) {
            if (str_contains($strippedAlpha, $seq)) {
                $model->addError($attribute, 'Please enter a genuine name, not keyboard mashing.');
                return;
            }
        }

        // Home-row mash detection (e.g. "dafklahslf" - all characters from 'asdfghjkl')
        $homeRowPattern = '/^[asdfghjkl]+$/';
        foreach ($words as $w) {
            $cleanWord = preg_replace('/[^a-z]/', '', $w);
            if (strlen($cleanWord) >= 6 && preg_match($homeRowPattern, $cleanWord)) {
                // Home row exclusively with 3+ consonants at the end or no vowel balance
                if (preg_match('/[bcdfghjklmnpqrstvwxz]{3,}$/i', $cleanWord) || !preg_match('/[aeiouy]/i', $cleanWord)) {
                    $model->addError($attribute, 'Please enter a valid, meaningful name (avoid random characters).');
                    return;
                }
            }
        }

        // Word vowel & structure check
        foreach ($words as $w) {
            $cleanWord = preg_replace('/[^a-z]/', '', $w);
            if (strlen($cleanWord) >= 2 && !preg_match('/[aeiouy]/i', $cleanWord)) {
                $model->addError($attribute, "Please enter a valid, meaningful name containing vowels.");
                return;
            }
            if (preg_match('/[bcdfghjklmnpqrstvwxz]{5,}/i', $cleanWord)) {
                $model->addError($attribute, 'Please enter a valid, meaningful name.');
                return;
            }
            if (strlen($cleanWord) >= 5 && preg_match('/[bcdfghjklmnpqrstvwxz]{4,}$/i', $cleanWord)) {
                $model->addError($attribute, 'Please enter a valid, meaningful name (e.g. Rahul Sharma).');
                return;
            }
        }
    }

    /**
     * Validate Email Address:
     * - Must be valid RFC format.
     * - Rejects disposable / temporary domains.
     * - Rejects dummy / test domains.
     * - Rejects dummy usernames.
     * - Validates MX / DNS records.
     */
    public static function validateEmail(Model $model, string $attribute): void
    {
        $email = trim(strtolower((string)$model->$attribute));

        if (empty($email)) {
            $model->addError($attribute, 'Please enter your email address.');
            return;
        }

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $model->addError($attribute, 'Please enter a valid email address (e.g. name@gmail.com).');
            return;
        }

        $parts = explode('@', $email);
        if (count($parts) !== 2) {
            $model->addError($attribute, 'Please enter a valid email address.');
            return;
        }

        $username = $parts[0];
        $domain = $parts[1];

        // Dummy usernames
        $dummyUsernames = [
            'test', 'testing', 'admin', 'fake', 'dummy', 'sample', 'user',
            'guest', 'asdf', 'qwerty', 'abc', 'xyz', 'temp', 'noemail',
            'none', 'null', 'dafklahslf'
        ];
        $cleanUsername = preg_replace('/[^a-z0-9]/', '', $username);
        if (in_array($cleanUsername, $dummyUsernames, true)) {
            $model->addError($attribute, 'Please enter a genuine personal email address, not a test account.');
            return;
        }

        if (preg_match('/^(\w)\1{3,}$/', $cleanUsername)) {
            $model->addError($attribute, 'Please enter a genuine email address, not repetitive characters.');
            return;
        }

        // Disposable domains
        $disposableDomains = [
            'mailinator.com', 'tempmail.com', '10minutemail.com', 'guerrillamail.com',
            'guerrillamail.net', 'guerrillamail.org', 'yopmail.com', 'trashmail.com',
            'temp-mail.org', 'dyleris.com', 'dispostable.com', 'maildrop.cc',
            'getnada.com', 'mailnesia.com', 'throwawaymail.com', 'burnermail.io',
            'sharklasers.com', 'fakemailgenerator.com', 'inboxkitten.com',
            'mohmal.com', 'crazymailing.com', 'nada.ltd', 'dropmail.me'
        ];
        if (in_array($domain, $disposableDomains, true)) {
            $model->addError($attribute, 'Temporary and disposable email addresses are not permitted.');
            return;
        }

        // Dummy / Test domains
        $dummyDomains = [
            'example.com', 'example.org', 'example.net', 'test.com', 'testing.com',
            'fake.com', 'fakemail.com', 'dummy.com', 'sample.com', 'asdf.com',
            'temp.com', 'xyz.com', 'abc.com', 'domain.com', 'invalid.com',
            'none.com', 'null.com', 'email.com'
        ];
        if (in_array($domain, $dummyDomains, true)) {
            $model->addError($attribute, 'Please enter a genuine email address, not a test domain.');
            return;
        }

        // Domain MX or A check
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
        } else {
            $hasMail = true;
        }

        if (!$hasMail) {
            $model->addError(
                $attribute,
                'Email domain does not appear to accept mail. Please enter a valid email address.'
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
            $model->addError($attribute, 'This email already exists.');
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
}

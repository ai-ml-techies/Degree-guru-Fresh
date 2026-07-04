<?php

declare(strict_types=1);

use yii\db\Migration;

final class m260704_000001_add_otp_expiry_columns extends Migration
{
    public function safeUp(): void
    {
        $this->addColumn('{{%job_employers}}', 'contact_email_verification_expires_at', $this->dateTime()->null()->defaultValue(null));
        $this->addColumn('{{%job_seekers}}', 'email_verification_expires_at', $this->dateTime()->null()->defaultValue(null));
    }

    public function safeDown(): void
    {
        $this->dropColumn('{{%job_employers}}', 'contact_email_verification_expires_at');
        $this->dropColumn('{{%job_seekers}}', 'email_verification_expires_at');
    }
}

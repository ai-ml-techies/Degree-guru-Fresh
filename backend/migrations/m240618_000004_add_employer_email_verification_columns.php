<?php

declare(strict_types=1);

use yii\db\Migration;

final class m240618_000004_add_employer_email_verification_columns extends Migration
{
    public function safeUp(): void
    {
        $this->addColumn('{{%job_employers}}', 'contact_email_verified', $this->smallInteger(1)->notNull()->defaultValue(0));
        $this->addColumn('{{%job_employers}}', 'contact_email_verification_token', $this->string(255)->null()->defaultValue(null));
    }

    public function safeDown(): void
    {
        $this->dropColumn('{{%job_employers}}', 'contact_email_verification_token');
        $this->dropColumn('{{%job_employers}}', 'contact_email_verified');
    }
}

<?php

declare(strict_types=1);

use yii\db\Migration;

final class m240618_000003_add_employer_password_column extends Migration
{
    public function safeUp(): void
    {
        // Add nullable password hash column for employers
        $this->addColumn('{{%job_employers}}', 'contact_password_hash', $this->string(255)->null()->defaultValue(null));
    }

    public function safeDown(): void
    {
        $this->dropColumn('{{%job_employers}}', 'contact_password_hash');
    }
}

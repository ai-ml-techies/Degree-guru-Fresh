<?php

declare(strict_types=1);

use yii\db\Migration;

final class m240618_000002_add_api_token_columns extends Migration
{
    public function safeUp(): void
    {
        // Add api_token to job_seekers
        $this->addColumn('{{%job_seekers}}', 'api_token', $this->string(255)->null()->defaultValue(null));
        $this->createIndex('idx-job_seekers-api_token', '{{%job_seekers}}', 'api_token', true);

        // Add api_token to job_employers
        $this->addColumn('{{%job_employers}}', 'api_token', $this->string(255)->null()->defaultValue(null));
        $this->createIndex('idx-job_employers-api_token', '{{%job_employers}}', 'api_token', true);
    }

    public function safeDown(): void
    {
        $this->dropIndex('idx-job_employers-api_token', '{{%job_employers}}');
        $this->dropColumn('{{%job_employers}}', 'api_token');

        $this->dropIndex('idx-job_seekers-api_token', '{{%job_seekers}}');
        $this->dropColumn('{{%job_seekers}}', 'api_token');
    }
}

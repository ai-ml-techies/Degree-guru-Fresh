<?php

declare(strict_types=1);

use yii\db\Migration;

final class m260704_000002_add_employer_company_description extends Migration
{
    public function safeUp(): void
    {
        $this->addColumn('{{%job_employers}}', 'company_description', $this->text()->null()->after('company_address'));
    }

    public function safeDown(): void
    {
        $this->dropColumn('{{%job_employers}}', 'company_description');
    }
}

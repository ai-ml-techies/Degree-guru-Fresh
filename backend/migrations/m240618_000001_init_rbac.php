<?php

declare(strict_types=1);

use yii\db\Migration;

/**
 * Initializes RBAC DB schema and seeds basic roles.
 */
final class m240618_000001_init_rbac extends Migration
{
    public function safeUp(): void
    {
        // auth_rule
        $this->createTable('{{%auth_rule}}', [
            'name' => $this->string(64)->notNull()->append('PRIMARY KEY'),
            'data' => $this->binary(),
            'created_at' => $this->integer(),
            'updated_at' => $this->integer(),
        ]);

        // auth_item
        $this->createTable('{{%auth_item}}', [
            'name' => $this->string(64)->notNull()->append('PRIMARY KEY'),
            'type' => $this->integer()->notNull(),
            'description' => $this->text(),
            'rule_name' => $this->string(64),
            'data' => $this->binary(),
            'created_at' => $this->integer(),
            'updated_at' => $this->integer(),
        ]);

        // auth_item_child
        $this->createTable('{{%auth_item_child}}', [
            'parent' => $this->string(64)->notNull(),
            'child' => $this->string(64)->notNull(),
        ]);
        $this->addPrimaryKey('pk-auth_item_child', '{{%auth_item_child}}', ['parent', 'child']);
        $this->addForeignKey('fk-auth_item_child-parent', '{{%auth_item_child}}', 'parent', '{{%auth_item}}', 'name', 'CASCADE', 'CASCADE');
        $this->addForeignKey('fk-auth_item_child-child', '{{%auth_item_child}}', 'child', '{{%auth_item}}', 'name', 'CASCADE', 'CASCADE');

        // auth_assignment
        $this->createTable('{{%auth_assignment}}', [
            'item_name' => $this->string(64)->notNull(),
            'user_id' => $this->string(64)->notNull(),
            'created_at' => $this->integer(),
        ]);
        $this->addPrimaryKey('pk-auth_assignment', '{{%auth_assignment}}', ['item_name', 'user_id']);
        $this->addForeignKey('fk-auth_assignment-item_name', '{{%auth_assignment}}', 'item_name', '{{%auth_item}}', 'name', 'CASCADE', 'CASCADE');

        // seed basic roles
        if (Yii::$app->has('authManager')) {
            $auth = Yii::$app->authManager;
            try {
                $auth->removeAll();
            } catch (Throwable $e) {
                // ignore
            }
            $employer = $auth->createRole('employer');
            $auth->add($employer);
            $seeker = $auth->createRole('seeker');
            $auth->add($seeker);
        }
    }

    public function safeDown(): void
    {
        if (Yii::$app->has('authManager')) {
            try {
                Yii::$app->authManager->removeAll();
            } catch (Throwable $e) {
            }
        }
        $this->dropForeignKey('fk-auth_assignment-item_name', '{{%auth_assignment}}');
        $this->dropTable('{{%auth_assignment}}');
        $this->dropForeignKey('fk-auth_item_child-child', '{{%auth_item_child}}');
        $this->dropForeignKey('fk-auth_item_child-parent', '{{%auth_item_child}}');
        $this->dropTable('{{%auth_item_child}}');
        $this->dropTable('{{%auth_item}}');
        $this->dropTable('{{%auth_rule}}');
    }
}

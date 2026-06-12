<?php

declare(strict_types=1);

namespace app\models;

use Yii;
use yii\db\ActiveRecord;

class SiteSetting extends ActiveRecord
{
    public static function tableName(): string
    {
        return 'site_settings';
    }

    // Get a single value; returns $default if key doesn't exist
    public static function get(string $key, string $default = ''): string
    {
        $row = static::findOne(['key' => $key]);
        return $row ? (string) $row->value : $default;
    }

    // Upsert a single key-value pair
    public static function set(string $key, string $value): bool
    {
        $row = static::findOne(['key' => $key]) ?? new static();
        $row->key   = $key;
        $row->value = $value;
        return $row->save(false);
    }

    // Upsert many key-value pairs at once
    public static function setMany(array $data): bool
    {
        $db = Yii::$app->db;
        $transaction = $db->beginTransaction();
        try {
            foreach ($data as $key => $value) {
                $db->createCommand()
                    ->upsert('site_settings', ['key' => $key, 'value' => $value], ['value' => $value])
                    ->execute();
            }
            $transaction->commit();
            return true;
        } catch (\Throwable $e) {
            $transaction->rollBack();
            return false;
        }
    }

    // Return all keys that start with a given prefix as key => value map
    public static function getGroup(string $prefix): array
    {
        $rows = static::find()
            ->where(['like', 'key', $prefix . '%', false])
            ->all();
        $result = [];
        foreach ($rows as $row) {
            $result[$row->key] = $row->value;
        }
        return $result;
    }

    // Return all rows as key => value map
    public static function getAll(): array
    {
        $rows = static::find()->all();
        $result = [];
        foreach ($rows as $row) {
            $result[$row->key] = (string) $row->value;
        }
        return $result;
    }
}

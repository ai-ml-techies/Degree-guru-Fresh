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

    // Get a single value; returns $default if key doesn't exist or DB is offline
    public static function get(string $key, string $default = ''): string
    {
        try {
            $row = static::findOne(['key' => $key]);
            return $row ? (string) $row->value : $default;
        } catch (\Throwable $e) {
            Yii::warning("SiteSetting::get('{$key}') error: " . $e->getMessage(), __METHOD__);
            return $default;
        }
    }

    // Upsert a single key-value pair
    public static function set(string $key, string $value): bool
    {
        try {
            $row = static::findOne(['key' => $key]) ?? new static();
            $row->key   = $key;
            $row->value = $value;
            return (bool) $row->save(false);
        } catch (\Throwable $e) {
            Yii::error("SiteSetting::set('{$key}') error: " . $e->getMessage(), __METHOD__);
            return false;
        }
    }

    // Upsert many key-value pairs at once
    public static function setMany(array $data): bool
    {
        try {
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
                Yii::error("SiteSetting::setMany transaction error: " . $e->getMessage(), __METHOD__);
                return false;
            }
        } catch (\Throwable $e) {
            Yii::error("SiteSetting::setMany DB connection error: " . $e->getMessage(), __METHOD__);
            return false;
        }
    }

    // Return all keys that start with a given prefix as key => value map
    public static function getGroup(string $prefix): array
    {
        try {
            $rows = static::find()
                ->where(['like', 'key', $prefix . '%', false])
                ->all();
            $result = [];
            foreach ($rows as $row) {
                $result[$row->key] = $row->value;
            }
            return $result;
        } catch (\Throwable $e) {
            Yii::warning("SiteSetting::getGroup('{$prefix}') error: " . $e->getMessage(), __METHOD__);
            return [];
        }
    }

    // Return all rows as key => value map
    public static function getAll(): array
    {
        try {
            $rows = static::find()->all();
            $result = [];
            foreach ($rows as $row) {
                $result[$row->key] = (string) $row->value;
            }
            return $result;
        } catch (\Throwable $e) {
            Yii::warning("SiteSetting::getAll error: " . $e->getMessage(), __METHOD__);
            return [];
        }
    }
}

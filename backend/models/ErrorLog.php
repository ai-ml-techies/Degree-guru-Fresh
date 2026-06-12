<?php

declare(strict_types=1);

namespace app\models;

use Yii;
use yii\db\ActiveRecord;

class ErrorLog extends ActiveRecord
{
    public static function tableName(): string
    {
        return 'error_logs';
    }

    public static function write(string $type, string $source, string $message, array $context = []): void
    {
        try {
            $log = new self();
            $log->type    = $type;
            $log->source  = $source;
            $log->message = $message;
            $log->context = json_encode($context, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
            $log->ip      = Yii::$app->request->userIP ?? '';
            $log->save(false);
        } catch (\Throwable $e) {
            // Silently fail — never let logging crash the app
        }
    }
}

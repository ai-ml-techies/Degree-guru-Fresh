CREATE TABLE IF NOT EXISTS `error_logs` (
  `id`         INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `type`       VARCHAR(50)  NOT NULL DEFAULT 'error',
  `source`     VARCHAR(150) NOT NULL DEFAULT '',
  `message`    TEXT         NOT NULL,
  `context`    TEXT         NOT NULL DEFAULT '',
  `ip`         VARCHAR(45)  NOT NULL DEFAULT '',
  `created_at` DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
t
CREATE TABLE IF NOT EXISTS `recruitment` (
  `id`              INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `name`            VARCHAR(100) NOT NULL,
  `email`           VARCHAR(255) NOT NULL DEFAULT '',
  `phone`           VARCHAR(20) NOT NULL,
  `dob`             DATE NOT NULL,
  `country`         VARCHAR(100) NOT NULL,
  `state`           VARCHAR(100) NOT NULL,
  `city`            VARCHAR(100) NOT NULL,
  `industry`        VARCHAR(100) NOT NULL,
  `experience`      VARCHAR(100) NOT NULL DEFAULT '',
  `resume_filename` VARCHAR(255) NOT NULL,
  `resume_original` VARCHAR(255) NOT NULL,
  `created_at`      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

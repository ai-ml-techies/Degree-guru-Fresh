-- ============================================================
-- Degree Guru CMS — site_settings table
-- Key-value store for all page content managed from admin.
-- Run once. Admin fills content via the CMS form.
-- ============================================================

CREATE TABLE IF NOT EXISTS `site_settings` (
  `id`         INT          NOT NULL AUTO_INCREMENT,
  `key`        VARCHAR(100) NOT NULL,
  `value`      TEXT,
  `updated_at` DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_key` (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

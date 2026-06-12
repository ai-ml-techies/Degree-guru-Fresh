-- =============================================================================
-- Degree Guru — Jobs Portal Schema
-- Run this file on any fresh server after full_schema.sql
-- Safe to re-run (uses IF NOT EXISTS)
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. job_employers
--    Stores company/employer registration submissions.
--    status: 0 = Pending Review | 1 = Approved | 2 = Rejected
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `job_employers` (
  `id`                  BIGINT UNSIGNED  NOT NULL AUTO_INCREMENT,
  `company_name`        VARCHAR(200)     NOT NULL,
  `company_industry`    VARCHAR(100)     NOT NULL,
  `employee_count`      VARCHAR(50)      NOT NULL DEFAULT '',
  `company_address`     TEXT,
  `company_website`     VARCHAR(255)     NOT NULL DEFAULT '',
  `document_filename`   VARCHAR(255)     NOT NULL COMMENT 'Saved filename on disk',
  `document_original`   VARCHAR(255)     NOT NULL COMMENT 'Original upload name shown to admin',
  `contact_name`        VARCHAR(150)     NOT NULL,
  `contact_phone`       VARCHAR(20)      NOT NULL,
  `contact_email`       VARCHAR(255)     NOT NULL,
  `contact_password_hash` VARCHAR(255)    NOT NULL DEFAULT '' COMMENT 'Password hash for employer login',
  `password_reset_token` VARCHAR(255)     NOT NULL DEFAULT '' COMMENT 'Password reset token',
  `contact_email_verified` TINYINT(1)     NOT NULL DEFAULT 0 COMMENT 'Whether contact email is verified',
  `contact_email_verification_token` VARCHAR(255) NOT NULL DEFAULT '' COMMENT 'Email verification token',
  `contact_designation` VARCHAR(100)     NOT NULL DEFAULT '',
  `status`              TINYINT          NOT NULL DEFAULT 0,
  `admin_note`          TEXT,
  `created_at`          TIMESTAMP        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`          TIMESTAMP        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_status`       (`status`),
  KEY `idx_email`        (`contact_email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- -----------------------------------------------------------------------------
-- 2. job_postings
--    Individual job listings linked to an employer.
--    status: 0 = Pending Review | 1 = Approved (live) | 2 = Rejected
--    work_type: full-time | part-time | internship | remote | hybrid
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `job_postings` (
  `id`                  BIGINT UNSIGNED  NOT NULL AUTO_INCREMENT,
  `employer_id`         BIGINT UNSIGNED  NOT NULL COMMENT 'FK → job_employers.id',
  `job_title`           VARCHAR(200)     NOT NULL,
  `job_category`        VARCHAR(100)     NOT NULL,
  `job_location`        VARCHAR(200)     NOT NULL,
  `work_type`           VARCHAR(50)      NOT NULL COMMENT 'full-time|part-time|internship|remote|hybrid',
  `experience_required` VARCHAR(100)     NOT NULL DEFAULT '',
  `salary_range`        VARCHAR(100)     NOT NULL DEFAULT '',
  `industry`            VARCHAR(100)     NOT NULL DEFAULT '',
  `skills_required`     TEXT,
  `job_description`     TEXT             NOT NULL,
  `openings`            SMALLINT UNSIGNED NOT NULL DEFAULT 1,
  `apply_link`          VARCHAR(255)     NOT NULL DEFAULT '' COMMENT 'Optional external apply URL',
  `status`              TINYINT          NOT NULL DEFAULT 0,
  `admin_note`          TEXT,
  `created_at`          TIMESTAMP        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`          TIMESTAMP        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_employer`    (`employer_id`),
  KEY `idx_status`      (`status`),
  KEY `idx_work_type`   (`work_type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- -----------------------------------------------------------------------------
-- 3. job_seekers
--    Candidate profiles (created when a user registers to apply).
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `job_seekers` (
  `id`                  BIGINT UNSIGNED  NOT NULL AUTO_INCREMENT,
  `full_name`           VARCHAR(150)     NOT NULL,
  `email`               VARCHAR(255)     NOT NULL,
  `phone`               VARCHAR(20)      NOT NULL,
  `city`                VARCHAR(100)     NOT NULL DEFAULT '',
  `qualification`       VARCHAR(100)     NOT NULL DEFAULT '',
  `experience`          VARCHAR(100)     NOT NULL DEFAULT '',
  `preferred_industry`  VARCHAR(100)     NOT NULL DEFAULT '',
  `skills`              TEXT,
  `linkedin_url`        VARCHAR(255)     NOT NULL DEFAULT '',
  `password_hash`       VARCHAR(255)     NOT NULL DEFAULT '' COMMENT 'Password hash for seeker login',
  `password_reset_token` VARCHAR(255)    NOT NULL DEFAULT '' COMMENT 'Password reset token',
  `email_verified`      TINYINT(1)       NOT NULL DEFAULT 0 COMMENT 'Whether seeker email is verified',
  `email_verification_token` VARCHAR(255) NOT NULL DEFAULT '' COMMENT 'Email verification token',
  `resume_filename`     VARCHAR(255)     NOT NULL DEFAULT '' COMMENT 'Saved filename on disk',
  `resume_original`     VARCHAR(255)     NOT NULL DEFAULT '' COMMENT 'Original upload name',
  `created_at`          TIMESTAMP        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`          TIMESTAMP        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_email`       (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- -----------------------------------------------------------------------------
-- 4. job_applications
--    Many-to-many: job seekers ↔ job postings.
--    Unique constraint prevents a seeker from applying twice to the same job.
--    status: 0 = Applied | 1 = Shortlisted | 2 = Rejected
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `job_applications` (
  `id`                  BIGINT UNSIGNED  NOT NULL AUTO_INCREMENT,
  `posting_id`          BIGINT UNSIGNED  NOT NULL COMMENT 'FK → job_postings.id',
  `seeker_id`           BIGINT UNSIGNED  NOT NULL COMMENT 'FK → job_seekers.id',
  `status`              TINYINT          NOT NULL DEFAULT 0,
  `created_at`          TIMESTAMP        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_application` (`posting_id`, `seeker_id`),
  KEY `idx_posting`     (`posting_id`),
  KEY `idx_seeker`      (`seeker_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

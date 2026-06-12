-- =============================================================================
-- Degree Guru — Full Database Schema
-- Import this single file on a fresh server to set up everything.
-- Safe to re-run (all statements use IF NOT EXISTS).
-- Last updated: 2026-06-06
-- =============================================================================

CREATE TABLE IF NOT EXISTS `users` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(255) NOT NULL,
  `auth_key` VARCHAR(255) NOT NULL,
  `password_hash` VARCHAR(255) NOT NULL,
  `password_reset_token` VARCHAR(255) DEFAULT NULL,
  `email` VARCHAR(255) NOT NULL,
  `status` SMALLINT NOT NULL DEFAULT 10,
  `created_at` INT NOT NULL DEFAULT 0,
  `updated_at` INT NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_username` (`username`),
  UNIQUE KEY `uk_password_reset_token` (`password_reset_token`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `site_settings` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `key` VARCHAR(100) NOT NULL,
  `value` TEXT,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_key` (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `programs` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `slug` VARCHAR(100) NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  `full_name` VARCHAR(200) NOT NULL DEFAULT '',
  `level` ENUM('Bachelors','Masters','Doctoral','Skills') NOT NULL DEFAULT 'Bachelors',
  `desc` TEXT,
  `tagline` VARCHAR(500) DEFAULT '',
  `about` TEXT,
  `enroll_for` JSON,
  `emi_note` TEXT,
  `career_roles` JSON,
  `career_salary` VARCHAR(150) DEFAULT '',
  `sort_order` INT NOT NULL DEFAULT 0,
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `meta_title` VARCHAR(70) DEFAULT NULL,
  `meta_desc` VARCHAR(160) DEFAULT NULL,
  `og_image` VARCHAR(500) DEFAULT NULL,
  `focus_keyword` VARCHAR(100) DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `recruitment` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(255) NOT NULL DEFAULT '',
  `phone` VARCHAR(20) NOT NULL,
  `dob` DATE NOT NULL,
  `country` VARCHAR(100) NOT NULL,
  `state` VARCHAR(100) NOT NULL,
  `city` VARCHAR(100) NOT NULL,
  `industry` VARCHAR(100) NOT NULL,
  `experience` VARCHAR(100) NOT NULL DEFAULT '',
  `resume_filename` VARCHAR(255) NOT NULL,
  `resume_original` VARCHAR(255) NOT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `error_logs` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `type` VARCHAR(50) NOT NULL DEFAULT 'error',
  `source` VARCHAR(150) NOT NULL DEFAULT '',
  `message` TEXT NOT NULL,
  `context` TEXT NOT NULL DEFAULT '',
  `ip` VARCHAR(45) NOT NULL DEFAULT '',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -----------------------------------------------------------------------------
-- counseling_requests
--    Leads from the free counseling forms on the frontend.
--    status: 0 = New | 1 = Contacted | 2 = Enrolled | 3 = Not Interested
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `counseling_requests` (
  `id`          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name`        VARCHAR(150)    NOT NULL,
  `email`       VARCHAR(255)    DEFAULT NULL,
  `phone`       VARCHAR(30)     NOT NULL,
  `dob`         DATE            DEFAULT NULL,
  `message`     TEXT            DEFAULT NULL,
  `resume_path` VARCHAR(255)    DEFAULT NULL,
  `source_page` VARCHAR(100)    DEFAULT NULL COMMENT 'e.g. home-page, contact-page, program-online-mba',
  `status`      TINYINT         NOT NULL DEFAULT 0,
  `created_at`  TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`  TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- =============================================================================
-- JOBS PORTAL TABLES
-- =============================================================================

-- -----------------------------------------------------------------------------
-- job_employers
--    Company/employer registrations submitted via /jobs/employer.
--    status: 0 = Pending | 1 = Approved | 2 = Rejected
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `job_employers` (
  `id`                  BIGINT UNSIGNED  NOT NULL AUTO_INCREMENT,
  `company_name`        VARCHAR(200)     NOT NULL,
  `company_industry`    VARCHAR(100)     NOT NULL,
  `employee_count`      VARCHAR(50)      NOT NULL DEFAULT '',
  `company_address`     TEXT,
  `company_website`     VARCHAR(255)     NOT NULL DEFAULT '',
  `document_filename`   VARCHAR(255)     NOT NULL,
  `document_original`   VARCHAR(255)     NOT NULL,
  `contact_name`        VARCHAR(150)     NOT NULL,
  `contact_phone`       VARCHAR(20)      NOT NULL,
  `contact_email`       VARCHAR(255)     NOT NULL,
  `contact_designation` VARCHAR(100)     NOT NULL DEFAULT '',
  `status`              TINYINT          NOT NULL DEFAULT 0,
  `admin_note`          TEXT,
  `created_at`          TIMESTAMP        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`          TIMESTAMP        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_status` (`status`),
  KEY `idx_email`  (`contact_email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- -----------------------------------------------------------------------------
-- job_postings
--    Job listings linked to an employer.
--    status: 0 = Pending | 1 = Approved (live) | 2 = Rejected
--    work_type: full-time | part-time | internship | remote | hybrid
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `job_postings` (
  `id`                  BIGINT UNSIGNED   NOT NULL AUTO_INCREMENT,
  `employer_id`         BIGINT UNSIGNED   NOT NULL,
  `job_title`           VARCHAR(200)      NOT NULL,
  `job_category`        VARCHAR(100)      NOT NULL,
  `job_location`        VARCHAR(200)      NOT NULL,
  `work_type`           VARCHAR(50)       NOT NULL,
  `experience_required` VARCHAR(100)      NOT NULL DEFAULT '',
  `salary_range`        VARCHAR(100)      NOT NULL DEFAULT '',
  `industry`            VARCHAR(100)      NOT NULL DEFAULT '',
  `skills_required`     TEXT,
  `job_description`     TEXT              NOT NULL,
  `openings`            SMALLINT UNSIGNED NOT NULL DEFAULT 1,
  `apply_link`          VARCHAR(255)      NOT NULL DEFAULT '',
  `status`              TINYINT           NOT NULL DEFAULT 0,
  `admin_note`          TEXT,
  `created_at`          TIMESTAMP         NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`          TIMESTAMP         NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_employer`  (`employer_id`),
  KEY `idx_status`    (`status`),
  KEY `idx_work_type` (`work_type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- -----------------------------------------------------------------------------
-- job_seekers
--    Candidate profiles created when a user registers to apply for a job.
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `job_seekers` (
  `id`                 BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `full_name`          VARCHAR(150)    NOT NULL,
  `email`              VARCHAR(255)    NOT NULL,
  `phone`              VARCHAR(20)     NOT NULL,
  `city`               VARCHAR(100)    NOT NULL DEFAULT '',
  `qualification`      VARCHAR(100)    NOT NULL DEFAULT '',
  `experience`         VARCHAR(100)    NOT NULL DEFAULT '',
  `preferred_industry` VARCHAR(100)    NOT NULL DEFAULT '',
  `skills`             TEXT,
  `linkedin_url`       VARCHAR(255)    NOT NULL DEFAULT '',
  `resume_filename`    VARCHAR(255)    NOT NULL DEFAULT '',
  `resume_original`    VARCHAR(255)    NOT NULL DEFAULT '',
  `created_at`         TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`         TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- -----------------------------------------------------------------------------
-- job_applications
--    Many-to-many: seekers ↔ postings.
--    Unique key prevents duplicate applications.
--    status: 0 = Applied | 1 = Shortlisted | 2 = Rejected
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `job_applications` (
  `id`         BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `posting_id` BIGINT UNSIGNED NOT NULL,
  `seeker_id`  BIGINT UNSIGNED NOT NULL,
  `status`     TINYINT         NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_application` (`posting_id`, `seeker_id`),
  KEY `idx_posting` (`posting_id`),
  KEY `idx_seeker`  (`seeker_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- =============================================================================
-- NOTES
-- =============================================================================
-- Add an admin user after import (replace placeholders):
-- INSERT INTO `users` (username, auth_key, password_hash, email, status, created_at, updated_at)
-- VALUES ('admin', 'random-32-char-string', 'yii2-hashed-password', 'admin@degreeguru.in', 10, UNIX_TIMESTAMP(), UNIX_TIMESTAMP());
--
-- File upload directories to create on the server:
--   /web/uploads/resumes/          ← recruitment resumes
--   /web/uploads/seeker-resumes/   ← job seeker resumes
--   /web/uploads/job-docs/         ← employer verification documents

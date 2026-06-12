-- Run this once on any server that already has the programs table
ALTER TABLE `programs`
  ADD COLUMN `meta_title`     VARCHAR(70)  DEFAULT NULL AFTER `is_active`,
  ADD COLUMN `meta_desc`      VARCHAR(160) DEFAULT NULL AFTER `meta_title`,
  ADD COLUMN `og_image`       VARCHAR(500) DEFAULT NULL AFTER `meta_desc`,
  ADD COLUMN `focus_keyword`  VARCHAR(100) DEFAULT NULL AFTER `og_image`;

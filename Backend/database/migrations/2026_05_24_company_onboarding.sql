CREATE TABLE IF NOT EXISTS `company_onboarding` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` BIGINT UNSIGNED NOT NULL,
  `company_id` BIGINT UNSIGNED DEFAULT NULL,
  `user_name` VARCHAR(120) DEFAULT NULL,
  `company_name` VARCHAR(160) DEFAULT NULL,
  `business_segment` VARCHAR(160) DEFAULT NULL,
  `employees_count` VARCHAR(80) DEFAULT NULL,
  `main_goal` VARCHAR(120) DEFAULT NULL,
  `ai_communication_style` VARCHAR(80) DEFAULT NULL,
  `ai_initial_context` TEXT DEFAULT NULL,
  `initial_agent_preferences` JSON DEFAULT NULL,
  `onboarding_completed` TINYINT(1) NOT NULL DEFAULT 0,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `company_onboarding_user_id_unique` (`user_id`),
  KEY `company_onboarding_company_id_index` (`company_id`),
  CONSTRAINT `company_onboarding_user_id_foreign`
    FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

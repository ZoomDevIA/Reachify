CREATE DATABASE IF NOT EXISTS `Reachify`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE `Reachify`;

CREATE TABLE IF NOT EXISTS `users` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `uuid` CHAR(36) NOT NULL,
  `full_name` VARCHAR(120) DEFAULT NULL,
  `company_name` VARCHAR(160) DEFAULT NULL,
  `email` VARCHAR(190) NOT NULL,
  `password_hash` VARCHAR(255) NOT NULL,
  `plan_slug` VARCHAR(60) NOT NULL DEFAULT 'free',
  `plan_status` ENUM('trial', 'active', 'past_due', 'canceled') NOT NULL DEFAULT 'trial',
  `credits_balance` INT UNSIGNED NOT NULL DEFAULT 0,
  `credits_used` INT UNSIGNED NOT NULL DEFAULT 0,
  `account_role` ENUM('owner', 'admin', 'manager', 'agent') NOT NULL DEFAULT 'owner',
  `account_status` ENUM('pending_verification', 'active', 'suspended', 'archived') NOT NULL DEFAULT 'pending_verification',
  `is_super_admin` TINYINT(1) NOT NULL DEFAULT 0,
  `email_verified_at` DATETIME DEFAULT NULL,
  `last_login_at` DATETIME DEFAULT NULL,
  `last_seen_at` DATETIME DEFAULT NULL,
  `failed_login_attempts` SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  `timezone` VARCHAR(80) NOT NULL DEFAULT 'America/Sao_Paulo',
  `locale` VARCHAR(20) NOT NULL DEFAULT 'pt-BR',
  `onboarding_completed_at` DATETIME DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_uuid_unique` (`uuid`),
  UNIQUE KEY `users_email_unique` (`email`),
  KEY `users_plan_slug_index` (`plan_slug`),
  KEY `users_account_status_index` (`account_status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `user_email_verifications` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` BIGINT UNSIGNED NOT NULL,
  `purpose` VARCHAR(40) NOT NULL DEFAULT 'email_verification',
  `code_hash` VARCHAR(255) NOT NULL,
  `expires_at` DATETIME NOT NULL,
  `consumed_at` DATETIME DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_email_verifications_user_id_index` (`user_id`),
  KEY `user_email_verifications_expires_at_index` (`expires_at`),
  CONSTRAINT `user_email_verifications_user_id_foreign`
    FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `user_sessions` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` BIGINT UNSIGNED NOT NULL,
  `session_token` CHAR(64) NOT NULL,
  `ip_address` VARCHAR(45) DEFAULT NULL,
  `user_agent` VARCHAR(255) DEFAULT NULL,
  `expires_at` DATETIME NOT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_sessions_session_token_unique` (`session_token`),
  KEY `user_sessions_user_id_index` (`user_id`),
  KEY `user_sessions_expires_at_index` (`expires_at`),
  CONSTRAINT `user_sessions_user_id_foreign`
    FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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

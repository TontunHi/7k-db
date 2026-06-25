-- Seven Knights Rebirth Database Dump (Registry Only)
-- Generated at: 2026-06-24T14:30:39.066Z

SET FOREIGN_KEY_CHECKS = 0;

-- Table structure for table `advent_expedition_sets`
DROP TABLE IF EXISTS `advent_expedition_sets`;
CREATE TABLE `advent_expedition_sets` (
  `id` int NOT NULL AUTO_INCREMENT,
  `boss_key` varchar(50) NOT NULL,
  `phase` varchar(20) DEFAULT 'Phase 1',
  `set_index` int NOT NULL DEFAULT '1',
  `team_name` varchar(100) DEFAULT NULL,
  `formation` varchar(50) NOT NULL DEFAULT '2-3',
  `pet_file` varchar(255) DEFAULT NULL,
  `heroes_json` json DEFAULT NULL,
  `hero_builds_json` json DEFAULT NULL,
  `skill_rotation` json DEFAULT NULL,
  `video_url` varchar(500) DEFAULT NULL,
  `note` text DEFAULT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) /*T![clustered_index] CLUSTERED */
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- Table structure for table `analytics_clicks`
DROP TABLE IF EXISTS `analytics_clicks`;
CREATE TABLE `analytics_clicks` (
  `id` int NOT NULL AUTO_INCREMENT,
  `link_url` varchar(500) NOT NULL,
  `link_id` varchar(100) DEFAULT NULL,
  `page_path` varchar(255) NOT NULL,
  `ip_hash` varchar(64) NOT NULL,
  `session_id` varchar(64) NOT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) /*T![clustered_index] CLUSTERED */
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- Table structure for table `analytics_views`
DROP TABLE IF EXISTS `analytics_views`;
CREATE TABLE `analytics_views` (
  `id` int NOT NULL AUTO_INCREMENT,
  `page_path` varchar(255) NOT NULL,
  `ip_hash` varchar(64) NOT NULL,
  `session_id` varchar(64) NOT NULL,
  `user_agent` text DEFAULT NULL,
  `event_type` enum('pageview','exit') DEFAULT 'pageview',
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) /*T![clustered_index] CLUSTERED */
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- Table structure for table `arena_teams`
DROP TABLE IF EXISTS `arena_teams`;
CREATE TABLE `arena_teams` (
  `id` int NOT NULL AUTO_INCREMENT,
  `team_index` int NOT NULL DEFAULT '1',
  `team_name` varchar(100) DEFAULT NULL,
  `formation` varchar(50) NOT NULL,
  `pet_file` varchar(255) DEFAULT NULL,
  `heroes_json` json DEFAULT NULL,
  `skill_rotation` json DEFAULT NULL,
  `video_url` varchar(500) DEFAULT NULL,
  `note` text DEFAULT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) /*T![clustered_index] CLUSTERED */
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- Table structure for table `builds`
DROP TABLE IF EXISTS `builds`;
CREATE TABLE `builds` (
  `id` int NOT NULL AUTO_INCREMENT,
  `hero_filename` varchar(255) DEFAULT NULL,
  `c_level` varchar(10) DEFAULT NULL,
  `modes` json DEFAULT NULL,
  `note` text DEFAULT NULL,
  `weapons` json DEFAULT NULL,
  `armors` json DEFAULT NULL,
  `accessories` json DEFAULT NULL,
  `substats` json DEFAULT NULL,
  `min_stats` json DEFAULT NULL,
  `dedicated_stats` json DEFAULT NULL,
  `build_index` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`) /*T![clustered_index] CLUSTERED */,
  KEY `fk_1` (`hero_filename`),
  CONSTRAINT `fk_builds_hero` FOREIGN KEY (`hero_filename`) REFERENCES `heroes` (`filename`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- Table structure for table `castle_rush_sets`
DROP TABLE IF EXISTS `castle_rush_sets`;
CREATE TABLE `castle_rush_sets` (
  `id` int NOT NULL AUTO_INCREMENT,
  `boss_key` varchar(50) NOT NULL,
  `set_index` int NOT NULL DEFAULT '1',
  `team_name` varchar(100) DEFAULT NULL,
  `formation` varchar(50) NOT NULL,
  `pet_file` varchar(255) DEFAULT NULL,
  `heroes_json` json DEFAULT NULL,
  `skill_rotation` json DEFAULT NULL,
  `video_url` varchar(500) DEFAULT NULL,
  `note` text DEFAULT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) /*T![clustered_index] CLUSTERED */
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- Table structure for table `contact_messages`
DROP TABLE IF EXISTS `contact_messages`;
CREATE TABLE `contact_messages` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(200) NOT NULL,
  `email` varchar(200) NOT NULL,
  `subject` varchar(200) DEFAULT NULL,
  `message` text NOT NULL,
  `status` enum('unread','read') NOT NULL DEFAULT 'unread',
  `ip_address` varchar(45) DEFAULT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) /*T![clustered_index] CLUSTERED */
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- Table structure for table `dungeon_sets`
DROP TABLE IF EXISTS `dungeon_sets`;
CREATE TABLE `dungeon_sets` (
  `id` int NOT NULL AUTO_INCREMENT,
  `dungeon_key` varchar(50) NOT NULL,
  `set_index` int NOT NULL DEFAULT '1',
  `formation` varchar(50) NOT NULL,
  `pet_file` varchar(255) DEFAULT NULL,
  `aura` varchar(20) DEFAULT NULL,
  `heroes_json` json DEFAULT NULL,
  `skill_rotation` json DEFAULT NULL,
  `video_url` varchar(500) DEFAULT NULL,
  `note` text DEFAULT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) /*T![clustered_index] CLUSTERED */
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- Table structure for table `global_credits`
DROP TABLE IF EXISTS `global_credits`;
CREATE TABLE `global_credits` (
  `id` int NOT NULL AUTO_INCREMENT,
  `platform` enum('youtube','tiktok','facebook','discord','other') NOT NULL DEFAULT 'other',
  `name` varchar(200) NOT NULL,
  `link` varchar(500) NOT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) /*T![clustered_index] CLUSTERED */
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- Table structure for table `guild_war_teams`
DROP TABLE IF EXISTS `guild_war_teams`;
CREATE TABLE `guild_war_teams` (
  `id` int NOT NULL AUTO_INCREMENT,
  `team_index` int NOT NULL DEFAULT '1',
  `type` varchar(50) NOT NULL,
  `team_name` varchar(100) DEFAULT NULL,
  `formation` varchar(50) NOT NULL,
  `pet_file` varchar(255) DEFAULT NULL,
  `heroes_json` json DEFAULT NULL,
  `skill_rotation` json DEFAULT NULL,
  `video_url` varchar(500) DEFAULT NULL,
  `note` text DEFAULT NULL,
  `counters_json` json DEFAULT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `items_json` json DEFAULT NULL,
  `pet_supports_json` json DEFAULT NULL,
  `counter_teams_json` json DEFAULT NULL,
  `selection_order_json` json DEFAULT NULL,
  PRIMARY KEY (`id`) /*T![clustered_index] CLUSTERED */
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- Table structure for table `heroes`
DROP TABLE IF EXISTS `heroes`;
CREATE TABLE `heroes` (
  `filename` varchar(255) NOT NULL,
  `slug` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `grade` varchar(50) DEFAULT NULL,
  `skill_priority` json DEFAULT NULL,
  `is_new_hero` tinyint(1) DEFAULT '0',
  `type` varchar(50) DEFAULT NULL,
  `hero_group` varchar(100) DEFAULT NULL,
  `sort_order` int DEFAULT '0',
  `atk_phys` int DEFAULT '0',
  `atk_mag` int DEFAULT '0',
  `def` int DEFAULT '0',
  `hp` int DEFAULT '0',
  `speed` int DEFAULT '0',
  `crit_rate` double DEFAULT '0',
  `crit_dmg` double DEFAULT '150',
  `weak_hit` double DEFAULT '0',
  `block_rate` double DEFAULT '0',
  `dmg_red` double DEFAULT '0',
  `eff_hit` double DEFAULT '0',
  `eff_res` double DEFAULT '0',
  PRIMARY KEY (`filename`) /*T![clustered_index] CLUSTERED */,
  UNIQUE KEY `idx_hero_slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- Dumping data for table `heroes`
INSERT INTO `heroes` (`filename`, `slug`, `name`, `grade`, `skill_priority`, `is_new_hero`, `type`, `hero_group`, `sort_order`, `atk_phys`, `atk_mag`, `def`, `hp`, `speed`, `crit_rate`, `crit_dmg`, `weak_hit`, `block_rate`, `dmg_red`, `eff_hit`, `eff_res`) VALUES
('a_clemyth', 'a_clemyth', 'Clemyth', 'a', NULL, 0, 'Support', 'Magic', 0, 0, 1253, 774, 5124, 19, 5, 150, 0, 0, 0, 0, 0),
('a_dellons', 'a_dellons', 'dellons', 'a', '["a_dellons/0.webp","a_dellons/1.webp","a_dellons/2.webp","a_dellons/3.webp","a_dellons/4.webp"]', 0, 'Attack', 'Physical', 0, 1712, 0, 668, 3836, 29, 5, 150, 0, 0, 0, 0, 0),
('a_silvesta', 'a_silvesta', 'Silvesta', 'a', NULL, 0, 'Magic', 'Magic', 0, 0, 1712, 668, 3836, 29, 5, 150, 0, 0, 0, 0, 0),
('a_skuld', 'a_skuld', 'Skuld', 'a', NULL, 0, 'Magic', 'Magic', 0, 0, 1712, 668, 3836, 29, 5, 150, 0, 0, 0, 0, 0),
('c_ahri', 'c_ahri', 'Ahri', 'c', NULL, 0, NULL, NULL, 0, 0, 0, 0, 0, 0, 5, 150, 0, 0, 0, 0, 0),
('c_babel', 'c_babel', 'Babel', 'c', NULL, 0, NULL, NULL, 0, 0, 0, 0, 0, 0, 5, 150, 0, 0, 0, 0, 0),
('c_cellops', 'c_cellops', 'Cellops', 'c', NULL, 0, NULL, NULL, 0, 0, 0, 0, 0, 0, 5, 150, 0, 0, 0, 0, 0),
('c_charles', 'c_charles', 'Charles', 'c', NULL, 0, NULL, NULL, 0, 0, 0, 0, 0, 0, 5, 150, 0, 0, 0, 0, 0),
('c_fina', 'c_fina', 'Fina', 'c', NULL, 0, NULL, NULL, 0, 0, 0, 0, 0, 0, 5, 150, 0, 0, 0, 0, 0),
('c_frose', 'c_frose', 'Frose', 'c', NULL, 0, NULL, NULL, 0, 0, 0, 0, 0, 0, 5, 150, 0, 0, 0, 0, 0),
('c_fruna', 'c_fruna', 'Fruna', 'c', NULL, 0, NULL, NULL, 0, 0, 0, 0, 0, 0, 5, 150, 0, 0, 0, 0, 0),
('c_happy', 'c_happy', 'Happy', 'c', NULL, 0, NULL, NULL, 0, 0, 0, 0, 0, 0, 5, 150, 0, 0, 0, 0, 0),
('c_leah', 'c_leah', 'Leah', 'c', NULL, 0, NULL, NULL, 0, 0, 0, 0, 0, 0, 5, 150, 0, 0, 0, 0, 0),
('c_pooki', 'c_pooki', 'Pooki', 'c', NULL, 0, NULL, NULL, 0, 0, 0, 0, 0, 0, 5, 150, 0, 0, 0, 0, 0),
('c_popo', 'c_popo', 'Popo', 'c', NULL, 0, NULL, NULL, 0, 0, 0, 0, 0, 0, 5, 150, 0, 0, 0, 0, 0),
('c_reaper', 'c_reaper', 'Reaper', 'c', NULL, 0, NULL, NULL, 0, 0, 0, 0, 0, 0, 5, 150, 0, 0, 0, 0, 0),
('c_ricky', 'c_ricky', 'Ricky', 'c', NULL, 0, NULL, NULL, 0, 0, 0, 0, 0, 0, 5, 150, 0, 0, 0, 0, 0),
('c_syllops', 'c_syllops', 'Syllops', 'c', NULL, 0, NULL, NULL, 0, 0, 0, 0, 0, 0, 5, 150, 0, 0, 0, 0, 0),
('l++_fai', 'l++_fai', 'Fai', 'l++', NULL, 0, 'Attack', 'Physical', 0, 1500, 0, 571, 3326, 29, 5, 150, 0, 0, 0, 0, 0),
('l++_gelidus', 'l++_gelidus', 'Gelidus', 'l++', NULL, 0, 'Universal', 'Physical', 0, 1306, 0, 659, 3693, 25, 5, 150, 0, 0, 0, 0, 0),
('l++_juri', 'l++_juri', 'Juri', 'l++', NULL, 0, 'Magic', 'Magic', 0, 0, 1500, 571, 3326, 29, 5, 150, 0, 0, 0, 0, 0),
('l++_melia', 'l++_melia', 'Melia', 'l++', NULL, 0, 'Magic', 'Magic', 0, 0, 1500, 571, 3326, 29, 5, 150, 0, 0, 0, 0, 0),
('l++_rosie', 'l++_rosie', 'Rosie', 'l++', NULL, 0, 'Support', 'Magic', 0, 0, 1095, 675, 4458, 19, 5, 150, 0, 0, 0, 0, 0),
('l+_ace', 'l+_ace', 'Ace', 'l+', NULL, 0, 'Universal', 'Physical', 0, 1306, 0, 659, 3693, 25, 5, 150, 0, 0, 0, 0, 0),
('l+_aquila', 'l+_aquila', 'Aquila', 'l+', NULL, 0, 'Defense', 'Physical', 0, 727, 0, 892, 4825, 19, 5, 150, 0, 0, 0, 0, 0),
('l+_biscuit', 'l+_biscuit', 'Biscuit', 'l+', NULL, 0, 'Support', 'Magic', 0, 0, 1095, 675, 4458, 19, 5, 150, 0, 0, 0, 0, 0),
('l+_branze_&_bransel', 'l+_branze_&_bransel', 'Branze & Bransel', 'l+', NULL, 0, 'Attack', 'Physical', 0, 1500, 0, 571, 3326, 29, 5, 150, 0, 0, 0, 0, 0),
('l+_clemyth', 'l+_clemyth', 'Clemyth', 'l+', NULL, 0, NULL, NULL, 0, 0, 0, 0, 0, 0, 5, 150, 0, 0, 0, 0, 0),
('l+_colt', 'l+_colt', 'Colt', 'l+', NULL, 0, 'Attack', 'Physical', 0, 1500, 0, 571, 3326, 29, 5, 150, 0, 0, 0, 0, 0),
('l+_dellons', 'l+_dellons', 'Dellons', 'l+', NULL, 0, 'Attack', 'Physical', 0, 1500, 0, 571, 3326, 29, 5, 150, 0, 0, 0, 0, 0),
('l+_eileene', 'l+_eileene', 'Eileene', 'l+', NULL, 0, 'Universal', 'Physical', 0, 1306, 0, 659, 3693, 25, 5, 150, 0, 0, 0, 0, 0),
('l+_elysia', 'l+_elysia', 'Elysia', 'l+', NULL, 0, 'Universal', 'Physical', 0, 1306, 0, 659, 3693, 25, 5, 150, 0, 0, 0, 0, 0),
('l+_freyja', 'l+_freyja', 'Freyja', 'l+', NULL, 0, 'Magic', 'Magic', 0, 0, 1500, 571, 3326, 29, 5, 150, 0, 0, 0, 0, 0),
('l+_jave', 'l+_jave', 'Jave', 'l+', NULL, 0, 'Universal', 'Physical', 0, 1306, 0, 659, 3693, 25, 5, 150, 0, 0, 0, 0, 0),
('l+_kagura', 'l+_kagura', 'Kagura', 'l+', NULL, 0, 'Attack', 'Physical', 0, 1500, 0, 571, 3326, 29, 5, 150, 0, 0, 0, 0, 0),
('l+_karl_heron', 'l+_karl_heron', 'Karl Heron', 'l+', NULL, 0, 'Attack', 'Physical', 0, 1500, 0, 571, 3326, 29, 5, 150, 0, 0, 0, 0, 0),
('l+_karma', 'l+_karma', 'Karma', 'l+', NULL, 0, 'Universal', 'Magic', 0, 0, 1306, 659, 3693, 25, 5, 150, 0, 0, 0, 0, 0),
('l+_klahan', 'l+_klahan', 'Klahan', 'l+', NULL, 0, 'Attack', 'Physical', 0, 1500, 0, 571, 3326, 29, 5, 150, 0, 0, 0, 0, 0),
('l+_kris', 'l+_kris', 'Kris', 'l+', NULL, 0, 'Universal', 'Physical', 0, 1306, 0, 659, 3693, 25, 5, 150, 0, 0, 0, 0, 0),
('l+_kyle', 'l+_kyle', 'Kyle', 'l+', NULL, 0, 'Attack', 'Physical', 0, 1500, 0, 571, 3326, 29, 5, 150, 0, 0, 0, 0, 0),
('l+_kyrielle', 'l+_kyrielle', 'Kyrielle', 'l+', NULL, 0, 'Magic', 'Magic', 0, 0, 1500, 571, 3326, 29, 5, 150, 0, 0, 0, 0, 0),
('l+_lu_bu', 'l+_lu_bu', 'Lu Bu', 'l+', NULL, 0, 'Attack', 'Physical', 0, 1500, 0, 571, 3326, 29, 5, 150, 0, 0, 0, 0, 0),
('l+_mercure', 'l+_mercure', 'Mercure', 'l+', NULL, 0, 'Magic', 'Magic', 0, 0, 1500, 571, 3326, 29, 5, 150, 0, 0, 0, 0, 0),
('l+_mist', 'l+_mist', 'Mist', 'l+', NULL, 0, 'Universal', 'Physical', 0, 1306, 0, 659, 3693, 25, 5, 150, 0, 0, 0, 0, 0),
('l+_nezha', 'l+_nezha', 'Nezha', 'l+', NULL, 0, 'Magic', 'Magic', 0, 0, 1500, 571, 3326, 29, 5, 150, 0, 0, 0, 0, 0),
('l+_o\'mok', 'l+_o\'mok', 'O\'mok', 'l+', NULL, 0, 'Magic', 'Magic', 0, 0, 1500, 571, 3326, 29, 5, 150, 0, 0, 0, 0, 0),
('l+_orly', 'l+_orly', 'Orly', 'l+', NULL, 0, 'Support', 'Magic', 0, 0, 1095, 675, 4458, 19, 5, 150, 0, 0, 0, 0, 0),
('l+_pallanus', 'l+_pallanus', 'Pallanus', 'l+', NULL, 0, 'Universal', 'Physical', 0, 1306, 0, 659, 3693, 25, 5, 150, 0, 0, 0, 0, 0),
('l+_platin', 'l+_platin', 'Platin', 'l+', NULL, 0, 'Defense', 'Magic', 0, 0, 727, 892, 4825, 19, 5, 150, 0, 0, 0, 0, 0),
('l+_rachel', 'l+_rachel', 'Rachel', 'l+', NULL, 0, 'Universal', 'Physical', 0, 1306, 0, 659, 3693, 25, 5, 150, 0, 0, 0, 0, 0),
('l+_radgrid', 'l+_radgrid', 'Radgrid', 'l+', NULL, 0, 'Defense', 'Physical', 0, 727, 0, 892, 4825, 19, 5, 150, 0, 0, 0, 0, 0),
('l+_randgrid', 'l+_randgrid', 'Randgrid', 'l+', NULL, 0, 'Attack', 'Physical', 0, 1500, 0, 571, 3326, 29, 5, 150, 0, 0, 0, 0, 0),
('l+_reginleif', 'l+_reginleif', 'Reginleif', 'l+', NULL, 0, 'Magic', 'Magic', 0, 0, 1500, 571, 3326, 29, 5, 150, 0, 0, 0, 0, 0),
('l+_rin', 'l+_rin', 'Rin', 'l+', NULL, 0, 'Magic', 'Magic', 0, 0, 1500, 571, 3326, 29, 5, 150, 0, 0, 0, 0, 0),
('l+_rudy', 'l+_rudy', 'Rudy', 'l+', NULL, 0, 'Defense', 'Physical', 0, 727, 0, 892, 4825, 19, 5, 150, 0, 0, 0, 0, 0),
('l+_ryan', 'l+_ryan', 'Ryan', 'l+', NULL, 0, 'Attack', 'Physical', 0, 1500, 0, 571, 3326, 29, 5, 150, 0, 0, 0, 0, 0),
('l+_silvesta', 'l+_silvesta', 'Silvesta', 'l+', NULL, 0, 'Magic', 'Magic', 0, 0, 1500, 571, 3326, 29, 5, 150, 0, 0, 0, 0, 0),
('l+_skuld', 'l+_skuld', 'Skuld', 'l+', NULL, 0, NULL, NULL, 0, 0, 0, 0, 0, 0, 5, 150, 0, 0, 0, 0, 0),
('l+_spike', 'l+_spike', 'Spike', 'l+', NULL, 0, 'Universal', 'Physical', 0, 1306, 0, 659, 3693, 25, 5, 150, 0, 0, 0, 0, 0),
('l+_sun_wukong', 'l+_sun_wukong', 'sun wukong', 'l+', '["l+_sun_wukong/1.webp","l+_sun_wukong/2.webp","l+_sun_wukong/3.webp","l+_sun_wukong/4.webp"]', 0, 'Universal', 'Magic', 0, 0, 1306, 659, 3693, 25, 5, 150, 0, 0, 0, 0, 0),
('l+_sung_jinwoo', 'l+_sung_jinwoo', 'Sung Jinwoo', 'l+', NULL, 0, 'Magic', 'Magic', 0, 0, 1500, 571, 3326, 29, 5, 150, 0, 0, 0, 0, 0),
('l+_teo', 'l+_teo', 'Teo', 'l+', NULL, 0, 'Attack', 'Physical', 0, 1500, 0, 571, 3326, 29, 5, 150, 0, 0, 0, 0, 0),
('l+_trude', 'l+_trude', 'Trude', 'l+', NULL, 0, 'Universal', 'Physical', 0, 1306, 0, 659, 3693, 25, 5, 150, 0, 0, 0, 0, 0),
('l+_vanessa', 'l+_vanessa', 'Vanessa', 'l+', NULL, 0, 'Magic', 'Magic', 0, 0, 1500, 571, 3326, 29, 5, 150, 0, 0, 0, 0, 0),
('l+_yeonhee', 'l+_yeonhee', 'Yeonhee', 'l+', NULL, 0, 'Magic', 'Magic', 0, 0, 1500, 571, 3326, 29, 5, 150, 0, 0, 0, 0, 0),
('l_alice', 'l_alice', 'Alice', 'l', NULL, 0, 'Support', 'Magic', 0, 0, 1095, 675, 4458, 19, 5, 150, 0, 0, 0, 0, 0),
('l_amelia', 'l_amelia', 'Amelia', 'l', NULL, 0, 'Attack', 'Physical', 0, 1500, 0, 571, 3326, 29, 5, 150, 0, 0, 0, 0, 0),
('l_aragon', 'l_aragon', 'Aragon', 'l', NULL, 0, 'Defense', 'Physical', 0, 727, 0, 892, 4825, 19, 5, 150, 0, 0, 0, 0, 0),
('l_bai_jiao', 'l_bai_jiao', 'Bai Jiao', 'l', NULL, 0, 'Universal', 'Magic', 0, 0, 1306, 659, 3693, 25, 5, 150, 0, 0, 0, 0, 0),
('l_bai_long', 'l_bai_long', 'Bai Long', 'l', NULL, 0, 'Attack', 'Physical', 0, 1500, 0, 571, 3326, 29, 5, 150, 0, 0, 0, 0, 0),
('l_ballista', 'l_ballista', 'Ballista', 'l', NULL, 0, 'Attack', 'Physical', 0, 1500, 0, 571, 3326, 29, 5, 150, 0, 0, 0, 0, 0),
('l_bi_dum', 'l_bi_dum', 'Bi Dum', 'l', NULL, 0, 'Attack', 'Physical', 0, 1500, 0, 571, 3326, 29, 5, 150, 0, 0, 0, 0, 0),
('l_cha_hae_in', 'l_cha_hae_in', 'Cha Hae In', 'l', NULL, 0, 'Attack', 'Physical', 0, 1500, 0, 571, 3326, 29, 5, 150, 0, 0, 0, 0, 0),
('l_chancellor', 'l_chancellor', 'Chancellor', 'l', NULL, 0, 'Universal', 'Physical', 0, 1306, 0, 659, 3693, 25, 5, 150, 0, 0, 0, 0, 0),
('l_daisy', 'l_daisy', 'Daisy', 'l', NULL, 0, 'Magic', 'Magic', 0, 0, 1500, 571, 3326, 29, 5, 150, 0, 0, 0, 0, 0),
('l_deo', 'l_deo', 'Deo', 'l', NULL, 0, 'Attack', 'Physical', 0, 1500, 0, 571, 3326, 29, 5, 150, 0, 0, 0, 0, 0),
('l_diaochan', 'l_diaochan', 'Diaochan', 'l', NULL, 0, 'Support', 'Magic', 0, 0, 1095, 675, 4458, 19, 5, 150, 0, 0, 0, 0, 0),
('l_espada', 'l_espada', 'Espada', 'l', NULL, 0, 'Magic', 'Magic', 0, 0, 1500, 571, 3326, 29, 5, 150, 0, 0, 0, 0, 0),
('l_guan_yu', 'l_guan_yu', 'Guan Yu', 'l', NULL, 0, 'Universal', 'Physical', 0, 1306, 0, 659, 3693, 25, 5, 150, 0, 0, 0, 0, 0),
('l_knox', 'l_knox', 'Knox', 'l', NULL, 0, 'Defense', 'Physical', 0, 727, 0, 892, 4825, 19, 5, 150, 0, 0, 0, 0, 0),
('l_lina', 'l_lina', 'Lina', 'l', NULL, 0, 'Support', 'Physical', 0, 1095, 0, 675, 4458, 19, 5, 150, 0, 0, 0, 0, 0),
('l_miho', 'l_miho', 'Miho', 'l', NULL, 0, 'Magic', 'Magic', 0, 0, 1500, 571, 3326, 29, 5, 150, 0, 0, 0, 0, 0),
('l_nia', 'l_nia', 'Nia', 'l', NULL, 0, 'Universal', 'Magic', 0, 0, 1306, 659, 3693, 25, 5, 150, 0, 0, 0, 0, 0),
('l_pascal', 'l_pascal', 'pascal', 'l', '["l_pascal/3.webp","l_pascal/4.webp","l_pascal/2.webp","l_pascal/1.webp"]', 1, 'Magic', 'Magic', 0, 0, 1500, 571, 3326, 29, 5, 150, 0, 0, 0, 0, 0),
('l_rook', 'l_rook', 'Rook', 'l', NULL, 0, 'Defense', 'Physical', 0, 727, 0, 892, 4825, 19, 5, 150, 0, 0, 0, 0, 0),
('l_ruri', 'l_ruri', 'Ruri', 'l', NULL, 0, 'Magic', 'Magic', 0, 0, 1500, 571, 3326, 29, 5, 150, 0, 0, 0, 0, 0),
('l_shane', 'l_shane', 'Shane', 'l', NULL, 0, 'Attack', 'Physical', 0, 1500, 0, 571, 3326, 29, 5, 150, 0, 0, 0, 0, 0),
('l_sieg', 'l_sieg', 'Sieg', 'l', NULL, 0, 'Universal', 'Physical', 0, 1306, 0, 659, 3693, 25, 5, 150, 0, 0, 0, 0, 0),
('l_taka', 'l_taka', 'Taka', 'l', NULL, 0, 'Attack', 'Physical', 0, 1500, 0, 571, 3326, 29, 5, 150, 0, 0, 0, 0, 0),
('l_velika', 'l_velika', 'Velika', 'l', NULL, 0, 'Magic', 'Magic', 0, 0, 1500, 571, 3326, 29, 5, 150, 0, 0, 0, 0, 0),
('l_xiao_qiao', 'l_xiao_qiao', 'Xiao Qiao', 'l', NULL, 0, 'Magic', 'Magic', 0, 0, 1500, 571, 3326, 29, 5, 150, 0, 0, 0, 0, 0),
('l_yu_shin', 'l_yu_shin', 'Yu Shin', 'l', NULL, 0, 'Magic', 'Magic', 0, 0, 1500, 571, 3326, 29, 5, 150, 0, 0, 0, 0, 0),
('r_ariel', 'r_ariel', 'Ariel', 'r', NULL, 0, 'Magic', 'Magic', 0, 0, 1389, 533, 3174, 25, 5, 150, 0, 0, 0, 0, 0),
('r_asura', 'r_asura', 'Asura', 'r', NULL, 0, 'Universal', 'Magic', 0, 0, 1238, 616, 3528, 21, 5, 150, 0, 0, 0, 0, 0),
('r_ben', 'r_ben', 'Ben', 'r', NULL, 0, 'Magic', 'Magic', 0, 0, 1389, 533, 3174, 25, 5, 150, 0, 0, 0, 0, 0),
('r_black_rose', 'r_black_rose', 'Black Rose', 'r', NULL, 0, 'Attack', 'Physical', 0, 1389, 0, 533, 3174, 25, 5, 150, 0, 0, 0, 0, 0),
('r_catty', 'r_catty', 'Catty', 'r', NULL, 0, 'Attack', 'Physical', 0, 1389, 0, 533, 3174, 25, 5, 150, 0, 0, 0, 0, 0),
('r_chloe', 'r_chloe', 'Chloe', 'r', NULL, 0, 'Support', 'Magic', 0, 0, 1035, 632, 4248, 16, 5, 150, 0, 0, 0, 0, 0),
('r_cleo', 'r_cleo', 'Cleo', 'r', NULL, 0, 'Magic', 'Physical', 0, 1389, 0, 533, 3174, 25, 5, 150, 0, 0, 0, 0, 0),
('r_evan', 'r_evan', 'Evan', 'r', NULL, 0, 'Defense', 'Physical', 0, 704, 0, 818, 4572, 16, 5, 150, 0, 0, 0, 0, 0),
('r_feng_yan', 'r_feng_yan', 'Feng Yan', 'r', NULL, 0, 'Attack', 'Physical', 0, 1389, 0, 533, 3174, 25, 5, 150, 0, 0, 0, 0, 0),
('r_heavenia', 'r_heavenia', 'Heavenia', 'r', NULL, 0, 'Attack', 'Physical', 0, 1389, 0, 533, 3174, 25, 5, 150, 0, 0, 0, 0, 0),
('r_hellenia', 'r_hellenia', 'Hellenia', 'r', NULL, 0, 'Defense', 'Physical', 0, 704, 0, 818, 4572, 16, 5, 150, 0, 0, 0, 0, 0),
('r_hokin', 'r_hokin', 'Hokin', 'r', NULL, 0, 'Attack', 'Physical', 0, 1389, 0, 533, 3174, 25, 5, 150, 0, 0, 0, 0, 0),
('r_jane', 'r_jane', 'Jane', 'r', NULL, 0, 'Attack', 'Physical', 0, 1389, 0, 533, 3174, 25, 5, 150, 0, 0, 0, 0, 0),
('r_jin', 'r_jin', 'Jin', 'r', NULL, 0, 'Attack', 'Physical', 0, 1389, 0, 533, 3174, 25, 5, 150, 0, 0, 0, 0, 0),
('r_joker', 'r_joker', 'Joker', 'r', NULL, 0, 'Magic', 'Magic', 0, 0, 1389, 533, 3174, 25, 5, 150, 0, 0, 0, 0, 0),
('r_jupy', 'r_jupy', 'Jupy', 'r', NULL, 0, 'Attack', 'Physical', 0, 1389, 0, 533, 3174, 25, 5, 150, 0, 0, 0, 0, 0),
('r_karin', 'r_karin', 'Karin', 'r', NULL, 0, 'Support', 'Magic', 0, 0, 1035, 632, 4248, 16, 5, 150, 0, 0, 0, 0, 0),
('r_karon', 'r_karon', 'Karon', 'r', NULL, 0, 'Support', 'Magic', 0, 0, 1035, 632, 4248, 16, 5, 150, 0, 0, 0, 0, 0),
('r_lania', 'r_lania', 'Lania', 'r', NULL, 0, 'Universal', 'Magic', 0, 0, 1238, 616, 3528, 21, 5, 150, 0, 0, 0, 0, 0),
('r_lee_joohee', 'r_lee_joohee', 'Lee Joohee', 'r', NULL, 0, 'Support', 'Magic', 0, 0, 1035, 632, 4248, 16, 5, 150, 0, 0, 0, 0, 0),
('r_leo', 'r_leo', 'Leo', 'r', NULL, 0, 'Attack', 'Physical', 0, 1389, 0, 533, 3174, 25, 5, 150, 0, 0, 0, 0, 0),
('r_li', 'r_li', 'Li', 'r', NULL, 0, 'Defense', 'Physical', 0, 704, 0, 818, 4572, 16, 5, 150, 0, 0, 0, 0, 0),
('r_ling_ling', 'r_ling_ling', 'Ling Ling', 'r', NULL, 0, 'Magic', 'Magic', 0, 0, 1389, 533, 3174, 25, 5, 150, 0, 0, 0, 0, 0),
('r_lucy', 'r_lucy', 'Lucy', 'r', NULL, 0, 'Support', 'Magic', 0, 0, 1035, 632, 4248, 16, 5, 150, 0, 0, 0, 0, 0),
('r_may', 'r_may', 'May', 'r', NULL, 0, 'Attack', 'Physical', 0, 1389, 0, 533, 3174, 25, 5, 150, 0, 0, 0, 0, 0),
('r_noho', 'r_noho', 'Noho', 'r', NULL, 0, 'Magic', 'Magic', 0, 0, 1389, 533, 3174, 25, 5, 150, 0, 0, 0, 0, 0),
('r_rahkun', 'r_rahkun', 'Rahkun', 'r', NULL, 0, 'Defense', 'Physical', 0, 704, 0, 818, 4572, 16, 5, 150, 0, 0, 0, 0, 0),
('r_rei', 'r_rei', 'Rei', 'r', NULL, 0, 'Attack', 'Physical', 0, 1389, 0, 533, 3174, 25, 5, 150, 0, 0, 0, 0, 0),
('r_sarah', 'r_sarah', 'Sarah', 'r', NULL, 0, 'Support', 'Magic', 0, 0, 1035, 632, 4248, 16, 5, 150, 0, 0, 0, 0, 0),
('r_sera', 'r_sera', 'Sera', 'r', NULL, 0, 'Magic', 'Magic', 0, 0, 1389, 533, 3174, 25, 5, 150, 0, 0, 0, 0, 0),
('r_snipper', 'r_snipper', 'Snipper', 'r', NULL, 0, 'Attack', 'Physical', 0, 1389, 0, 533, 3174, 25, 5, 150, 0, 0, 0, 0, 0),
('r_soi', 'r_soi', 'Soi', 'r', NULL, 0, 'Attack', 'Physical', 0, 1389, 0, 533, 3174, 25, 5, 150, 0, 0, 0, 0, 0),
('r_sylvia', 'r_sylvia', 'Sylvia', 'r', NULL, 0, 'Magic', 'Magic', 0, 0, 1389, 533, 3174, 25, 5, 150, 0, 0, 0, 0, 0),
('r_victoria', 'r_victoria', 'Victoria', 'r', NULL, 0, 'Universal', 'Magic', 0, 0, 1238, 616, 3528, 21, 5, 150, 0, 0, 0, 0, 0),
('r_xiao', 'r_xiao', 'Xiao', 'r', NULL, 0, 'Attack', 'Physical', 0, 1389, 0, 533, 3174, 25, 5, 150, 0, 0, 0, 0, 0),
('r_yoo_jinho', 'r_yoo_jinho', 'Yoo Jinho', 'r', NULL, 0, 'Defense', 'Physical', 0, 704, 0, 818, 4572, 16, 5, 150, 0, 0, 0, 0, 0),
('r_yui', 'r_yui', 'Yui', 'r', NULL, 0, 'Support', 'Magic', 0, 0, 1035, 632, 4248, 16, 5, 150, 0, 0, 0, 0, 0),
('r_yuri', 'r_yuri', 'Yuri', 'r', NULL, 0, 'Magic', 'Magic', 0, 0, 1389, 533, 3174, 25, 5, 150, 0, 0, 0, 0, 0),
('r_zhao_yun', 'r_zhao_yun', 'Zhao Yun', 'r', NULL, 0, 'Attack', 'Physical', 0, 1389, 0, 533, 3174, 25, 5, 150, 0, 0, 0, 0, 0),
('uc_aaron', 'uc_aaron', 'Aaron', 'uc', NULL, 0, NULL, NULL, 0, 0, 0, 0, 0, 0, 5, 150, 0, 0, 0, 0, 0),
('uc_ahkan', 'uc_ahkan', 'Ahkan', 'uc', NULL, 0, NULL, NULL, 0, 0, 0, 0, 0, 0, 5, 150, 0, 0, 0, 0, 0),
('uc_baron', 'uc_baron', 'Baron', 'uc', NULL, 0, NULL, NULL, 0, 0, 0, 0, 0, 0, 5, 150, 0, 0, 0, 0, 0),
('uc_bella', 'uc_bella', 'Bella', 'uc', NULL, 0, NULL, NULL, 0, 0, 0, 0, 0, 0, 5, 150, 0, 0, 0, 0, 0),
('uc_beskin', 'uc_beskin', 'Beskin', 'uc', NULL, 0, NULL, NULL, 0, 0, 0, 0, 0, 0, 5, 150, 0, 0, 0, 0, 0),
('uc_clops', 'uc_clops', 'Clops', 'uc', NULL, 0, NULL, NULL, 0, 0, 0, 0, 0, 0, 5, 150, 0, 0, 0, 0, 0),
('uc_coco', 'uc_coco', 'Coco', 'uc', NULL, 0, NULL, NULL, 0, 0, 0, 0, 0, 0, 5, 150, 0, 0, 0, 0, 0),
('uc_derek', 'uc_derek', 'Derek', 'uc', NULL, 0, NULL, NULL, 0, 0, 0, 0, 0, 0, 5, 150, 0, 0, 0, 0, 0),
('uc_dragon', 'uc_dragon', 'Dragon', 'uc', NULL, 0, NULL, NULL, 0, 0, 0, 0, 0, 0, 5, 150, 0, 0, 0, 0, 0),
('uc_drillo', 'uc_drillo', 'Drillo', 'uc', NULL, 0, NULL, NULL, 0, 0, 0, 0, 0, 0, 5, 150, 0, 0, 0, 0, 0),
('uc_ellen', 'uc_ellen', 'Ellen', 'uc', NULL, 0, NULL, NULL, 0, 0, 0, 0, 0, 0, 5, 150, 0, 0, 0, 0, 0),
('uc_ellin', 'uc_ellin', 'Ellin', 'uc', NULL, 0, NULL, NULL, 0, 0, 0, 0, 0, 0, 5, 150, 0, 0, 0, 0, 0),
('uc_guppy', 'uc_guppy', 'Guppy', 'uc', NULL, 0, NULL, NULL, 0, 0, 0, 0, 0, 0, 5, 150, 0, 0, 0, 0, 0),
('uc_howl', 'uc_howl', 'Howl', 'uc', NULL, 0, NULL, NULL, 0, 0, 0, 0, 0, 0, 5, 150, 0, 0, 0, 0, 0),
('uc_ichi', 'uc_ichi', 'Ichi', 'uc', NULL, 0, NULL, NULL, 0, 0, 0, 0, 0, 0, 5, 150, 0, 0, 0, 0, 0),
('uc_jak', 'uc_jak', 'Jak', 'uc', NULL, 0, NULL, NULL, 0, 0, 0, 0, 0, 0, 5, 150, 0, 0, 0, 0, 0),
('uc_jas', 'uc_jas', 'Jas', 'uc', NULL, 0, NULL, NULL, 0, 0, 0, 0, 0, 0, 5, 150, 0, 0, 0, 0, 0),
('uc_jumon', 'uc_jumon', 'Jumon', 'uc', NULL, 0, NULL, NULL, 0, 0, 0, 0, 0, 0, 5, 150, 0, 0, 0, 0, 0),
('uc_kai', 'uc_kai', 'Kai', 'uc', NULL, 0, NULL, NULL, 0, 0, 0, 0, 0, 0, 5, 150, 0, 0, 0, 0, 0),
('uc_kang_jae', 'uc_kang_jae', 'Kang Jae', 'uc', NULL, 0, NULL, NULL, 0, 0, 0, 0, 0, 0, 5, 150, 0, 0, 0, 0, 0),
('uc_kohkun', 'uc_kohkun', 'Kohkun', 'uc', NULL, 0, NULL, NULL, 0, 0, 0, 0, 0, 0, 5, 150, 0, 0, 0, 0, 0),
('uc_loto', 'uc_loto', 'Loto', 'uc', NULL, 0, NULL, NULL, 0, 0, 0, 0, 0, 0, 5, 150, 0, 0, 0, 0, 0),
('uc_nami', 'uc_nami', 'Nami', 'uc', NULL, 0, NULL, NULL, 0, 0, 0, 0, 0, 0, 5, 150, 0, 0, 0, 0, 0),
('uc_pepe', 'uc_pepe', 'Pepe', 'uc', NULL, 0, NULL, NULL, 0, 0, 0, 0, 0, 0, 5, 150, 0, 0, 0, 0, 0),
('uc_phoenix', 'uc_phoenix', 'Phoenix', 'uc', NULL, 0, NULL, NULL, 0, 0, 0, 0, 0, 0, 5, 150, 0, 0, 0, 0, 0),
('uc_pon', 'uc_pon', 'Pon', 'uc', NULL, 0, NULL, NULL, 0, 0, 0, 0, 0, 0, 5, 150, 0, 0, 0, 0, 0),
('uc_rocky', 'uc_rocky', 'Rocky', 'uc', NULL, 0, NULL, NULL, 0, 0, 0, 0, 0, 0, 5, 150, 0, 0, 0, 0, 0),
('uc_rowl', 'uc_rowl', 'Rowl', 'uc', NULL, 0, NULL, NULL, 0, 0, 0, 0, 0, 0, 5, 150, 0, 0, 0, 0, 0),
('uc_shiro', 'uc_shiro', 'Shiro', 'uc', NULL, 0, NULL, NULL, 0, 0, 0, 0, 0, 0, 5, 150, 0, 0, 0, 0, 0),
('uc_skud', 'uc_skud', 'Skud', 'uc', NULL, 0, NULL, NULL, 0, 0, 0, 0, 0, 0, 5, 150, 0, 0, 0, 0, 0),
('uc_skull', 'uc_skull', 'Skull', 'uc', NULL, 0, NULL, NULL, 0, 0, 0, 0, 0, 0, 5, 150, 0, 0, 0, 0, 0),
('uc_smoky', 'uc_smoky', 'Smoky', 'uc', NULL, 0, NULL, NULL, 0, 0, 0, 0, 0, 0, 5, 150, 0, 0, 0, 0, 0),
('uc_taurus', 'uc_taurus', 'Taurus', 'uc', NULL, 0, NULL, NULL, 0, 0, 0, 0, 0, 0, 5, 150, 0, 0, 0, 0, 0),
('uc_toto', 'uc_toto', 'Toto', 'uc', NULL, 0, NULL, NULL, 0, 0, 0, 0, 0, 0, 5, 150, 0, 0, 0, 0, 0),
('uc_wendy', 'uc_wendy', 'Wendy', 'uc', NULL, 0, NULL, NULL, 0, 0, 0, 0, 0, 0, 5, 150, 0, 0, 0, 0, 0),
('uc_yumi', 'uc_yumi', 'Yumi', 'uc', NULL, 0, NULL, NULL, 0, 0, 0, 0, 0, 0, 5, 150, 0, 0, 0, 0, 0);

-- Table structure for table `items`
DROP TABLE IF EXISTS `items`;
CREATE TABLE `items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(200) NOT NULL,
  `grade` varchar(50) NOT NULL,
  `item_type` enum('Weapon','Armor','Accessory') NOT NULL,
  `weapon_group` varchar(100) DEFAULT NULL,
  `item_set` varchar(100) DEFAULT NULL,
  `atk_all_perc` int DEFAULT '0',
  `def_perc` int DEFAULT '0',
  `hp_perc` int DEFAULT '0',
  `image` varchar(255) NOT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) /*T![clustered_index] CLUSTERED */
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin AUTO_INCREMENT=30001;

-- Dumping data for table `items`
INSERT INTO `items` (`id`, `name`, `grade`, `item_type`, `weapon_group`, `item_set`, `atk_all_perc`, `def_perc`, `hp_perc`, `image`, `created_at`) VALUES
(1, 'Brilliant Dragon Orb', 'l+', 'Weapon', 'Magic', 'Bounty Tracker', 15, 0, 0, 'Brilliant_Dragon_Orb_Bounty_Tracker.webp', '2026-06-23 19:30:58'),
(2, 'Brilliant Dragon Orb', 'l+', 'Weapon', 'Magic', 'Paladin', 15, 0, 0, 'Brilliant_Dragon_Orb_Paladin.webp', '2026-06-23 19:30:58'),
(3, 'Brilliant Dragon Orb', 'l+', 'Weapon', 'Magic', 'Vanguard', 15, 0, 0, 'Brilliant_Dragon_Orb_Vanguard.webp', '2026-06-23 19:30:58'),
(4, 'Brilliant Dragon Slayer', 'l+', 'Weapon', 'Physical', 'Bounty Tracker', 15, 0, 0, 'Brilliant_Dragon_Slayer_Bounty_Tracker.webp', '2026-06-23 19:30:58'),
(5, 'Brilliant Dragon Slayer', 'l+', 'Weapon', 'Physical', 'Paladin', 15, 0, 0, 'Brilliant_Dragon_Slayer_Paladin.webp', '2026-06-23 19:30:59'),
(6, 'Brilliant Dragon Slayer', 'l+', 'Weapon', 'Physical', 'Vanguard', 15, 0, 0, 'Brilliant_Dragon_Slayer_Vanguard.webp', '2026-06-23 19:30:59'),
(7, 'Brilliant Hydra Staff', 'l+', 'Weapon', 'Magic', 'Avenger', 15, 0, 0, 'Brilliant_Hydra_Staff_Avenger.webp', '2026-06-23 19:30:59'),
(8, 'Brilliant Hydra Staff', 'l+', 'Weapon', 'Magic', 'Orchestrator', 15, 0, 0, 'Brilliant_Hydra_Staff_Orchestrator.webp', '2026-06-23 19:30:59'),
(9, 'Brilliant Hydra Staff', 'l+', 'Weapon', 'Magic', 'Spellweaver', 15, 0, 0, 'Brilliant_Hydra_Staff_Spellweaver.webp', '2026-06-23 19:30:59'),
(10, 'Brilliant Hydra Sword', 'l+', 'Weapon', 'Physical', 'Avenger', 15, 0, 0, 'Brilliant_Hydra_Sword_Avenger.webp', '2026-06-23 19:30:59'),
(11, 'Brilliant Hydra Sword', 'l+', 'Weapon', 'Physical', 'Orchestrator', 15, 0, 0, 'Brilliant_Hydra_Sword_Orchestrator.webp', '2026-06-23 19:30:59'),
(12, 'Brilliant Hydra Sword', 'l+', 'Weapon', 'Physical', 'Spellweaver', 15, 0, 0, 'Brilliant_Hydra_Sword_Spellweaver.webp', '2026-06-23 19:30:59'),
(13, 'Brilliant Ox King Flail', 'l+', 'Weapon', 'Physical', 'Assassin', 15, 0, 0, 'Brilliant_Ox_King_Flail_Assassin.webp', '2026-06-23 19:30:59'),
(14, 'Brilliant Ox King Flail', 'l+', 'Weapon', 'Physical', 'Gatekeeper', 15, 0, 0, 'Brilliant_Ox_King_Flail_Gatekeeper.webp', '2026-06-23 19:30:59'),
(15, 'Brilliant Ox King Flail', 'l+', 'Weapon', 'Physical', 'Guardian', 15, 0, 0, 'Brilliant_Ox_King_Flail_Guardian.webp', '2026-06-23 19:30:59'),
(16, 'Brilliant Ox King Scripture', 'l+', 'Weapon', 'Magic', 'Assassin', 15, 0, 0, 'Brilliant_Ox_King_Scripture_Assassin.webp', '2026-06-23 19:30:59'),
(17, 'Brilliant Ox King Scripture', 'l+', 'Weapon', 'Magic', 'Gatekeeper', 15, 0, 0, 'Brilliant_Ox_King_Scripture_Gatekeeper.webp', '2026-06-23 19:31:00'),
(18, 'Brilliant Ox King Scripture', 'l+', 'Weapon', 'Magic', 'Guardian', 15, 0, 0, 'Brilliant_Ox_King_Scripture_Guardian.webp', '2026-06-23 19:31:00'),
(19, 'Brilliant Dragon Scale Armor', 'l+', 'Armor', NULL, 'Bounty Tracker', 0, 15, 0, 'Brilliant_Dragon_Scale_Armor_Bounty_Tracker.webp', '2026-06-23 19:31:00'),
(20, 'Brilliant Dragon Scale Armor', 'l+', 'Armor', NULL, 'Paladin', 0, 15, 0, 'Brilliant_Dragon_Scale_Armor_Paladin.webp', '2026-06-23 19:31:00'),
(21, 'Brilliant Dragon Scale Armor', 'l+', 'Armor', NULL, 'Vanguard', 0, 15, 0, 'Brilliant_Dragon_Scale_Armor_Vanguard.webp', '2026-06-23 19:31:00'),
(22, 'Brilliant Hydra Armor', 'l+', 'Armor', NULL, 'Avenger', 0, 15, 0, 'Brilliant_Hydra_Armor_Avenger.webp', '2026-06-23 19:31:00'),
(23, 'Brilliant Hydra Armor', 'l+', 'Armor', NULL, 'Orchestrator', 0, 15, 0, 'Brilliant_Hydra_Armor_Orchestrator.webp', '2026-06-23 19:31:00'),
(24, 'Brilliant Hydra Armor', 'l+', 'Armor', NULL, 'Spellweaver', 0, 15, 0, 'Brilliant_Hydra_Armor_Spellweaver.webp', '2026-06-23 19:31:00'),
(25, 'Brilliant Ox King Armor', 'l+', 'Armor', NULL, 'Assassin', 0, 15, 0, 'Brilliant_Ox_King_Armor_Assassin.webp', '2026-06-23 19:31:00'),
(26, 'Brilliant Ox King Armor', 'l+', 'Armor', NULL, 'Gatekeeper', 0, 15, 0, 'Brilliant_Ox_King_Armor_Gatekeeper.webp', '2026-06-23 19:31:00'),
(27, 'Brilliant Ox King Armor', 'l+', 'Armor', NULL, 'Guardian', 0, 15, 0, 'Brilliant_Ox_King_Armor_Guardian.webp', '2026-06-23 19:31:00'),
(28, 'Accuracy', 'c', 'Accessory', NULL, NULL, 0, 0, 0, 'c_accuracy.webp', '2026-06-23 19:31:01'),
(29, 'Concentration', 'c', 'Accessory', NULL, NULL, 0, 0, 0, 'c_concentration.webp', '2026-06-23 19:31:01'),
(30, 'Defend', 'c', 'Accessory', NULL, NULL, 0, 0, 0, 'c_defend.webp', '2026-06-23 19:31:01'),
(31, 'Fortune', 'c', 'Accessory', NULL, NULL, 0, 0, 0, 'c_fortune.webp', '2026-06-23 19:31:01'),
(32, 'Nature', 'c', 'Accessory', NULL, NULL, 0, 0, 0, 'c_nature.webp', '2026-06-23 19:31:01'),
(33, 'Protection', 'c', 'Accessory', NULL, NULL, 0, 0, 0, 'c_protection.webp', '2026-06-23 19:31:01'),
(34, 'Resistance', 'c', 'Accessory', NULL, NULL, 0, 0, 0, 'c_resistance.webp', '2026-06-23 19:31:01'),
(35, 'Vengeance', 'c', 'Accessory', NULL, NULL, 0, 0, 0, 'c_vengeance.webp', '2026-06-23 19:31:01'),
(36, 'Authority', 'l', 'Accessory', NULL, NULL, 0, 0, 0, 'l_authority.webp', '2026-06-23 19:31:01'),
(37, 'Immortality', 'l', 'Accessory', NULL, NULL, 0, 0, 0, 'l_immortality.webp', '2026-06-23 19:31:01'),
(38, 'Resurrection', 'l', 'Accessory', NULL, NULL, 0, 0, 0, 'l_resurrection.webp', '2026-06-23 19:31:01'),
(39, 'Annihilation', 'r', 'Accessory', NULL, NULL, 0, 0, 0, 'r_annihilation.webp', '2026-06-23 19:31:02'),
(40, 'Bulwark', 'r', 'Accessory', NULL, NULL, 0, 0, 0, 'r_bulwark.webp', '2026-06-23 19:31:02'),
(41, 'Health', 'r', 'Accessory', NULL, NULL, 0, 0, 0, 'r_health.webp', '2026-06-23 19:31:02'),
(42, 'Roar', 'r', 'Accessory', NULL, NULL, 0, 0, 0, 'r_roar.webp', '2026-06-23 19:31:02'),
(43, 'Siege', 'r', 'Accessory', NULL, NULL, 0, 0, 0, 'r_siege.webp', '2026-06-23 19:31:02'),
(44, 'Subjugation', 'r', 'Accessory', NULL, NULL, 0, 0, 0, 'r_subjugation.webp', '2026-06-23 19:31:02'),
(45, 'Tenacity', 'r', 'Accessory', NULL, NULL, 0, 0, 0, 'r_tenacity.webp', '2026-06-23 19:31:02'),
(46, 'Brilliance', 'uc', 'Accessory', NULL, NULL, 0, 0, 0, 'un_brilliance.webp', '2026-06-23 19:31:02'),
(47, 'Chance', 'uc', 'Accessory', NULL, NULL, 0, 0, 0, 'un_chance.webp', '2026-06-23 19:31:02'),
(48, 'Curses', 'uc', 'Accessory', NULL, NULL, 0, 0, 0, 'un_curses.webp', '2026-06-23 19:31:02'),
(49, 'Death', 'uc', 'Accessory', NULL, NULL, 0, 0, 0, 'un_death.webp', '2026-06-23 19:31:02'),
(50, 'Doom', 'uc', 'Accessory', NULL, NULL, 0, 0, 0, 'un_doom.webp', '2026-06-23 19:31:02'),
(51, 'Dreams', 'uc', 'Accessory', NULL, NULL, 0, 0, 0, 'un_dreams.webp', '2026-06-23 19:31:03'),
(52, 'Horror', 'uc', 'Accessory', NULL, NULL, 0, 0, 0, 'un_horror.webp', '2026-06-23 19:31:03'),
(53, 'Magic', 'uc', 'Accessory', NULL, NULL, 0, 0, 0, 'un_magic.webp', '2026-06-23 19:31:03'),
(54, 'Medusa', 'uc', 'Accessory', NULL, NULL, 0, 0, 0, 'un_medusa.webp', '2026-06-23 19:31:03'),
(55, 'Salamander', 'uc', 'Accessory', NULL, NULL, 0, 0, 0, 'un_salamander.webp', '2026-06-23 19:31:03'),
(56, 'Snow', 'uc', 'Accessory', NULL, NULL, 0, 0, 0, 'un_snow.webp', '2026-06-23 19:31:03'),
(57, 'Thorns', 'uc', 'Accessory', NULL, NULL, 0, 0, 0, 'un_thorns.webp', '2026-06-23 19:31:03'),
(58, 'Time', 'uc', 'Accessory', NULL, NULL, 0, 0, 0, 'un_time.webp', '2026-06-23 19:31:03'),
(59, 'Viper', 'uc', 'Accessory', NULL, NULL, 0, 0, 0, 'un_viper.webp', '2026-06-23 19:31:03');

-- Table structure for table `pets`
DROP TABLE IF EXISTS `pets`;
CREATE TABLE `pets` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(200) NOT NULL,
  `grade` varchar(50) NOT NULL,
  `atk_all` int NOT NULL,
  `def` int NOT NULL,
  `hp` int NOT NULL,
  `image` varchar(255) NOT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) /*T![clustered_index] CLUSTERED */
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin AUTO_INCREMENT=30001;

-- Dumping data for table `pets`
INSERT INTO `pets` (`id`, `name`, `grade`, `atk_all`, `def`, `hp`, `image`, `created_at`) VALUES
(1, 'Dello', 'l', 564, 344, 1895, 'l_dello.webp', '2026-06-23 19:25:18'),
(2, 'Eirin', 'l', 564, 344, 1895, 'l_eirin.webp', '2026-06-23 19:25:18'),
(3, 'Eri', 'l', 564, 344, 1895, 'l_eri.webp', '2026-06-23 19:25:18'),
(4, 'Jeb', 'l', 564, 344, 1895, 'l_jeb.webp', '2026-06-23 19:25:18'),
(5, 'Jeo', 'l', 564, 344, 1895, 'l_jeo.webp', '2026-06-23 19:25:18'),
(6, 'Karam', 'l', 564, 344, 1895, 'l_karam.webp', '2026-06-23 19:25:19'),
(7, 'Kree', 'l', 564, 344, 1895, 'l_kree.webp', '2026-06-23 19:25:19'),
(8, 'Merparrow', 'l', 564, 344, 1895, 'l_merparrow.webp', '2026-06-23 19:25:19'),
(9, 'Mick', 'l', 564, 344, 1895, 'l_mick.webp', '2026-06-23 19:25:20'),
(10, 'Mole', 'l', 564, 344, 1895, 'l_mole.webp', '2026-06-23 19:25:20'),
(11, 'Pike', 'l', 564, 344, 1895, 'l_pike.webp', '2026-06-23 19:25:22'),
(12, 'Richel', 'l', 564, 344, 1895, 'l_richel.webp', '2026-06-23 19:25:23'),
(13, 'Ruu', 'l', 564, 344, 1895, 'l_ruu.webp', '2026-06-23 19:25:27'),
(14, 'Windy', 'l', 564, 344, 1895, 'l_windy.webp', '2026-06-23 19:25:27'),
(15, 'Yeonji', 'l', 564, 344, 1895, 'l_yeonji.webp', '2026-06-23 19:25:27'),
(16, 'Yorang', 'l', 564, 344, 1895, 'l_yorang.webp', '2026-06-23 19:25:27'),
(17, 'Yu', 'l', 564, 344, 1895, 'l_yu.webp', '2026-06-23 19:25:27'),
(18, 'Croa', 'r', 371, 226, 1246, 'r_croa.webp', '2026-06-23 19:25:27'),
(19, 'Doo', 'r', 371, 226, 1246, 'r_doo.webp', '2026-06-23 19:25:27'),
(20, 'Hellepin', 'r', 371, 226, 1246, 'r_hellepin.webp', '2026-06-23 19:25:27'),
(21, 'Little Feng', 'r', 371, 226, 1246, 'r_little_feng.webp', '2026-06-23 19:25:27'),
(22, 'Mewmew', 'r', 371, 226, 1246, 'r_mewmew.webp', '2026-06-23 19:25:27'),
(23, 'Mimic', 'r', 371, 226, 1246, 'r_mimic.webp', '2026-06-23 19:25:27'),
(24, 'Nikki', 'r', 371, 226, 1246, 'r_nikki.webp', '2026-06-23 19:25:28'),
(25, 'Nina', 'r', 371, 226, 1246, 'r_nina.webp', '2026-06-23 19:25:28'),
(26, 'Note', 'r', 371, 226, 1246, 'r_note.webp', '2026-06-23 19:25:28'),
(27, 'Paragon', 'r', 371, 226, 1246, 'r_paragon.webp', '2026-06-23 19:25:28'),
(28, 'Sherry', 'r', 371, 226, 1246, 'r_sherry.webp', '2026-06-23 19:25:28');

-- Table structure for table `raid_sets`
DROP TABLE IF EXISTS `raid_sets`;
CREATE TABLE `raid_sets` (
  `id` int NOT NULL AUTO_INCREMENT,
  `raid_key` varchar(50) NOT NULL,
  `set_index` int NOT NULL DEFAULT '1',
  `formation` varchar(50) NOT NULL,
  `pet_file` varchar(255) DEFAULT NULL,
  `heroes_json` json DEFAULT NULL,
  `skill_rotation` json DEFAULT NULL,
  `video_url` varchar(500) DEFAULT NULL,
  `note` text DEFAULT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) /*T![clustered_index] CLUSTERED */
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- Table structure for table `site_settings`
DROP TABLE IF EXISTS `site_settings`;
CREATE TABLE `site_settings` (
  `setting_key` varchar(100) NOT NULL,
  `setting_value` text NOT NULL,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`setting_key`) /*T![clustered_index] CLUSTERED */
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- Dumping data for table `site_settings`
INSERT INTO `site_settings` (`setting_key`, `setting_value`, `updated_at`) VALUES
('contact_form_enabled', 'true', '2026-06-23 19:15:05'),
('migration_v1_ext_strip', 'done', '2026-06-23 19:15:06');

-- Table structure for table `site_updates`
DROP TABLE IF EXISTS `site_updates`;
CREATE TABLE `site_updates` (
  `id` int NOT NULL AUTO_INCREMENT,
  `content_type` varchar(50) NOT NULL,
  `target_name` varchar(200) NOT NULL,
  `action_type` enum('CREATE','UPDATE','DELETE') NOT NULL DEFAULT 'UPDATE',
  `message` varchar(500) NOT NULL,
  `admin_name` varchar(100) DEFAULT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) /*T![clustered_index] CLUSTERED */
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- Table structure for table `stage_setups`
DROP TABLE IF EXISTS `stage_setups`;
CREATE TABLE `stage_setups` (
  `id` int NOT NULL AUTO_INCREMENT,
  `type` enum('stage','nightmare') NOT NULL DEFAULT 'stage',
  `name` varchar(255) NOT NULL,
  `note` text DEFAULT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) /*T![clustered_index] CLUSTERED */
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- Table structure for table `teams`
DROP TABLE IF EXISTS `teams`;
CREATE TABLE `teams` (
  `id` int NOT NULL AUTO_INCREMENT,
  `setup_id` int NOT NULL,
  `team_index` int NOT NULL DEFAULT '1',
  `formation` varchar(50) NOT NULL,
  `pet_file` varchar(255) DEFAULT NULL,
  `heroes_json` json DEFAULT NULL,
  PRIMARY KEY (`id`) /*T![clustered_index] CLUSTERED */,
  KEY `fk_1` (`setup_id`),
  CONSTRAINT `fk_teams_setup` FOREIGN KEY (`setup_id`) REFERENCES `stage_setups` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- Table structure for table `tierlist`
DROP TABLE IF EXISTS `tierlist`;
CREATE TABLE `tierlist` (
  `id` int NOT NULL AUTO_INCREMENT,
  `hero_filename` varchar(255) DEFAULT NULL,
  `category` varchar(50) DEFAULT NULL,
  `rank_tier` varchar(10) DEFAULT NULL,
  `hero_type` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`) /*T![clustered_index] CLUSTERED */,
  UNIQUE KEY `unique_hero_cat` (`hero_filename`,`category`),
  CONSTRAINT `fk_tierlist_hero` FOREIGN KEY (`hero_filename`) REFERENCES `heroes` (`filename`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- Table structure for table `total_war_sets`
DROP TABLE IF EXISTS `total_war_sets`;
CREATE TABLE `total_war_sets` (
  `id` int NOT NULL AUTO_INCREMENT,
  `tier` enum('legendary','superb','elite','normal') NOT NULL,
  `set_index` int NOT NULL DEFAULT '1',
  `set_name` varchar(100) DEFAULT NULL,
  `note` text DEFAULT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) /*T![clustered_index] CLUSTERED */
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- Table structure for table `total_war_teams`
DROP TABLE IF EXISTS `total_war_teams`;
CREATE TABLE `total_war_teams` (
  `id` int NOT NULL AUTO_INCREMENT,
  `set_id` int NOT NULL,
  `team_index` int NOT NULL DEFAULT '1',
  `team_name` varchar(100) DEFAULT NULL,
  `formation` varchar(50) NOT NULL DEFAULT '2-3',
  `pet_file` varchar(255) DEFAULT NULL,
  `heroes_json` json DEFAULT NULL,
  `skill_rotation` json DEFAULT NULL,
  `video_url` varchar(500) DEFAULT NULL,
  `note` text DEFAULT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) /*T![clustered_index] CLUSTERED */,
  KEY `fk_1` (`set_id`),
  CONSTRAINT `fk_total_war_set` FOREIGN KEY (`set_id`) REFERENCES `total_war_sets` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- Table structure for table `users`
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(100) NOT NULL,
  `password_hash` text NOT NULL,
  `role` enum('super_admin','admin') NOT NULL DEFAULT 'admin',
  `permissions` json DEFAULT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) /*T![clustered_index] CLUSTERED */,
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin AUTO_INCREMENT=60001;

-- Dumping data for table `users`
INSERT INTO `users` (`id`, `username`, `password_hash`, `role`, `permissions`, `created_at`) VALUES
(1, 'admin', '$2b$12$7.5X45FpcR/1Sh9P/cOQouJIGQb3tHZrrWnEXO7xceKy9vXuhbAFy', 'super_admin', '["*"]', '2026-06-23 19:15:05'),
(30001, 'testadmin', '$2b$10$2nIy2Qxq2zpTFV05Lp1SWeZvllL4MJkKvQRdLQtQwDS7I6IzC2gC6', 'admin', '["MANAGE_BUILDS"]', '2026-06-24 01:24:50');

SET FOREIGN_KEY_CHECKS = 1;

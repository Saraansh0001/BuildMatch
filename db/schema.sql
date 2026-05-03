-- db/schema.sql
-- Drop order: child tables first (FK-safe)
CREATE DATABASE IF NOT EXISTS `investment_portfolio` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `investment_portfolio`;

DROP TABLE IF EXISTS `mf_holdings`;
DROP TABLE IF EXISTS `holds_stock`;
DROP TABLE IF EXISTS `mf_transactions`;
DROP TABLE IF EXISTS `stock_transactions`;
DROP TABLE IF EXISTS `mutual_funds`;
DROP TABLE IF EXISTS `stocks`;
DROP TABLE IF EXISTS `users`;

-- =========================================================
-- USERS
-- =========================================================
CREATE TABLE `users` (
    `user_id`       INT AUTO_INCREMENT PRIMARY KEY,
    `name`          VARCHAR(100) NOT NULL,
    `email`         VARCHAR(100) NOT NULL UNIQUE,
    `phone`         VARCHAR(20)  DEFAULT NULL,
    `password_hash` VARCHAR(255) NOT NULL,
    `created_at`    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =========================================================
-- STOCKS
-- =========================================================
CREATE TABLE `stocks` (
    `stock_id`      INT AUTO_INCREMENT PRIMARY KEY,
    `stock_name`    VARCHAR(100) NOT NULL,
    `symbol`        VARCHAR(50)  NOT NULL UNIQUE,
    `sector`        VARCHAR(100) DEFAULT NULL,
    `current_price` DECIMAL(10,2) NOT NULL DEFAULT 0.00
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =========================================================
-- MUTUAL FUNDS
-- =========================================================
CREATE TABLE `mutual_funds` (
    `mf_id`      INT AUTO_INCREMENT PRIMARY KEY,
    `mf_name`    VARCHAR(100) NOT NULL,
    `symbol`     VARCHAR(50)  NOT NULL UNIQUE,
    `fund_house` VARCHAR(100) DEFAULT NULL,
    `category`   VARCHAR(100) DEFAULT NULL,
    `nav`        DECIMAL(10,4) NOT NULL DEFAULT 0.0000
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =========================================================
-- HOLDS_STOCK  (M:M relationship: USERS ↔ STOCKS)
-- =========================================================
CREATE TABLE `holds_stock` (
    `user_id`       INT NOT NULL,
    `stock_id`      INT NOT NULL,
    `quantity`      DECIMAL(15,4) NOT NULL DEFAULT 0.0000,
    `average_price` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    PRIMARY KEY (`user_id`, `stock_id`),
    FOREIGN KEY (`user_id`)  REFERENCES `users`(`user_id`)  ON DELETE CASCADE,
    FOREIGN KEY (`stock_id`) REFERENCES `stocks`(`stock_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =========================================================
-- MF_HOLDINGS  (holdings cache for mutual funds)
-- =========================================================
CREATE TABLE `mf_holdings` (
    `user_id`     INT NOT NULL,
    `mf_id`       INT NOT NULL,
    `quantity`    DECIMAL(15,4) NOT NULL DEFAULT 0.0000,
    `average_nav` DECIMAL(10,4) NOT NULL DEFAULT 0.0000,
    PRIMARY KEY (`user_id`, `mf_id`),
    FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE CASCADE,
    FOREIGN KEY (`mf_id`)   REFERENCES `mutual_funds`(`mf_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =========================================================
-- STOCK_TRANSACTIONS  (M:M relationship: USERS ↔ STOCKS)
-- =========================================================
CREATE TABLE `stock_transactions` (
    `transaction_id`   INT AUTO_INCREMENT PRIMARY KEY,
    `user_id`          INT NOT NULL,
    `stock_id`         INT NOT NULL,
    `transaction_type` ENUM('BUY','SELL') NOT NULL,
    `quantity`         DECIMAL(15,4) NOT NULL,
    `price`            DECIMAL(10,2) NOT NULL,
    `transaction_date` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`user_id`)  REFERENCES `users`(`user_id`)  ON DELETE CASCADE,
    FOREIGN KEY (`stock_id`) REFERENCES `stocks`(`stock_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE INDEX `idx_st_user_id`  ON `stock_transactions`(`user_id`);
CREATE INDEX `idx_st_stock_id` ON `stock_transactions`(`stock_id`);

-- =========================================================
-- MF_TRANSACTIONS  (USERS 1:M → MUTUAL_FUNDS)
-- =========================================================
CREATE TABLE `mf_transactions` (
    `transaction_id`   INT AUTO_INCREMENT PRIMARY KEY,
    `user_id`          INT NOT NULL,
    `mf_id`            INT NOT NULL,
    `transaction_type` ENUM('BUY','SELL') NOT NULL,
    `quantity`         DECIMAL(15,4) NOT NULL,
    `average_nav`      DECIMAL(10,4) NOT NULL,
    `transaction_date` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`)     ON DELETE CASCADE,
    FOREIGN KEY (`mf_id`)   REFERENCES `mutual_funds`(`mf_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE INDEX `idx_mft_user_id` ON `mf_transactions`(`user_id`);
CREATE INDEX `idx_mft_mf_id`   ON `mf_transactions`(`mf_id`);

-- =========================================================
-- SEED DATA — Stocks
-- =========================================================
INSERT INTO `stocks` (`symbol`, `stock_name`, `sector`, `current_price`) VALUES
('RELIANCE', 'Reliance Industries',       'Energy',          2900.00),
('TCS',      'Tata Consultancy Services', 'Information Technology', 4000.00),
('INFY',     'Infosys Limited',           'Information Technology', 1500.00),
('HDFCBANK', 'HDFC Bank',                 'Financial Services',     1450.00),
('ITC',      'ITC Limited',               'FMCG',            420.00);

-- =========================================================
-- SEED DATA — Mutual Funds
-- =========================================================
INSERT INTO `mutual_funds` (`symbol`, `mf_name`, `fund_house`, `category`, `nav`) VALUES
('PARAGPPF', 'Parag Parikh Flexi Cap Fund', 'PPFAS Mutual Fund',  'Flexi Cap',  65.5000),
('AXISBLUE', 'Axis Bluechip Fund',          'Axis Mutual Fund',   'Large Cap',  50.2500),
('SBISMALL', 'SBI Small Cap Fund',          'SBI Mutual Fund',    'Small Cap', 145.8000);

-- =========================================================
-- SEED DATA — Demo User  (Password: demo1234)
-- =========================================================
INSERT INTO `users` (`user_id`, `name`, `email`, `password_hash`) VALUES
(1, 'Demo Investor', 'demo@foliovault.app', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi');
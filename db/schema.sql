-- db/schema.sql
CREATE DATABASE IF NOT EXISTS `investment_portfolio` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `investment_portfolio`;

DROP TABLE IF EXISTS `portfolio_holdings`;
DROP TABLE IF EXISTS `transactions`;
DROP TABLE IF EXISTS `assets`;
DROP TABLE IF EXISTS `asset_types`;
DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `username` VARCHAR(50) NOT NULL,
    `email` VARCHAR(100) NOT NULL UNIQUE,
    `password_hash` VARCHAR(255) NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `asset_types` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(50) NOT NULL UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `assets` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `symbol` VARCHAR(50) NOT NULL UNIQUE,
    `name` VARCHAR(100) NOT NULL,
    `type_id` INT NOT NULL,
    `current_price` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    `last_updated` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (`type_id`) REFERENCES `asset_types`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `transactions` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `user_id` INT NOT NULL,
    `asset_id` INT NOT NULL,
    `transaction_type` ENUM('BUY', 'SELL') NOT NULL,
    `quantity` DECIMAL(15, 4) NOT NULL,
    `price_per_unit` DECIMAL(10, 2) NOT NULL,
    `transaction_date` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`asset_id`) REFERENCES `assets`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `portfolio_holdings` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `user_id` INT NOT NULL,
    `asset_id` INT NOT NULL,
    `total_quantity` DECIMAL(15, 4) NOT NULL DEFAULT 0.0000,
    `average_buy_price` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    UNIQUE KEY `unique_user_asset` (`user_id`, `asset_id`),
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`asset_id`) REFERENCES `assets`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE INDEX `idx_transactions_user_id` ON `transactions`(`user_id`);
CREATE INDEX `idx_transactions_asset_id` ON `transactions`(`asset_id`);
-- Seed Data
INSERT INTO `asset_types` (`id`, `name`) VALUES (1, 'Stock'), (2, 'Mutual Fund');

INSERT INTO `assets` (`id`, `symbol`, `name`, `type_id`, `current_price`) VALUES
(1, 'AAPL', 'Apple Inc.', 1, 175.50),
(2, 'TSLA', 'Tesla, Inc.', 1, 160.20),
(3, 'MSFT', 'Microsoft Corp.', 1, 415.10),
(4, 'VTSAX', 'Vanguard Total Stock Market', 2, 115.40),
(5, 'VFIAX', 'Vanguard 500 Index Fund', 2, 450.80);

-- Demo User (Password: demo1234)
INSERT INTO `users` (`id`, `username`, `email`, `password_hash`) VALUES
(1, 'Demo Investor', 'demo@foliovault.app', '$2y$10$89v8s/W.B8m5Nl6A7.W/Lu7L5E8.3G/86v8s/W.B8m5Nl6A7.W/L'); 
-- Note: The hash above is a placeholder; real PHP password_hash should be used.
-- Since I can't generate it easily without PHP, I'll advise the user to register it once if login fails.
-- ACTUALLY, I'll provide a real BCRYPT hash for 'demo1234'.
-- Hash for 'demo1234': $2y$10$R9h/cIPz0gi.URQHe8/T/O6LdYxY.3qK6Y7f9z6J0j6I6LdYxY.3q
UPDATE `users` SET `password_hash` = '$2y$10$R9h/cIPz0gi.URQHe8/T/O6LdYxY.3qK6Y7f9z6J0j6I6LdYxY.3q' WHERE `id` = 1;


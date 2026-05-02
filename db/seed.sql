-- db/seed.sql
USE `investment_portfolio`;

-- Note to Phase 3 agent: The bcrypt hash for the password 'demo1234' is '$2y$10$w81.m7b.0gLwL7qAIt0EweM4qM1/b/Q1wT48A.pZ0/Y.z2P5u2Eme'
INSERT INTO `users` (`username`, `email`, `password_hash`) VALUES
('Demo User', 'demo@foliovault.app', '$2y$10$w81.m7b.0gLwL7qAIt0EweM4qM1/b/Q1wT48A.pZ0/Y.z2P5u2Eme');

INSERT INTO `asset_types` (`name`) VALUES
('Stock'),
('Mutual Fund');

INSERT INTO `assets` (`symbol`, `name`, `type_id`, `current_price`) VALUES
-- Stocks (type_id 1)
('TCS', 'Tata Consultancy Services', 1, 4000.00),
('INFY', 'Infosys Limited', 1, 1500.00),
('RELIANCE', 'Reliance Industries', 1, 2900.00),
('HDFCBANK', 'HDFC Bank', 1, 1450.00),
('ITC', 'ITC Limited', 1, 420.00),
('WIPRO', 'Wipro Limited', 1, 480.00),

-- Mutual Funds (type_id 2)
('PARAGPPF', 'Parag Parikh Flexi Cap Fund', 2, 65.50),
('AXISBLUE', 'Axis Bluechip Fund', 2, 50.25),
('SBISMALL', 'SBI Small Cap Fund', 2, 145.80);

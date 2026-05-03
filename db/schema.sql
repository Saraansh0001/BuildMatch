-- =========================================================
-- investment_portfolio.sql 
-- =========================================================

CREATE DATABASE IF NOT EXISTS investment_portfolio;
USE investment_portfolio;

DROP TABLE IF EXISTS watchlist;
DROP TABLE IF EXISTS transaction_audit;
DROP TABLE IF EXISTS mf_holdings;
DROP TABLE IF EXISTS holds_stock;
DROP TABLE IF EXISTS mf_transactions;
DROP TABLE IF EXISTS stock_transactions;
DROP TABLE IF EXISTS mutual_funds;
DROP TABLE IF EXISTS stocks;
DROP TABLE IF EXISTS users;


-- =========================================================
-- CREATE TABLES
-- =========================================================

-- Users
CREATE TABLE users (
    user_id       INT AUTO_INCREMENT PRIMARY KEY,
    name          VARCHAR(100) NOT NULL,
    email         VARCHAR(100) NOT NULL UNIQUE,
    phone         VARCHAR(20)  DEFAULT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Stocks
CREATE TABLE stocks (
    stock_id      INT AUTO_INCREMENT PRIMARY KEY,
    stock_name    VARCHAR(100) NOT NULL,
    symbol        VARCHAR(50)  NOT NULL UNIQUE,
    sector        VARCHAR(100) DEFAULT NULL,
    market_cap    ENUM('LARGE','MID','SMALL') DEFAULT 'LARGE',
    current_price DECIMAL(10,2) NOT NULL DEFAULT 0.00
);

-- Mutual
CREATE TABLE mutual_funds (
    mf_id      INT AUTO_INCREMENT PRIMARY KEY,
    mf_name    VARCHAR(100) NOT NULL,
    symbol     VARCHAR(50)  NOT NULL UNIQUE,
    fund_house VARCHAR(100) DEFAULT NULL,
    category   VARCHAR(100) DEFAULT NULL,
    nav        DECIMAL(10,4) NOT NULL DEFAULT 0.0000
);

-- Stocks holdings
CREATE TABLE holds_stock (
    user_id       INT NOT NULL,
    stock_id      INT NOT NULL,
    quantity      DECIMAL(15,4) NOT NULL DEFAULT 0.0000,
    average_price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    PRIMARY KEY (user_id, stock_id), -- 1 r per person 
    FOREIGN KEY (user_id)  REFERENCES users(user_id)   ON DELETE CASCADE,
    FOREIGN KEY (stock_id) REFERENCES stocks(stock_id) ON DELETE CASCADE
);

-- mutualF holdings
CREATE TABLE mf_holdings (
    user_id     INT NOT NULL,
    mf_id       INT NOT NULL,
    quantity    DECIMAL(15,4) NOT NULL DEFAULT 0.0000,
    average_nav DECIMAL(10,4) NOT NULL DEFAULT 0.0000,
    PRIMARY KEY (user_id, mf_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id)        ON DELETE CASCADE,
    FOREIGN KEY (mf_id)   REFERENCES mutual_funds(mf_id)   ON DELETE CASCADE
);

-- trxn history
CREATE TABLE stock_transactions (
    transaction_id   INT AUTO_INCREMENT PRIMARY KEY,
    user_id          INT NOT NULL,
    stock_id         INT NOT NULL,
    transaction_type ENUM('BUY','SELL') NOT NULL,
    quantity         DECIMAL(15,4) NOT NULL,
    price            DECIMAL(10,2) NOT NULL,
    transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id)  REFERENCES users(user_id)   ON DELETE CASCADE,
    FOREIGN KEY (stock_id) REFERENCES stocks(stock_id) ON DELETE CASCADE
);

-- spped up quer proces for user ( find krne ke liye h )
CREATE INDEX idx_st_user_id  ON stock_transactions(user_id);
CREATE INDEX idx_st_stock_id ON stock_transactions(stock_id);
CREATE INDEX idx_st_date     ON stock_transactions(transaction_date);

-- trxn history mutual funds
CREATE TABLE mf_transactions (
    transaction_id   INT AUTO_INCREMENT PRIMARY KEY,
    user_id          INT NOT NULL,
    mf_id            INT NOT NULL,
    transaction_type ENUM('BUY','SELL') NOT NULL,
    quantity         DECIMAL(15,4) NOT NULL,
    average_nav      DECIMAL(10,4) NOT NULL,
    transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id)      ON DELETE CASCADE,
    FOREIGN KEY (mf_id)   REFERENCES mutual_funds(mf_id) ON DELETE CASCADE
);

CREATE INDEX idx_mft_user_id ON mf_transactions(user_id);
CREATE INDEX idx_mft_mf_id   ON mf_transactions(mf_id);

-- Stocks a user wants to watch (but hasn't bought yet)
CREATE TABLE watchlist (
    user_id  INT NOT NULL,
    stock_id INT NOT NULL,
    note     VARCHAR(255) DEFAULT NULL,
    added_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, stock_id),
    FOREIGN KEY (user_id)  REFERENCES users(user_id)   ON DELETE CASCADE,
    FOREIGN KEY (stock_id) REFERENCES stocks(stock_id) ON DELETE CASCADE
);

-- Automatic log of every transaction (filled by triggers)
CREATE TABLE transaction_audit (
    audit_id         INT AUTO_INCREMENT PRIMARY KEY,
    user_id          INT NOT NULL,
    asset_type       ENUM('STOCK','MF') NOT NULL,
    transaction_type ENUM('BUY','SELL') NOT NULL,
    amount           DECIMAL(15,2) NOT NULL,
    logged_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- =========================================================
-- SEED DATA
-- =========================================================

-- Stocks
INSERT INTO stocks (symbol, stock_name, sector, current_price) VALUES
('RELIANCE', 'Reliance Industries',       'Energy',                 2900.00),
('TCS',      'Tata Consultancy Services', 'Information Technology', 4000.00),
('INFY',     'Infosys Limited',           'Information Technology', 1500.00),
('HDFCBANK', 'HDFC Bank',                 'Financial Services',     1450.00),
('ITC',      'ITC Limited',               'FMCG',                    420.00);

-- Mutual Funds
INSERT INTO mutual_funds (symbol, mf_name, fund_house, category, nav) VALUES
('PARAGPPF', 'Parag Parikh Flexi Cap Fund', 'PPFAS Mutual Fund', 'Flexi Cap',   65.5000),
('AXISBLUE', 'Axis Bluechip Fund',          'Axis Mutual Fund',  'Large Cap',   50.2500),
('SBISMALL', 'SBI Small Cap Fund',          'SBI Mutual Fund',   'Small Cap',  145.8000);

-- Demo user (Password: demo1234)
INSERT INTO users (user_id, name, email, password_hash) VALUES
(1, 'Demo Investor', 'demo@foliovault.app', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi');

-- Stock transaction history for demo user
INSERT INTO stock_transactions (user_id, stock_id, transaction_type, quantity, price, transaction_date) VALUES
(1, 1, 'BUY',  10, 2750.00, '2024-01-10 10:00:00'),
(1, 2, 'BUY',   5, 3800.00, '2024-01-15 11:30:00'),
(1, 3, 'BUY',  20, 1420.00, '2024-02-01 09:15:00'),
(1, 4, 'BUY',  15, 1400.00, '2024-02-20 14:00:00'),
(1, 5, 'BUY', 100,  400.00, '2024-03-05 10:45:00'),
(1, 3, 'SELL',  5, 1500.00, '2024-04-10 13:00:00');

-- Current stock holdings for demo user
INSERT INTO holds_stock (user_id, stock_id, quantity, average_price) VALUES
(1, 1, 10,  2750.00),
(1, 2,  5,  3800.00),
(1, 3, 15,  1420.00),
(1, 4, 15,  1400.00),
(1, 5, 100,  400.00);

-- MF transaction history for demo user
INSERT INTO mf_transactions (user_id, mf_id, transaction_type, quantity, average_nav, transaction_date) VALUES
(1, 1, 'BUY', 200, 60.2500, '2024-01-20 10:00:00'),
(1, 2, 'BUY', 150, 47.5000, '2024-02-10 11:00:00'),
(1, 3, 'BUY',  50, 130.000, '2024-03-15 09:30:00');

-- Current MF holdings for demo user
INSERT INTO mf_holdings (user_id, mf_id, quantity, average_nav) VALUES
(1, 1, 200, 60.2500),
(1, 2, 150, 47.5000),
(1, 3,  50, 130.000);


-- =========================================================
-- DML — data changes
-- =========================================================

-- IT sector prices up 2%
UPDATE stocks
SET current_price = current_price * 1.02
WHERE sector = 'Information Technology';

-- Classify market cap based on price
UPDATE stocks
SET market_cap = 
CASE -- case is if else
    WHEN current_price >= 2000 THEN 'LARGE'
    WHEN current_price >= 500  THEN 'MID'
    ELSE                            'SMALL'
END;

-- Remove any zero-quantity holdings (cleanup after sells)
DELETE FROM holds_stock WHERE quantity = 0;


-- =========================================================
-- TCL    
-- =========================================================

-- updating holdings for demo
START TRANSACTION;

    INSERT INTO stock_transactions (user_id, stock_id, transaction_type, quantity, price)
    VALUES (1, 5, 'BUY', 10, 425.00);

    SAVEPOINT after_txn_insert;

    INSERT INTO holds_stock (user_id, stock_id, quantity, average_price)
    VALUES (1, 5, 10, 425.00)
    ON DUPLICATE KEY UPDATE
        average_price = (average_price * quantity + 425.00 * 10) / (quantity + 10),
        quantity      = quantity + 10;

COMMIT;


-- =========================================================
-- DQL — Useful SELECT queries
-- =========================================================

SELECT
    s.sector,
    COUNT(DISTINCT s.stock_id)         AS stocks_held,
    SUM(hs.quantity * s.current_price) AS sector_value
FROM   holds_stock hs
JOIN   stocks      s  ON s.stock_id = hs.stock_id
WHERE  hs.user_id = 1
GROUP  BY s.sector
HAVING sector_value > 50000
ORDER  BY sector_value DESC;


-- Stocks the user has traded more than once
SELECT
    s.symbol,
    s.stock_name,
    COUNT(*)         AS txn_count,
    SUM(st.quantity) AS total_qty_traded
FROM   stock_transactions st
JOIN   stocks             s  ON s.stock_id = st.stock_id
WHERE  st.user_id = 1
GROUP  BY s.stock_id, s.symbol, s.stock_name
HAVING txn_count >= 2
ORDER  BY txn_count DESC;


-- Full profit/loss for each stock holding
SELECT
    u.name                                                AS investor,
    s.symbol,
    s.stock_name,
    s.sector,
    hs.quantity,
    hs.average_price,
    s.current_price,
    (hs.quantity * hs.average_price)                      AS invested,
    (hs.quantity * s.current_price)                       AS current_value,
    (hs.quantity * (s.current_price - hs.average_price))  AS unrealized_pl
FROM   users       u
JOIN   holds_stock hs ON hs.user_id  = u.user_id
JOIN   stocks      s  ON s.stock_id  = hs.stock_id
WHERE  u.user_id = 1
ORDER  BY unrealized_pl DESC;


-- Months where user invested more than ₹10,000 in stocks
SELECT
    DATE_FORMAT(transaction_date, '%Y-%m') AS month,
    SUM(quantity * price)                  AS total_invested,
    COUNT(*)                               AS num_buys
FROM   stock_transactions
WHERE  user_id = 1 AND transaction_type = 'BUY'
GROUP  BY DATE_FORMAT(transaction_date, '%Y-%m')
HAVING total_invested > 10000
ORDER  BY month;


-- =========================================================
-- SUBQUERIES
-- =========================================================

SELECT s.symbol, s.stock_name, s.current_price
FROM   stocks s
JOIN   holds_stock hs ON hs.stock_id = s.stock_id
WHERE  hs.user_id = 1
  AND  s.current_price > (
        SELECT AVG(s2.current_price)
        FROM   stocks      s2
        JOIN   holds_stock hs2 ON hs2.stock_id = s2.stock_id
        WHERE  hs2.user_id = 1
  );
-- stock where price is above avg ( holding stocks )

-- stock vs mf %
SELECT
    t.asset_type,
    ROUND(t.invested, 2)                                       AS invested,
    ROUND(100 * t.invested / SUM(t.invested) OVER (), 2)       AS pct_of_portfolio
FROM (
    SELECT 'Stock' AS asset_type,
           SUM(CASE WHEN transaction_type = 'BUY'  THEN  quantity * price
                    WHEN transaction_type = 'SELL' THEN -quantity * price END) AS invested
    FROM   stock_transactions WHERE user_id = 1
    UNION ALL
    SELECT 'Mutual Fund',
           SUM(CASE WHEN transaction_type = 'BUY'  THEN  quantity * average_nav
                    WHEN transaction_type = 'SELL' THEN -quantity * average_nav END)
    FROM   mf_transactions WHERE user_id = 1
) AS t;

-- last buy price stock 
SELECT
    s.symbol,
    s.stock_name,
    s.current_price,
    (SELECT st.price
     FROM   stock_transactions st
     WHERE  st.stock_id = s.stock_id
       AND  st.user_id  = 1
       AND  st.transaction_type = 'BUY'
     ORDER  BY st.transaction_date DESC
     LIMIT  1) AS last_buy_price
FROM   stocks s
WHERE  s.stock_id IN (
    SELECT stock_id FROM holds_stock WHERE user_id = 1
);


SELECT mf.symbol, mf.mf_name, mf.fund_house, mf.nav
FROM   mutual_funds mf
WHERE  EXISTS (
    SELECT 1 FROM mf_transactions mft
    WHERE  mft.mf_id = mf.mf_id AND mft.user_id = 1
);


SELECT s.symbol, s.stock_name, s.sector, s.current_price
FROM   stocks s
WHERE  s.stock_id NOT IN (
    SELECT hs.stock_id FROM holds_stock hs WHERE hs.user_id = 1
);


-- =========================================================
-- VIEWS
-- =========================================================

DROP VIEW IF EXISTS v_portfolio_summary;
CREATE VIEW v_portfolio_summary AS
SELECT
    u.user_id,
    u.name,
    -- if user dk that stock then 0 not null !!
    COALESCE(sv.stock_value, 0)                             AS stock_value,
    COALESCE(mv.mf_value,    0)                             AS mf_value,
    COALESCE(sv.stock_value, 0) + COALESCE(mv.mf_value, 0) AS total_value
    -- coalesce ka mtlbh if value null toh usko 0 kr denAa
FROM users u
LEFT JOIN (
    SELECT hs.user_id, SUM(hs.quantity * s.current_price) AS stock_value
    FROM   holds_stock hs
    JOIN   stocks      s  ON s.stock_id = hs.stock_id
    WHERE  hs.quantity > 0
    GROUP  BY hs.user_id
) sv ON sv.user_id = u.user_id
LEFT JOIN (
    SELECT mfh.user_id, SUM(mfh.quantity * m.nav) AS mf_value
    FROM   mf_holdings  mfh
    JOIN   mutual_funds m ON m.mf_id = mfh.mf_id
    WHERE  mfh.quantity > 0
    GROUP  BY mfh.user_id
) mv ON mv.user_id = u.user_id;
-- stock and mf total value

DROP VIEW IF EXISTS v_all_transactions;
CREATE VIEW v_all_transactions AS
SELECT
    st.transaction_id        AS id,
    st.user_id,
    'Stock'                  AS asset_type,
    s.symbol,
    s.stock_name             AS asset_name,
    st.transaction_type,
    st.quantity,
    st.price                 AS price_per_unit,
    (st.quantity * st.price) AS total_amount,
    st.transaction_date
FROM   stock_transactions st
JOIN   stocks s ON s.stock_id = st.stock_id
UNION ALL
SELECT
    mft.transaction_id,
    mft.user_id,
    'Mutual Fund',
    mf.symbol,
    mf.mf_name,
    mft.transaction_type,
    mft.quantity,
    mft.average_nav,
    (mft.quantity * mft.average_nav),
    mft.transaction_date
FROM   mf_transactions mft
JOIN   mutual_funds mf ON mf.mf_id = mft.mf_id;

-- =========================================================
-- FUNCTIONS
-- =========================================================

DROP FUNCTION IF EXISTS fn_total_invested;
DELIMITER $$

CREATE FUNCTION fn_total_invested(p_user_id INT)
RETURNS DECIMAL(15,2)
DETERMINISTIC
READS SQL DATA
BEGIN
    DECLARE v_stock DECIMAL(15,2) DEFAULT 0;
    DECLARE v_mf    DECIMAL(15,2) DEFAULT 0;

    SELECT COALESCE(SUM(
              CASE WHEN transaction_type = 'BUY'  THEN  quantity * price
                   WHEN transaction_type = 'SELL' THEN -quantity * price END), 0)
      INTO v_stock
      FROM stock_transactions WHERE user_id = p_user_id;

    SELECT COALESCE(SUM(
              CASE WHEN transaction_type = 'BUY'  THEN  quantity * average_nav
                   WHEN transaction_type = 'SELL' THEN -quantity * average_nav END), 0)
      INTO v_mf
      FROM mf_transactions WHERE user_id = p_user_id;

    RETURN v_stock + v_mf;
END$$

DELIMITER ;


DROP FUNCTION IF EXISTS fn_stock_pl_pct;
DELIMITER $$

CREATE FUNCTION fn_stock_pl_pct(p_user_id INT, p_stock_id INT)
RETURNS DECIMAL(8,2)
DETERMINISTIC
READS SQL DATA
BEGIN
    DECLARE v_avg DECIMAL(10,2);
    DECLARE v_cur DECIMAL(10,2);

    SELECT average_price INTO v_avg
      FROM holds_stock
     WHERE user_id = p_user_id AND stock_id = p_stock_id;

    SELECT current_price INTO v_cur
      FROM stocks WHERE stock_id = p_stock_id;

    -- Avoid divide-by-zero
    IF v_avg IS NULL OR v_avg = 0 THEN RETURN 0; END IF;

    RETURN ROUND(((v_cur - v_avg) / v_avg) * 100, 2);
END$$

DELIMITER ;

-- =========================================================
-- PROCEDURES
-- =========================================================

DROP PROCEDURE IF EXISTS sp_buy_stock;
DELIMITER $$

CREATE PROCEDURE sp_buy_stock(
    IN p_user_id  INT,
    IN p_stock_id INT,
    IN p_qty      DECIMAL(15,4),
    IN p_price    DECIMAL(10,2)
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;

        INSERT INTO stock_transactions (user_id, stock_id, transaction_type, quantity, price)
        VALUES (p_user_id, p_stock_id, 'BUY', p_qty, p_price);

        INSERT INTO holds_stock (user_id, stock_id, quantity, average_price)
        VALUES (p_user_id, p_stock_id, p_qty, p_price)
        ON DUPLICATE KEY UPDATE
            average_price = (average_price * quantity + p_price * p_qty) / (quantity + p_qty),
            quantity      = quantity + p_qty;

    COMMIT;
END$$

DELIMITER ;


DROP PROCEDURE IF EXISTS sp_portfolio_snapshot;
DELIMITER $$

CREATE PROCEDURE sp_portfolio_snapshot(IN p_user_id INT)
BEGIN
    SELECT
        u.name                                                     AS investor,
        fn_total_invested(p_user_id)                               AS total_invested,
        COALESCE(sv.stock_value, 0) + COALESCE(mv.mf_value, 0)    AS current_value,
        (COALESCE(sv.stock_value, 0) + COALESCE(mv.mf_value, 0))
            - fn_total_invested(p_user_id)                         AS unrealized_pl
    FROM users u
    LEFT JOIN (
        SELECT hs.user_id, SUM(hs.quantity * s.current_price) AS stock_value
        FROM   holds_stock hs JOIN stocks s ON s.stock_id = hs.stock_id
        GROUP  BY hs.user_id
    ) sv ON sv.user_id = u.user_id
    LEFT JOIN (
        SELECT mfh.user_id, SUM(mfh.quantity * m.nav) AS mf_value
        FROM   mf_holdings mfh JOIN mutual_funds m ON m.mf_id = mfh.mf_id
        GROUP  BY mfh.user_id
    ) mv ON mv.user_id = u.user_id
    WHERE u.user_id = p_user_id;
END$$

DELIMITER ;

-- =========================================================
-- TRIGGERS
-- =========================================================

DROP TRIGGER IF EXISTS trg_audit_stock_txn;
DELIMITER $$

CREATE TRIGGER trg_audit_stock_txn
AFTER INSERT ON stock_transactions
FOR EACH ROW
BEGIN
    INSERT INTO transaction_audit (user_id, asset_type, transaction_type, amount)
    VALUES (NEW.user_id, 'STOCK', NEW.transaction_type, NEW.quantity * NEW.price);
END$$

DELIMITER ;

DROP TRIGGER IF EXISTS trg_audit_mf_txn;
DELIMITER $$

CREATE TRIGGER trg_audit_mf_txn
AFTER INSERT ON mf_transactions
FOR EACH ROW
BEGIN
    INSERT INTO transaction_audit (user_id, asset_type, transaction_type, amount)
    VALUES (NEW.user_id, 'MF', NEW.transaction_type, NEW.quantity * NEW.average_nav);
END$$

DELIMITER ;
-- A trigger is code that automatically executes when a 
-- specific database event occurs (INSERT, UPDATE, DELETE)
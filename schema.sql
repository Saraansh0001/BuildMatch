create database portfolio;
use portfolio;

create table users (
    user_id int primary key auto_increment,
    name varchar(50) not null,
    email varchar(100) not null unique,
    phone varchar(10) ,
    created_at timestamp default current_timestamp
	
    constraint chk_phone_length check (LEN(phone) = 10),
    constraint chk_phone_numeric check (phone not like '%[^0-9]%')
);

create table stocks (
    stock_id int primary key auto_increment,
    stock_name varchar(100) not null,
    symbol varchar(20) not null unique,
    sector varchar(50),
    current_price decimal(10,2) not null check (current_price >= 0)
);

create table mutual_funds (
    mf_id int primary key auto_increment,
    mf_name varchar(150) not null,
    fund_house varchar(100) not null,
    category varchar(50),
    nav decimal(10,2) not null check (nav >= 0),
    unique (mf_name, fund_house)
);


create table stock_holdings (
    holding_id int primary key auto_increment,
    user_id int not null,
    stock_id int not null,
    quantity int not null check (quantity > 0),
    average_price decimal(12,2) not null check (average_price >= 0),

    unique (user_id, stock_id),
    foreign key (user_id) references users(user_id),
    foreign key (stock_id) references stocks(stock_id)
);

create table mf_holdings (
    holding_id int primary key auto_increment,
    user_id int not null,
    mf_id int not null,
    units decimal(12,4) not null check (units > 0),
    average_nav decimal(10,2) not null check (average_nav >= 0),

    unique (user_id, mf_id),
    foreign key (user_id) references users(user_id),
    foreign key (mf_id) references mutual_funds(mf_id)
);


create table stock_transactions (
    transaction_id int primary key auto_increment,
    user_id int not null,
    stock_id int not null,
    transaction_type enum('buy','sell') not null,
    quantity int not null check (quantity > 0),
    price decimal(12,2) not null check (price >= 0),
    transaction_date timestamp default current_timestamp,

    foreign key (user_id) references users(user_id),
    foreign key (stock_id) references stocks(stock_id)
);

create table mf_transactions (
    transaction_id int primary key auto_increment,
    user_id int not null,
    mf_id int not null,
    transaction_type enum('buy','sell') not null,
    units decimal(12,4) not null check (units > 0),
    nav_price decimal(12,2) not null check (nav_price >= 0),
    transaction_date timestamp default current_timestamp,

    foreign key (user_id) references users(user_id),
    foreign key (mf_id) references mutual_funds(mf_id)
);



create index idx_stock_transaction_user on stock_transactions(user_id);
create index idx_stock_transaction_stock on stock_transactions(stock_id);

create index idx_mf_transaction_user on mf_transactions(user_id);
create index idx_mf_transaction_fund on mf_transactions(mf_id);

create index idx_stock_hold_user on stock_holdings(user_id);
create index idx_stock_hold_stock on stock_holdings(stock_id);

create index idx_mf_hold_user on mf_holdings(user_id);
create index idx_mf_hold_fund on mf_holdings(mf_id);

-- dml queries

-- insert into users values
-- (1,'aarav','aarav@mail.com','101',now()),
-- (2,'meera','meera@mail.com','102',now());

-- insert into stocks values
-- (1,'tcs','tcs','it',3800),
-- (2,'infosys','infy','it',1600);

-- insert into mutual_funds values
-- (1,'sbi bluechip','sbi','large cap',120);

-- insert into stock_holdings values
-- (1,1,1,5,3500),
-- (2,2,2,4,1500);

-- insert into mf_holdings values
-- (1,1,1,10,115);

-- insert into stock_transactions values
-- (1,1,1,'buy',5,3500,now()),
-- (2,2,2,'buy',4,1500,now());


-- dql queries

select * from users;

select 
    u.name as user_name,
    s.stock_name as stock,
    sh.quantity as shares_owned,
    sh.quantity * sh.average_price as total_investment
from users u
join stock_holdings sh 
    on u.user_id = sh.user_id
join stocks s 
    on sh.stock_id = s.stock_id;
    
select user_id, count(*) as total_trades
from stock_transactions
group by user_id
having count(*) >= 1;

select avg(price) from stock_transactions;

select name
from users
where user_id in (
    select user_id
    from stock_transactions
    group by user_id
    having sum(price*quantity) >
    (select avg(price*quantity) from stock_transactions)
);



create view portfolio_view as
select u.user_id, u.name, s.stock_name, sh.quantity
from users u
join stock_holdings sh on u.user_id = sh.user_id
join stocks s on sh.stock_id = s.stock_id;


delimiter //
create procedure getportfolio(in uid int)
begin
    select * from portfolio_view
    where user_id = uid;
end //
delimiter ;

call getportfolio(1);


delimiter //
create function totalvalue(uid int)
returns decimal(12,2)
deterministic
begin
    declare total decimal(12,2);
    select sum(quantity*average_price)
    into total
    from stock_holdings
    where user_id = uid;
    return ifnull(total,0);
end //
delimiter ;

select totalvalue(1);

start transaction;
update stock_holdings
set quantity = quantity + 1
where user_id = 1 and stock_id = 1;
commit;

start transaction;
insert into stock_transactions(user_id,stock_id,transaction_type,quantity,price)
values (1,1,'buy',1,3800);
rollback;
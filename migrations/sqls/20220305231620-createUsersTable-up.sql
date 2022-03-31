CREATE TABLE users (
id SERIAL PRIMARY KEY,
user_name VARCHAR(20),
first_name VARCHAR(50),
last_name VARCHAR(50),
password_digest VARCHAR,
role VARCHAR(20)
);
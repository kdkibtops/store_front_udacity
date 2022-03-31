CREATE TABLE products (
id SERIAL PRIMARY KEY,
name VARCHAR(50),
price numeric,
category VARCHAR(50),
total_ordered integer,
sales numeric
);
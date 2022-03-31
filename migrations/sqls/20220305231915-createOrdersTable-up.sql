CREATE TABLE orders (
id SERIAL PRIMARY KEY,
id_user integer,
total_items integer,
total_price float,
status VARCHAR(50)
);
CREATE TABLE carts(
id SERIAL PRIMARY KEY,
id_order integer,
id_product integer,
quantity integer, 
price numeric
);
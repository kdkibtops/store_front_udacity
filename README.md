# Storefront Backend Project

## Getting Started
1- Create 2 databases named 'shopping' & 'shopping_test' (dB can be changed but you have to change it in .env file)
2- Create user for app to access data 'shopping_user' (user can be changed but you have to change it in .env file)
3- Grant permissions to the user to have access and edit dB
4- Install the required dependecies (yarn add)
5- Migrate up to create the database tables (db-migrate up)
6- Everything is now ready, start using the API, type 'yarn build' to build the project then 'yarn start' in command line.
7- TO RUN jasmine TESTING, enter: 'npm run test' in command line.


## Functionalities provided:
This API provide many functionalities for the storefront, it allows creating and updating different users, products & orders with ability to 
delete any of them, also it automatically updates the prices and total items ordered whether in orders or products.
Furthermore, the API validates all request data entered before processing the request, to avoid any errors or server halting; just in case 
data validation was not sufficient in the front end.
Different roles for each user allow to give upto 3 permisssion levels, for exampple 'admin','user','guest', whenever the admin is requesting all
requests are granted except when adding or deleting orders.
users and guest can only edit or update their corresponding data, but no user can manipulate data of other users.


## Technologies used
- Postgres for the database
- Node/Express for the application logic
- dotenv from npm for managing environment variables
- db-migrate from npm for migrations
- jsonwebtoken from npm for working with JWTs
- jasmine from npm for testing

## Request body: ** Authentication and other POST,PUT,DELETE routes fettch the data from request body as follow:
# users routes:
- Create user route:
    {
        "new_username": "new_user_name",
        "firstname":"first_name" ,
        "lastname": "last_name",
        "password":"password" ,
        "role":"role" 
        }
-  Update user route:
    {
        "username": "registered_user_name_with_sufficient_privilige_admin",
        "password": "password_of_the_registered_user_name",
        "userid": "numeric_user_id_to_update",
        "updatefield": "column_name_in_database",
        "updatevalue":"new_value" 
        }

- Delete user rpute:
    {
        "username": "registered_user_name_with_sufficient_privilige_admin",
        "password": "password_of_the_registered_user_name",
        "userid": "numeric_user_id_to_delete"
        }

# products routes:
- Create product route:
{
    "username": "registered_user_name_with_sufficient_privilige_admin",
    "password":"password_of_the_registered_user_name" ,
    "name": "new_product_name",
    "price":"float_product_price" ,
    "category":"category_of_the_product" 
    }

- Update product route:
   {
        "username": "registered_user_name_with_sufficient_privilige_admin",
        "password": "password_of_the_registered_user_name",
        "productid": "numeric_product_id_to_update",
        "updatefield": "column_name_in_database",
        "updatevalue":"new_value" 
        }

- Delete product route:
{
    "username": "registered_user_name_with_sufficient_privilige_admin",
    "password":"password_of_the_registered_user_name" ,
    "productid": "numeric_product_id_to_delete" 
    }
# orders routes:
- Index all orders rout:
{
    "username": "registered_user_name_with_sufficient_privilige_admin",
    "password":"password_of_the_registered_user_name" 
}

- Show an order route:
{
    "username": "registered_user_name_with_sufficient_privilige_admin",
    "password":"password_of_the_registered_user_name" 
}

- Show order by user route:
{
    "username": "registered_user_name_with_sufficient_privilige_admin",
    "password":"password_of_the_registered_user_name" 
}

- Show order by status route:
{
    "username": "registered_user_name_with_sufficient_privilige_admin",
    "password":"password_of_the_registered_user_name" 
}

- Create order route:
{
    "username": "registered_user_name_with_sufficient_privilige_admin",
    "password":"password_of_the_registered_user_name" ,
    "id_user":"user_id_making_the_order",
    "id_product":"product_id",
    "quantity":"quantity_of_items_from_the_products",
    "status":"status_of_the_order"
    }

- Update order route:
   {
    "username": "registered_user_name_with_sufficient_privilige_admin",
    "password":"password_of_the_registered_user_name" ,
    "orderid":"numeric_order_id_to_update",
    "updatefield":"column_name_in_database",
    "updatevalue":"new_value"
    }

- Add cart route:
{
    "username": "registered_user_name_with_sufficient_privilige_admin",
    "password":"password_of_the_registered_user_name" ,
    "id_product":"numeric_product_id",
    "quantity":"quantity_of_items_from_the_products",
    "id_order":"numeric_order_id_to_update"
    }

- Delete cart route:
{
    "username": "registered_user_name_with_sufficient_privilige_admin",
    "password":"password_of_the_registered_user_name" ,
    "id_cart":"numeric_cart_id_to_delete"
    }

- Delete order route:
{
    "username": "registered_user_name_with_sufficient_privilige_admin",
    "password":"password_of_the_registered_user_name" ,
    "orderid":"numeric_order_id_to_delete"
    }

# Dasboard routes:
- Completed order by user route:
{
    "username": "registered_user_name_with_sufficient_privilige_admin",
    "password":"password_of_the_registered_user_name" 
}

## API Endpoints
# Authorization of request:
Before accessing any data, user must be authorized, authorization passes by 3 steps:
  1- The user must be registered in database and enter correct credentials.
  2- If correct user credentials, JWT is passed to headers of response (res.headers.authorization).
  3- JWT provided in request headers is verified for validity and user role is acquired from this JWT data.
  4- If user is an admin, no further validation is required and request is processed.
  5- If user has any other role ('user','guest'), requesting user must be accessing data of his own account,
  
  for example if userX is 'user', it can only update or delete data of userX only.
  Exception for this verification in case of accessing index of products or Orders.
  Permissions can be edited in the corresponding handler function by entering allowed roles.
    # Sample JWT for testing (should be provided in req.headers.authorization for verification of the request):
    "BEARER eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjcsInVzZXJfbmFtZSI6Imtka2lidG9wcyIsImZpcnN0X25hbWUiOiJNdXN0YWZhIiwibGFzdF9uYW1lIjoiSGVpZGFyIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNjQ3MzQ2OTcxfQ.4y-2XkGEFnF2ct38wPKSajjfZomiI0S7FC_sZl_M5IA"

# Data validation
At handler level, we check validity of entered data to avoid any server error
Data checked:
  1- id: must be a valid number with no text.
  2- column name: if updating an entry, provided column name must be existing in its corresponding table.
  3- Provided id should be present it database in its corresponding table.

- host: localhost:          [127.0.0.1]
- Server port               : 3000
- Databse postgreSQL port   : 5432

#### Products
    - Index: '/products/index' [GET]
    - Show: '/products//show/:productid' [GET]
    - Create [token required]: '/products/create' [POST]
    - Delete [token required]: '/products/delete' [DELETE]
    - Update [token required]: '/products/update' [PUT]
    - Top 5 most popular products: '/dashboard/top_products' [GET]
    - Least 5 products: '/dashboard/bottom_products' [GET]
    - Products by category (args: product category): '/dashboard/products_by_category/:category' [GET]
#### Users
    - Index [token required]: '/users/index' [GET]
    - Show [token required]: '/users/show/:userid' [GET]
    - Create N: '/users/create' [POST]
    - Update [token required]: '/users/update' [PUT]
    - Delete [token required]: '/users/delete' [DELETE]
#### Orders
    - Index all orders[token required]: '/orders/index' [GET]
    - Show order[token required]: '/orders/show/:orderid' [GET]
    - Add order to user [token requires]: '/orders/create' [POST]
    - Order by user[token required]: '/orders/showorder-byuser/:userid' [GET]
    - Order by status[token required]: '/orders/showorder-bystatus/:status' [GET]
    - Delete order[token required]: '/orders/deleteorder' [DELETE]
    - Update order[token required]: '/orders/update' [PUT]
    - Add cart items to order[token required]: '/orders/addtocart' [POST]
    - Delete cart items from order[token required]: '/orders/deletefromcart' [DELETE]
    - Completed orders by users [token required]: 'dashboard/completedordersbyuser/:id_user' [GET]

## Data Shapes
#### Product
    - id            SERIAL PRIMARY KEY
    - name          VARCHAR(50)
    - price         numeric
    - category      VARCHAR(50)
    - total_orderd  integer (updated automatically after each order update)
    - sales         numeric (updated automatically after each order update)

#### User
    - id                SERIAL PRIMARY KEY
    - user_name         VARCHAR(20)
    - firstName         VARCHAR(50)
    - lastName          VARCHAR(50)
    - password_digest   VARCHAR  (encrypted password)
    - role              VARCHAR(20)

#### Orders
    orders table:
    - id                        SERIAL PRIMARY KEY
    - id_user                   integer [foreign key to users table]
    - total_items               integer
    - total_price               integer
    - status of order           VARCHAR(50) (active or complete)
    
    carts table:
    - id                        SERIAL PRIMARY KEY
    - id_order                  integer [foreign key to orders table]
    - id_product                integer [foreign key to products table]
    - quantity                  integer
    - price                     numeric


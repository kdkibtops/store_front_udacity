import client from '../database';

// function to check if column exits in table, avoid input of wrong column names
export function checkColumnExits(
  table_name: string,
  col_name: string
): boolean {
  const users_columns: string[] = [
    'user_name',
    'first_name',
    'last_name',
    'password',
    'role',
  ];
  const orders_columns: string[] = [
    'id_user',
    'total_items',
    'total_price',
    'status',
  ];
  const products_columns: string[] = [
    'name',
    'price',
    'category',
    'total_ordered',
    'sales',
  ];
  const carts_columns: string[] = [
    'id_order',
    'id_product',
    'quantity',
    'price',
  ];
  switch (table_name) {
    case 'users':
      if (users_columns.includes(col_name)) {
        return true;
      } else {
        return false;
      }
      break;
    case 'orders':
      if (orders_columns.includes(col_name)) {
        return true;
      } else {
        return false;
      }
      break;
    case 'products':
      if (products_columns.includes(col_name)) {
        return true;
      } else {
        return false;
      }
      break;
    case 'carts':
      if (carts_columns.includes(col_name)) {
        return true;
      } else {
        return false;
      }
      break;
    default:
      return false;
      break;
  }
}

// checks if username is already presentin DB
// if username present return false, if not present return true
export async function checkUserNameInDB(
  user_name: string | number
): Promise<boolean> {
  const conn = await client.connect();
  const sql = `SELECT id, user_name, first_name, last_name FROM users WHERE user_name= '${user_name}';`;
  const result = await conn.query(sql);
  conn.release();
  if (result.rowCount) {
    return false;
  } else {
    return true;
  }
}

// checks if user is already presentin DB
// if user present return true, if not present return true
export async function checkUserIDPresentInDB(
  user_id: string | number
): Promise<boolean> {
  const conn = await client.connect();
  const sql = `SELECT * FROM users WHERE id= '${user_id}';`;
  const result = await conn.query(sql);
  conn.release();
  if (result.rowCount) {
    return true;
  } else {
    return false;
  }
}

// checks if product is already presentin DB
// if product present return true, if not present return true
export async function checkProductInDB(
  product_id: string | number
): Promise<boolean> {
  const conn = await client.connect();
  const sql = `SELECT * FROM products WHERE id= '${product_id}';`;
  const result = await conn.query(sql);
  conn.release();
  if (result.rowCount) {
    return true;
  } else {
    return false;
  }
}

// checks if order is already presentin DB
// if order present return true, if not present return true
export async function checkOrderInDB(
  order_id: string | number
): Promise<boolean> {
  const conn = await client.connect();
  const sql = `SELECT * FROM orders WHERE id= ${order_id};`;
  const result = await conn.query(sql);
  conn.release();
  if (result.rowCount) {
    return true;
  } else {
    return false;
  }
}

// checks if order is already presentin DB
// if order present return true, if not present return true
export async function checkCartInDB(
  cart_id: string | number
): Promise<boolean> {
  const conn = await client.connect();
  const sql = `SELECT * FROM carts WHERE id= ${cart_id};`;
  const result = await conn.query(sql);
  conn.release();
  if (result.rowCount) {
    return true;
  } else {
    return false;
  }
}

// Gets whatever data needed from orders
export async function getCertainDataFromOrders(
  suppliedData: string,
  suppliedDataValue: string,
  neededData: string
): Promise<string> {
  const conn = await client.connect();
  let sql = `SELECT ${neededData} FROM orders WHERE ${suppliedData} = '${suppliedDataValue}' ;`;
  if (suppliedData === 'id') {
    sql = `SELECT ${neededData} FROM orders WHERE ${suppliedData} = ${suppliedDataValue} ;`;
  }
  const result = await conn.query(sql);
  conn.release();
  return result.rows[0][neededData];
}

// Gets whatever data needed from carts
export async function getCertainDataFromCarts(
  suppliedData: string,
  suppliedDataValue: string,
  neededData: string
): Promise<string> {
  const conn = await client.connect();
  let sql = `SELECT ${neededData} FROM carts WHERE ${suppliedData} = '${suppliedDataValue}' ;`;
  if (suppliedData === 'id') {
    sql = `SELECT ${neededData} FROM carts WHERE ${suppliedData} = ${suppliedDataValue} ;`;
  }
  const result = await conn.query(sql);
  conn.release();
  return result.rows[0][neededData];
}

// Gets whatever data needed from users
export async function getCertainDataFromUser(
  suppliedData: string,
  suppliedDataValue: string,
  neededData: string
): Promise<string> {
  const conn = await client.connect();
  let sql = `SELECT ${neededData} FROM users WHERE ${suppliedData} = '${suppliedDataValue}' ;`;
  if (suppliedData === 'id') {
    sql = `SELECT ${neededData} FROM users WHERE ${suppliedData} = ${suppliedDataValue} ;`;
  }
  const result = await conn.query(sql);
  conn.release();
  return result.rows[0][neededData];
}

// Gets whatever data needed from carts
export async function getCertainDataFromProducts(
  suppliedData: string,
  suppliedDataValue: string,
  neededData: string
): Promise<string> {
  const conn = await client.connect();
  let sql = `SELECT ${neededData} FROM products WHERE ${suppliedData} = '${suppliedDataValue}' ;`;
  if (suppliedData === 'id') {
    sql = `SELECT ${neededData} FROM products WHERE ${suppliedData} = ${suppliedDataValue} ;`;
  }
  const result = await conn.query(sql);
  conn.release();
  return result.rows[0][neededData];
}

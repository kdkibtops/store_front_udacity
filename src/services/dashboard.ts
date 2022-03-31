import client from '../database';
import express from 'express';
import { Product } from '../models/product';
import { Order } from '../models/order';

export type CartItem = {
  id?: string;
  id_order: string;
  id_product: string;
  quantity: number;
  price?: number;
};

export class DashBoardQueries {
  // functions to get sql queries:
  // function to get the sum of integers in database e.g.: Quantity //DEBUGGED AND WORKING
  async getSumInteger(
    table_name: string,
    integer_column: string,
    column_name: string,
    filter_value: string
  ): Promise<number> {
    try {
      const conn = await client.connect();
      const sql = `SELECT SUM(${integer_column}) FROM ${table_name} WHERE ${column_name}=${filter_value};`;
      const result = await conn.query(sql);
      conn.release();
      return result.rows[0].sum;
    } catch (error) {
      throw new Error('error');
    }
  }
  // function to get the sum of float in database e.g.: Price //DEBUGGED AND WORKING
  async getSumFloat(
    table_name: string,
    float_column: string,
    filter_column_name: string,
    filter_value: string
  ): Promise<number> {
    try {
      const conn = await client.connect();
      const sql = `SELECT ROUND(SUM(${float_column}),2) FROM ${table_name} WHERE ${filter_column_name}= ${filter_value};`;
      const result = await conn.query(sql);
      conn.release();
      return result.rows[0].round;
    } catch (error) {
      throw new Error('error');
    }
  }
  // function to get value database e.g.: Price //DEBUGGED AND WORKING
  async getValue(
    table_name: string,
    filter_column_name: string,
    filter_value: string,
    value_column_name: string
  ): Promise<string> {
    try {
      const conn = await client.connect();
      const sql = `SELECT ${value_column_name} FROM ${table_name} WHERE ${filter_column_name}='${filter_value}'`;
      const result = await conn.query(sql);
      conn.release();
      return result.rows[0][value_column_name];
    } catch (error) {
      throw new Error('error');
    }
  }
  //to get the last created id by getting the max, called immediately after creating the order //DEBUGGED AND WORKING
  async getLastID(): Promise<string> {
    try {
      const sql = `SELECT MAX(id) AS id FROM orders;`;
      const connection = await client.connect();
      const result = await connection.query(sql);
      const id: string = result.rows[0].id;
      connection.release();
      return id;
    } catch (error) {
      throw new Error(`can't get max value: ${error}`);
    }
  }
  // function to get the order_id to be passed in show function //DEBUGGED AND WORKING
  async getOrderID(
    table_name: string,
    column_name: string,
    value: string,
    res: express.Response
  ): Promise<string> {
    try {
      const conn = await client.connect();
      const sql = `SELECT orders.id AS order_id FROM orders 
            JOIN users ON users.id = orders.id_user
            JOIN carts ON orders.id = carts.id_order
            JOIN products ON carts.id_product = products.id
            WHERE ${table_name}.${column_name}=${value}
            LIMIT 1;`;
      const result = await conn.query(sql);
      conn.release();
      let order_id: string;
      if (result.rowCount) {
        order_id = result.rows[0].order_id;
      } else {
        res.json(`Order not found in database`);
        order_id = '';
      }
      return order_id;
    } catch (error) {
      throw new Error(`Can't get the order ID from database: ${error}`);
    }
  }
  //function to update products after each item added to cart
  async updateProductsOrdered(productID: string): Promise<void> {
    const conn = await client.connect();
    const total_items_orderd = await this.getSumInteger(
      'carts',
      'quantity',
      'id_product',
      productID
    );
    const products_sales = await this.getSumFloat(
      'carts',
      'price',
      'id_product',
      productID
    );
    const sqlUpdateProducts = `UPDATE products SET total_ordered = ${total_items_orderd}, sales=${products_sales} WHERE id=${productID}`;
    await conn.query(sqlUpdateProducts);
    conn.release();
  }
}

export class DashBoardStats {
  async topProductsSales(limit: number): Promise<Product[] | null> {
    try {
      const conn = await client.connect();
      const sql = `SELECT * FROM products ORDER BY sales DESC LIMIT ${limit};`;
      const result = await conn.query(sql);
      conn.release();
      return result.rows;
    } catch (error) {
      return null;
    }
  }

  async topPopularProducts(limit: number): Promise<Product[] | null> {
    try {
      const conn = await client.connect();
      const sql = `SELECT * FROM products ORDER BY total_ordered DESC LIMIT ${limit}`;
      const result = await conn.query(sql);
      conn.release();
      return result.rows;
    } catch (error) {
      return null;
    }
  }

  async leastPopularProducts(limit: number): Promise<Product[] | null> {
    try {
      const conn = await client.connect();
      const sql = `SELECT * FROM products ORDER BY total_ordered ASC LIMIT ${limit}`;
      const result = await conn.query(sql);
      conn.release();
      return result.rows;
    } catch (error) {
      return null;
    }
  }

  async completedOrdersByUser(user_id: string): Promise<Order[]> {
    try {
      const conn = await client.connect();
      const sql = `SELECT * FROM orders WHERE id_user=${user_id} AND status='completed';`;
      const result = await conn.query(sql);
      conn.release();
      return result.rows;
    } catch (error) {
      throw new Error(`${error}`);
    }
  }

  async productsByCategories(category: string) {
    try {
      const conn = await client.connect();
      const sql = `SELECT * FROM products  WHERE category='${category}';`;
      const result = await conn.query(sql);
      conn.release();
      return result.rows;
    } catch (error) {
      return null;
    }
  }
}

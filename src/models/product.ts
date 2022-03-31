import client from '../database';
import express from 'express';

export type Product = {
  id?: string;
  name: string;
  price: number | string;
  category: string;
};

export class products {
  async index(): Promise<Product[] | null> {
    try {
      const conn = await client.connect();
      const sql = `SELECT id, name, category FROM products;`;
      const result = await conn.query(sql);
      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error(`Can't retrieve products data: ${err}`);
    }
  }

  async show(id: string): Promise<Product | null> {
    try {
      const conn = await client.connect();
      const sql = `SELECT * FROM products WHERE id='${id}';`;
      const result = await conn.query(sql);
      conn.release();
      if (result.rowCount) {
        return result.rows[0];
      } else {
        return null;
      }
    } catch (err) {
      throw new Error(`Can't retrieve product data: ${err}`);
    }
  }

  async create(pro: Product): Promise<Product | null> {
    const conn = await client.connect();
    const sql = `SELECT id FROM products WHERE name= '${pro.name}';`;
    const result = await conn.query(sql);
    conn.release();

    if (result.rowCount) {
      return null;
    } else {
      try {
        const connection = await client.connect();
        const sql = `INSERT INTO products (
                name, price, category) VALUES (
                    '${pro.name}','${pro.price}','${pro.category}');`;
        const result = await connection.query(sql);
        connection.release();
        return pro;
      } catch (err) {
        throw new Error(`Can't create new product: ${err}`);
      }
    }
  }

  async delete(id: string): Promise<string> {
    try {
      const conn = await client.connect();
      const sql = `DELETE FROM products WHERE id= '${id}';`;
      const result = await conn.query(sql);
      conn.release();
      // checks if product is found in database
      if (result.rowCount) {
        return `Product with id:${id} is deleted `;
      } else {
        return `Product with id:${id} is not found in database`;
      }
    } catch (err) {
      throw new Error(`Can't delete product: ${err}`);
    }
  }

  async Update(
    param: string,
    productID: string,
    updatedValue: string
  ): Promise<Product | string> {
    try {
      const conn = await client.connect();
      const sql = `UPDATE products SET ${param}='${updatedValue}' WHERE id = '${productID}';`;
      const result = await conn.query(sql);
      conn.release();
      // checks if product is found in database
      if (result.rowCount) {
        return `Product with id:${productID} is updated `;
      } else {
        return `product with id:${productID} is not found in database`;
      }
    } catch (err) {
      throw new Error(`Can't update product: ${err}`);
    }
  }
}

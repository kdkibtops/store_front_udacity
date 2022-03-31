import client from '../database';
import { CartItem, DashBoardQueries } from '../services/dashboard';
import { checkProductInDB } from '../services/helperFunctions';

export type Order = {
  id?: string;
  id_product: string;
  id_user: string;
  quantity: number;
  status?: string;
};

export class orders {
  dashboard = new DashBoardQueries();

  async index(): Promise<Order[]> {
    try {
      const conn = await client.connect();
      const sql = `SELECT 
            orders.id AS order_id,
            users.user_name AS customer, orders.status
            FROM carts 
            JOIN orders ON orders.id = carts.id_order
            JOIN products ON products.id = carts.id_product
            JOIN users ON users.id = orders.id_user
            ORDER BY orders.id;`;
      const result = await conn.query(sql);
      conn.release();
      return result.rows;
    } catch (error) {
      throw new Error(`Can't retrieve data ${error}`);
    }
  }
  async show(orderID: string): Promise<Order[] | null> {
    try {
      const conn = await client.connect();
      const sql = `SELECT 
            carts.id AS item_id,
            products.name, products.category, products.price AS unit_price, users.user_name AS customer, carts.quantity,
            carts.price, orders.status
            FROM carts 
            JOIN orders ON orders.id = carts.id_order
            JOIN products ON products.id = carts.id_product
            JOIN users ON users.id = orders.id_user
            WHERE orders.id=${orderID}
            ORDER BY products.name`;
      const result = await conn.query(sql);
      conn.release();
      if (result.rowCount) {
        const final_order = result.rows;
        const totalOrderPrice = await this.dashboard.getSumFloat(
          'carts',
          'price',
          'id_order',
          orderID
        );
        const totalOrderItems = await this.dashboard.getSumInteger(
          'carts',
          'quantity',
          'id_order',
          orderID
        );
        final_order.push({
          'Total items quantity': totalOrderItems,
          'Order Total': totalOrderPrice,
        });
        return final_order;
      } else {
        return null;
      }
    } catch (err) {
      throw new Error(`Can't retrieve order data: ${err}`);
    }
  }

  async create(ord: Order): Promise<string | null> {
    try {
      const connection = await client.connect();
      // Create order instance
      const sql = `INSERT INTO orders (
                    id_user, status) VALUES (
                        ${ord.id_user},'${ord.status}')`;
      await connection.query(sql);
      // get created order id
      const order_id = await this.dashboard.getLastID();
      // update cart with the current order // Get unit and total order price
      const unitPrice = await this.dashboard.getValue(
        'products',
        'id',
        ord.id_product,
        'price'
      );
      const orderPrice = (unitPrice as unknown as number) * ord.quantity;
      const sql_update_cart = `INSERT INTO carts (
                        id_order, id_product, quantity, price) VALUES ( 
                        ${order_id}, ${ord.id_product}, ${ord.quantity}, ${orderPrice});`;
      await connection.query(sql_update_cart);
      // update order after updating the cart to get total items and prices
      const total_items = await this.dashboard.getSumInteger(
        'carts',
        'quantity',
        'id_order',
        order_id
      );
      const total_price = await this.dashboard.getSumFloat(
        'carts',
        'price',
        'id_order',
        order_id
      );
      const sql_update_order = `UPDATE orders SET total_items=${total_items}, total_price=${total_price} WHERE id=${order_id};`;
      await connection.query(sql_update_order);
      connection.release();
      await this.dashboard.updateProductsOrdered(ord.id_product);
      return `New order created, order id: ${order_id}`;
    } catch (err) {
      throw new Error(`Can't create new product: ${err}`);
    }
  }

  async addToCart(cart: CartItem): Promise<boolean | null> {
    const product_available = await checkProductInDB(cart.id_product);
    if (product_available) {
      try {
        const connection = await client.connect();
        const sql_cheeck_order = `SELECT * FROM orders WHERE id = ${cart.id_order}`;
        const orderPresent = await connection.query(sql_cheeck_order);
        if (!orderPresent.rowCount) {
          //    order is not found
          connection.release();
          return false;
        } else if (orderPresent.rowCount) {
          const unitPrice = await this.dashboard.getValue(
            'products',
            'id',
            cart.id_product,
            'price'
          );
          const orderPrice = (unitPrice as unknown as number) * cart.quantity;
          const sql_update_cart = `INSERT INTO carts (
                        id_order, id_product, quantity, price) VALUES ( 
                        ${cart.id_order}, ${cart.id_product}, ${cart.quantity}, ${orderPrice});`;
          await connection.query(sql_update_cart);
          // update order after updating the cart to get total items and prices
          const total_items = await this.dashboard.getSumInteger(
            'carts',
            'quantity',
            'id_order',
            cart.id_order
          );
          const total_price = await this.dashboard.getSumFloat(
            'carts',
            'price',
            'id_order',
            cart.id_order
          );
          const sql_update_order = `UPDATE orders SET total_items=${total_items}, total_price=${total_price} WHERE id=${cart.id_order};`;
          await connection.query(sql_update_order);
          connection.release();
          // update products after updating the cart to get total items ordered from this product
          await this.dashboard.updateProductsOrdered(cart.id_product);
          // if product and order are found and everything went well return true
          return true;
        } else {
          connection.release();
          return null;
        }
      } catch (err) {
        throw new Error(`Can't create new product: ${err}`);
      }
    } else {
      //    if product was not found
      return null;
    }
  }

  async delete(id: string): Promise<string> {
    try {
      const conn = await client.connect();
      const sql = `DELETE FROM orders WHERE id='${id}';`;
      const result = await conn.query(sql);
      conn.release();
      // checks if order is found in database
      if (result.rowCount) {
        return `Order with id:${id} is deleted `;
      } else {
        return `Order with id:${id} is not found in database`;
      }
    } catch (err) {
      throw new Error(`Can't delete order: ${err}`);
    }
  }

  async Update(
    param: string,
    orderID: string,
    updateValue: string
  ): Promise<string> {
    try {
      const conn = await client.connect();
      const sql = `UPDATE orders SET ${param}='${updateValue}' WHERE id = '${orderID}';`;
      const result = await conn.query(sql);
      conn.release();
      // checks if order is found in database
      if (result.rowCount) {
        return `Order with id:${orderID} is updated successfuly`;
      } else {
        return `Order with id:${orderID} is not found in database`;
      }
    } catch (err) {
      throw new Error(`Can't update order: ${err}`);
    }
  }

  async deleteFromCart(cart_id: string, order_id: string): Promise<string> {
    try {
      const conn = await client.connect();
      const sql = `DELETE FROM carts WHERE id='${cart_id}';`;
      const result = await conn.query(sql);
      // update order after updating the cart to get total items and prices
      const total_items = await this.dashboard.getSumInteger(
        'carts',
        'quantity',
        'id_order',
        order_id
      );
      const total_price = await this.dashboard.getSumFloat(
        'carts',
        'price',
        'id_order',
        order_id
      );
      const sql_update_order = `UPDATE orders SET total_items=${total_items}, total_price=${total_price} WHERE id=${order_id};`;
      await conn.query(sql_update_order);
      conn.release();
      // checks if order is found in database
      if (result.rowCount) {
        return `Item(s) in cart with id:${cart_id} are deleted `;
      } else {
        return `Cart with id:${cart_id} is not found in database`;
      }
    } catch (err) {
      throw new Error(`Can't delete order: ${err}`);
    }
  }

  async showOrderByUser(
    column_name: string,
    user_id: string
  ): Promise<Order[] | null> {
    try {
      const conn = await client.connect();
      const sql = `SELECT 
              orders.id AS order_id, orders.total_items, orders.total_price ,orders.status,
              users.first_name AS Customer_name, users.user_name AS Customer_username, users.id AS customer_id
              FROM orders
              JOIN users ON users.id = orders.id_user
              WHERE ${column_name} = '${user_id}';`;
      const result = await conn.query(sql);
      conn.release();
      if (result.rowCount) {
        const orderIDs: number[] = [];
        for (let i = 0; i < result.rowCount; i++) {
          orderIDs.push(result.rows[i].order_id);
        }
        const final_order = result.rows;
        let price = 0;
        let items = 0;
        for (let i = 0; i < orderIDs.length; i++) {
          const orderPrice: number = await this.dashboard.getSumFloat(
            'carts',
            'price',
            'id_order',
            orderIDs[i] as unknown as string
          );
          const totalOrderItems: number = await this.dashboard.getSumInteger(
            'carts',
            'quantity',
            'id_order',
            orderIDs[i] as unknown as string
          );
          if (orderPrice) {
            price += parseFloat(orderPrice as unknown as string);
          }
          if (totalOrderItems) {
            items += parseInt(totalOrderItems as unknown as string);
          }
        }
        final_order.push({
          'Total items quantity': items,
          'Order Total': price,
        });
        return final_order;
      } else {
        return null;
      }
    } catch (err) {
      throw new Error(`Can't retrieve order data: ${err}`);
    }
  }

  async showOrderByStatus(
    column_name: string,
    status: string
  ): Promise<Order[] | null> {
    try {
      const conn = await client.connect();
      const sql = `SELECT 
                orders.id, orders.total_items, orders.total_price, orders.status,
                users.first_name AS Customer_name, users.user_name AS Customer_username, users.id AS customer_id
                FROM orders
                JOIN users ON users.id = orders.id_user
                WHERE ${column_name} = '${status}';`;
      const result = await conn.query(sql);
      conn.release();
      if (result.rowCount) {
        return result.rows;
      } else {
        return null;
      }
    } catch (err) {
      throw new Error(`Can't retrieve order data: ${err}`);
    }
  }
}

import supertest from 'supertest';
import { createToken } from '../../handlers/authentication';
import { Product, products } from '../../models/product';
import { User, users } from '../../models/user';
import app from '../../server';
import express from 'express';

let user_id: string;
let product_id: string;
let token = '';
let res: express.Response;
const req_data = { username: 'xyz', password: 'password' };

describe('Orders test suite', async () => {
  beforeAll(async () => {
    const u = new users();
    const p = new products();
    const testProduct: Product = {
      name: 'xyz',
      price: '3.4',
      category: 'xyz',
    };
    const testUser: User = {
      user_name: 'xyz',
      password: 'xyz',
      first_name: 'xyz',
      last_name: 'xyx',
      role: 'admin',
    };
    await u.create(testUser);
    await p.create(testProduct);
  });

  it('index orders', async () => {
    token = 'BEARER ' + (await createToken('xyz', res));
    supertest(app)
      .get('orders/index')
      .send(JSON.stringify(req_data))
      .set('Authorization', token)
      .then((response) => {
        expect(response.status).toBe(200);
      });
  });

  it('creates new order', async () => {
    const testOrder = {
      username: 'xyz',
      password: 'xyz',
      id_user: user_id,
      id_product: product_id,
      quantity: 1,
      status: 'xyz',
    };
    supertest(app)
      .post('orders/create')
      .send(JSON.stringify(testOrder))
      .set('Authorization', token)
      .then((response) => {
        expect(response.status).toBe(200);
      });
  });

  it('Update orders route [put] orders/route', async () => {
    supertest(app)
      .put('orders/update')
      .send(JSON.stringify(req_data))
      .set('Authorization', token)
      .then((response) => {
        expect(response.status).toBe(200);
      });
  });

  it('Delete orders route [delete]orders/route', async () => {
    supertest(app)
      .delete('orders/delete')
      .send(JSON.stringify(req_data))
      .set('Authorization', token)
      .then((response) => {
        expect(response.status).toBe(200);
      });
  });

  it('Add item to cart [post] orders/addtocart', async () => {
    supertest(app)
      .post('orders/addtocart')
      .send(JSON.stringify(req_data))
      .set('Authorization', token)
      .then((response) => {
        expect(response.status).toBe(200);
      });
  });

  it('Delete item from cart [delete] orders/deletefromcart', async () => {
    supertest(app)
      .delete('orders/deletefromcart')
      .send(JSON.stringify(req_data))
      .set('Authorization', token)
      .then((response) => {
        expect(response.status).toBe(200);
      });
  });
});

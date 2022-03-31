import supertest from 'supertest';
import app from '../../server';
const requestServer = supertest(app);

const token =
  'BEARER eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjcsInVzZXJfbmFtZSI6Imtka2lidG9wcyIsImZpcnN0X25hbWUiOiJNdXN0YWZhIiwibGFzdF9uYW1lIjoiSGVpZGFyIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNjQ3MzQ2OTcxfQ.4y-2XkGEFnF2ct38wPKSajjfZomiI0S7FC_sZl_M5IA';

const requestbodydata = {
  username: 'test_',
  password: 'test_',
  name: 'testingProduct',
  price: '1000',
  category: 'testCategory',
};

describe('Products Hanlders test suite', () => {
  it('Get the /products/index route', async () => {
    const response = await requestServer.get('/products/index');
    expect(response.status).toBe(200);
  });

  it('Gets the products/show route', async () => {
    const response = await requestServer.get('/products/show/1');
    expect(response.status).toBe(200);
  });

  it('Create new product [post] products/create route', async () => {
    supertest(app)
      .post('/products/create')
      .send(JSON.stringify(requestbodydata))
      .set('Authorization', token)
      .then((response) => {
        expect(response.status).toBe(200);
      });
  });

  it('Update product [put] products/update route', async () => {
    const update_requestbodydata = {
      username: 'test_',
      password: 'test_',
      productid: '1',
      updatefield: 'price',
      updatevalue: '1000',
    };
    supertest(app)
      .put('/products/update')
      .send(JSON.stringify(update_requestbodydata))
      .set('Authorization', token)
      .then((response) => {
        expect(response.status).toBe(200);
      });
  });

  it('Delete product [delete] products/create route', async () => {
    const delete_requestbodydata = {
      username: 'test_',
      password: 'test_',
      productid: '100',
    };
    supertest(app)
      .delete('/products/delete')
      .send(JSON.stringify(delete_requestbodydata))
      .set('Authorization', token)
      .then((response) => {
        expect(response.status).toBe(200);
      });
  });
});

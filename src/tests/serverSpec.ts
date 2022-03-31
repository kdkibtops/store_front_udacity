import supertest from 'supertest';
import app from '../server';
const requestServer = supertest(app);

describe('Test server initiation', () => {
  it('gets the root API endpoint', async () => {
    const response = await requestServer.get('/');
    expect(response.status).toBe(200);
  });
  it('gets the users route', async () => {
    const response = await requestServer.get('/users');
    expect(response.status).toBe(200);
  });

  it('gets the products route', async () => {
    const response = await requestServer.get('/products');
    expect(response.status).toBe(200);
  });

  it('gets the orders route', async () => {
    const response = await requestServer.get('/orders');
    expect(response.status).toBe(200);
  });
});

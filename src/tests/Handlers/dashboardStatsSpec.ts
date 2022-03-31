import supertest from 'supertest';
import app from '../../server';
const requestServer = supertest(app);

describe('Dashboard test suite', async () => {
  it('top products route', async () => {
    const result = await requestServer.get('/dashboard/top_products');
    expect(result.status).toBe(200);
  });

  it('lest products route', async () => {
    const result = await requestServer.get('/dashboard/bottom_products');
    expect(result.status).toBe(200);
  });
  it('GET products by category', async () => {
    const result = await requestServer.get(
      '/dashboard/products_by_category/test'
    );
    expect(result.status).toBe(200);
  });
});

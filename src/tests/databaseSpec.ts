import client from '../database';

describe('Database connection test', async () => {
  it('SHould return true if connected to database', async () => {
    const connection = await client.connect();
    const sql = `SELECT NOW();`;
    const result = await connection.query(sql);
    expect(result).toBeTruthy;
  });
});

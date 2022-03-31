import supertest from 'supertest';
import app from '../../server';
import { User, users } from '../../models/user';
import { getCertainDataFromUser } from '../../services/helperFunctions';
import { authenticate, createToken } from '../../handlers/authentication';
import express from 'express';

const requestbodydata = {
  username: '123',
  password: '123',
};
let token: string;
const res = express.response;
const req = express.request;
req.body = JSON.stringify({ username: '123', password: '123' });

describe('User handler tests suite', async () => {
  beforeAll(async () => {
    // create user instance
    const u = new users();
    const testUser: User = {
      user_name: '123',
      password: '123',
      first_name: '123',
      last_name: '123',
      role: 'admin',
    };
    await u.create(testUser);
    token = await createToken('123', res);
  });

  it('Middleware: Authenticates the created test user', async () => {
    const result = await authenticate(
      requestbodydata.username,
      requestbodydata.password
    );
    expect(result).toBeTrue;
  });

  it('Middleware: Creates token for the user ', async () => {
    token = await createToken(requestbodydata.username, res);
    expect(token).toBeTruthy;
  });

  it('Should create a new user[post]', async () => {
    const testUser: User = {
      user_name: 'test1',
      password: 'test1',
      first_name: 'test1',
      last_name: 'test1',
      role: 'admin',
    };
    supertest(app)
      .post('/users/create')
      .send(testUser)
      .then((response) => {
        expect(response.status).toBe(200);
      });
  });

  it('Should get the /users/index route', async () => {
    supertest(app)
      .get('/users/index')
      .send(JSON.stringify(requestbodydata))
      .set('Authorization', token)
      .then((response) => {
        expect(response.status).toBe(200);
      });
  });

  it('Gets the users/show route', async () => {
    const user_id = await getCertainDataFromUser('user_name', '123', 'id');
    supertest(app)
      .get(`/users/show/${user_id}`)
      .send(JSON.stringify(requestbodydata))
      .set('Authorization', token)
      .then((response) => {
        expect(response.status).toBe(200);
      });
  });

  it('Updates the user [put] users/update route', async () => {
    const user_id = await getCertainDataFromUser('user_name', '123', 'id');
    const update_requestbodydata = {
      username: '123',
      password: '123',
      userid: user_id,
      updatefield: 'first_name',
      updatevalue: '123',
    };
    supertest(app)
      .put(`/users/update`)
      .send(JSON.stringify(update_requestbodydata))
      .set('Authorization', token)
      .then((response) => {
        expect(response.status).toBe(200);
      });
  });

  it('Deletes user [delete] users/delete route', async () => {
    const user_id = await getCertainDataFromUser('user_name', '123', 'id');
    const delete_requestbodydata = {
      username: '123',
      password: '123',
      userid: user_id,
    };
    supertest(app)
      .delete(`/users/delete`)
      .send(JSON.stringify(delete_requestbodydata))
      .set('Authorization', token)
      .then((response) => {
        expect(response.status).toBe(200);
      });
  });
});

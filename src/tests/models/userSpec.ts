import { User, users } from '../../models/user';
import { getCertainDataFromUser } from '../../services/helperFunctions';
import express from 'express';

const testUser = new users();
const testApp = express();

describe('Users model testing : Functions definition', () => {
  it('Should have an index method', () => {
    expect(testUser.index).toBeDefined();
  });
  it('Should have an show method', () => {
    expect(testUser.show).toBeDefined();
  });
  it('Should have an create method', () => {
    expect(testUser.create).toBeDefined();
  });
  it('Should have an update method', () => {
    expect(testUser.Update).toBeDefined();
  });
  it('Should have an delete method', () => {
    expect(testUser.delete).toBeDefined();
  });
});

describe('Users model testing : Functions return values', () => {
  it('Index method should retrun array of users', async () => {
    expect(await testUser.index()).toBeTruthy();
  });

  it('Create method should return an User object', async () => {
    const newUser = {
      user_name: 'testUser',
      first_name: 'testUser',
      last_name: 'testUser',
      password: 'testUser',
      role: 'testUser',
    };
    const result = await testUser.create(newUser);
    const userID = await getCertainDataFromUser('user_name', 'testUser', 'id');
    expect(result).toEqual({
      id: userID,
      user_name: 'testUser',
      first_name: 'testUser',
      last_name: 'testUser',
      role: 'testUser',
    });
  });

  it('Show method should return user object with given id', async () => {
    const userID = await getCertainDataFromUser('user_name', 'testUser', 'id');
    const result = await testUser.show(userID);
    expect(result).toEqual({
      id: userID,
      user_name: 'testUser',
      first_name: 'testUser',
      last_name: 'testUser',
      role: 'testUser',
    });
  });

  it('Update method should return string with given id', async () => {
    const userID = await getCertainDataFromUser('user_name', 'testUser', 'id');
    const result = await testUser.Update(
      'last_name',
      userID,
      'updatedTestUser'
    );
    expect(result).toEqual(`User with id:${userID} is updated `);
  });

  it('Delete method should return string with given id', async () => {
    const userID = await getCertainDataFromUser('user_name', 'testUser', 'id');
    const result = await testUser.delete(userID);
    expect(result).toEqual(`User with id:${userID} is deleted `);
  });
});

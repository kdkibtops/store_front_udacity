import client from '../database';
import express from 'express';
import {
  checkUserNameInDB,
  getCertainDataFromUser,
} from '../services/helperFunctions';

export type User = {
  id?: string;
  user_name?: string; //maximum 20 character
  first_name?: string;
  last_name?: string;
  password?: string;
  role?: string;
};

export class users {
  async index(): Promise<User[]> {
    try {
      const conn = await client.connect();
      const sql: string = `SELECT id, user_name, first_name, last_name FROM users;`;
      const result = await conn.query(sql);
      conn.release();
      return result.rows;
    } catch (error) {
      throw new Error(`Can't retrieve users data: ${error}`);
    }
  }

  async show(id: string): Promise<User | string> {
    try {
      const conn = await client.connect();
      const sql = `SELECT id, user_name, first_name, last_name, role FROM users WHERE id= '${id}';`;
      const result = await conn.query(sql);
      conn.release();
      if (result.rowCount) {
        return result.rows[0];
      } else {
        return `User with id:${id} is not found in database`;
      }
    } catch (error) {
      throw new Error(`Can't get user data: ${error}`);
    }
  }

  async create(user: User): Promise<User | string> {
    // check if new username is already present
    if (!(await checkUserNameInDB(user.user_name as string))) {
      return `Username: (${user.user_name}) is already present!`;
    }
    // if username is not present in DB, create User
    try {
      const conn = await client.connect();
      const sql = `INSERT INTO users (
                        user_name, first_name, last_name, password_digest, role
                    ) VALUES ('${user.user_name}', '${user.first_name}', '${user.last_name}', '${user.password}', '${user.role}')`;
      await conn.query(sql);
      // retrieve data for return value
      const retrieveChanges = `SELECT id, user_name, first_name, last_name, role 
                FROM users WHERE user_name= '${user.user_name}'`;
      const result = await conn.query(retrieveChanges);
      conn.release();
      return result.rows[0];
    } catch (error) {
      throw new Error(`Can't create user: ${error}`);
    }
  }

  async delete(id: string): Promise<string> {
    try {
      const conn = await client.connect();
      const sql = `DELETE FROM users WHERE id= '${id}';`;
      const result = await conn.query(sql);
      conn.release();
      if (result.rowCount) {
        return `User with id:${id} is deleted `;
      } else {
        return `User with id:${id} is not found in database`;
      }
    } catch (error) {
      throw new Error(`Can't delete user: ${error}`);
    }
  }

  async Update(
    param: string,
    userID: string,
    updatedValue: string
  ): Promise<string> {
    try {
      // if user is updating username, check if new username is already present
      if (param === 'user_name') {
        if (!(await checkUserNameInDB(updatedValue))) {
          return `Username is already present in database`;
        }
      }
      // if new user in not present, proceed with updating username
      const conn = await client.connect();
      const sql = `UPDATE users SET ${param}='${updatedValue}' WHERE id = '${userID}';`;
      const result = await conn.query(sql);
      conn.release();
      if (result.rowCount) {
        return `User with id:${userID} is updated `;
      } else {
        return `User with id:${userID} is not found in database`;
      }

      // checks if user is found in database
    } catch (err) {
      throw new Error(`Can't update user: ${err}`);
    }
  }
}

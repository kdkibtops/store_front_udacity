import { User, users } from '../models/user';
import express from 'express';
import {
  passwordHashing,
  verifyToken,
  authenticateUser,
  verifyUser,
} from './authentication';
import {
  checkColumnExits,
  checkUserIDPresentInDB,
} from '../services/helperFunctions';

const user_ = new users();
const users_routes = express.Router();

const indexUsers = async (
  _req: express.Request,
  res: express.Response
): Promise<void> => {
  try {
    const verification = await verifyUser(_req.body.username);
    if (verification === null) {
      res.json(`Username to update is not found in database`);
    } else if (verification === true) {
      const users__ = await user_.index(); // reconsider putting await before the function
      res.json(users__);
    } else if (verification === false) {
      res.json(`User verification failed`);
    }
  } catch (error) {
    throw new Error(`!Error at handler level!, Can't retrieve data: ${error}`);
  }
};

const showUser = async (
  req: express.Request,
  res: express.Response
): Promise<void | null> => {
  // verify that entered parameters are correct to avoid server/sql errors
  const valid_numeric_id = /^\d+$/.test(req.params.userid);
  if (!valid_numeric_id) {
    res.json('Only numbers are allowed in id;');
    return;
  }
  const user_present = await checkUserIDPresentInDB(req.params.userid);
  if (!user_present) {
    res.json(`User ID: ${req.params.userid} is not found in database`);
    return;
  }
  try {
    const verification = await verifyUser(
      req.body.username,
      '',
      'admin',
      'user',
      'guest'
    );
    if (verification === null) {
      res.json(`User: ${req.body.username} is not found in database`);
      return null;
    } else if (verification === true) {
      const userID: string = req.params.userid as string;
      const result = await user_.show(userID);
      res.json(result);
    } else if (verification === false) {
      res.send(
        `Request rejected:\nEither User verification failed or user has no permission `
      );
      return null;
    } else {
      return null;
    }
  } catch (error) {
    throw new Error(`!Error at handler level!, cant  show user: ${error}`);
  }
};

const createUser = async (
  req: express.Request,
  res: express.Response
): Promise<void | null> => {
  try {
    // encrypt user password
    const passwordDigest: string = passwordHashing(req.body.password as string);
    const newUser: User = {
      user_name: req.body.new_username as string,
      first_name: req.body.firstname as string,
      last_name: req.body.lastname as string,
      password: passwordDigest,
      role: req.body.role as string,
    };
    const result = await user_.create(newUser);
    res.json(result);
  } catch (error) {
    throw new Error(`!Error at handler level!, Can't create user: ${error}`);
  }
};

const deleteUser = async (
  req: express.Request,
  res: express.Response
): Promise<void> => {
  // verify that entered parameters are correct to avoid server/sql errors
  const valid_numeric_id = /^\d+$/.test(req.body.userid);
  if (!valid_numeric_id) {
    res.json('Only numbers are allowed in id;');
    return;
  }
  const user_present = await checkUserIDPresentInDB(req.body.userid);
  if (!user_present) {
    res.json(`User ID: ${req.body.userid} is not found in database`);
    return;
  }
  try {
    const verification = await verifyUser(
      req.body.username,
      req.body.userid,
      'admin',
      'user'
    );
    if (verification === null) {
      res.json(`User: ${req.body.username} is not found in database`);
    } else if (verification === true) {
      const userID: string = req.body.userid as string;
      const result = await user_.delete(userID);
      res.json(result);
    } else if (verification === false) {
      res.send(`Request rejected:
        Either User verification failed or user has no permission `);
    }
  } catch (error) {
    throw new Error(`!Error at handler level!, Can't delete user: ${error}`);
  }
};

const updateUser = async (
  req: express.Request,
  res: express.Response
): Promise<void> => {
  // verify that entered parameters are correct to avoid server/sql errors
  const valid_numeric_id = /^\d+$/.test(req.body.userid);
  if (!valid_numeric_id) {
    res.json('Only numbers are allowed in id;');
    return;
  }
  if (!checkColumnExits('users', req.body.updatefield)) {
    res.json('Column does not exist in users table, check your parameters!');
    return;
  }
  const user_present = await checkUserIDPresentInDB(req.body.userid);
  if (!user_present) {
    res.json(`User ID: ${req.body.userid} is not found in database`);
    return;
  }
  try {
    const verification = await verifyUser(
      req.body.username,
      req.body.userid,
      'admin',
      'user'
    );
    if (verification === null) {
      res.json(`User: ${req.body.username} is not found in database`);
    } else if (verification === true) {
      const userId: string = req.body.userid as string;
      let param: string = req.body.updatefield as string;
      let value: string = req.body.updatevalue as string;
      // if user is updating password encrypt password and change param to be password_digest as in DB
      if (req.body.updatefield === 'password') {
        value = passwordHashing(req.body.password as string);
        param = 'password_digest';
      }
      if (
        param === 'user_name' ||
        param === 'first_name' ||
        param === 'last_name' ||
        param === 'password_digest' ||
        param === 'role'
      ) {
        try {
          const updatedUser = await user_.Update(param, userId, value);
          res.json(updatedUser);
        } catch (error) {
          throw new Error(`${error}`);
        }
      } else {
        res.json(`Check entered argument: ${param}`);
      }
    } else if (verification === false) {
      res.send(`Request rejected:
            Either User verification failed or user has no permission `);
    }
  } catch (error) {
    throw new Error(`!Error at handler level!, Can't update user: ${error}`);
  }
};

const welcome = async (
  _req: express.Request,
  res: express.Response
): Promise<void> => {
  try {
    res.send('Welcome to the users section');
  } catch (error) {
    throw new Error(`Can't welcome`);
  }
};

users_routes.get('/index', authenticateUser, verifyToken, indexUsers);
users_routes.get('/show/:userid', authenticateUser, verifyToken, showUser);
users_routes.get('/', welcome);

users_routes.delete('/delete', verifyToken, authenticateUser, deleteUser);

users_routes.post('/create', createUser);

users_routes.put('/update', authenticateUser, verifyToken, updateUser);

export default users_routes;

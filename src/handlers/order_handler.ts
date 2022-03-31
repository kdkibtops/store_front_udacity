import express from 'express';
import { Order, orders } from '../models/order';
import { CartItem } from '../services/dashboard';
import {
  checkCartInDB,
  checkColumnExits,
  checkOrderInDB,
  checkProductInDB,
  checkUserIDPresentInDB,
  getCertainDataFromCarts,
  getCertainDataFromOrders,
} from '../services/helperFunctions';
import { verifyToken, authenticateUser, verifyUser } from './authentication';

const order_ = new orders();
const orders_routes = express.Router();

const indexOrders = async (
  req: express.Request,
  res: express.Response
): Promise<void> => {
  try {
    const verification = await verifyUser(
      req.body.username,
      '',
      'admin',
      'user'
    );
    if (verification === null) {
      res.json(`User: ${req.body.username} is not found in database`);
      return;
    } else if (verification === true) {
      const orders = await order_.index();
      res.json(orders);
    } else if (verification === false) {
      res.send(
        `Request rejected:\nEither User verification failed or user has no permission `
      );
      return;
    } else {
      return;
    }
  } catch (error) {
    throw new Error(` !Error at handler level! can't retrieve data : ${error}`);
  }
};

const createOrder = async (
  req: express.Request,
  res: express.Response
): Promise<void> => {
  // verify that entered parameters are correct to avoid server/sql errors
  const valid_user_id: boolean = /^\d+$/.test(req.body.id_user);
  if (!valid_user_id) {
    res.json('Only numbers are allowed in user id;');
    return;
  }
  const valid_product_id: boolean = /^\d+$/.test(req.body.id_product);
  if (!valid_product_id) {
    res.json('Only numbers are allowed in product id;');
    return;
  }
  const user_present = await checkUserIDPresentInDB(req.body.id_user);
  if (!user_present) {
    res.json(`User ID: ${req.body.id_user} is not found in database`);
    return;
  }
  const product_present = await checkProductInDB(req.body.id_product);
  if (!product_present) {
    res.json(`Product ID: ${req.body.id_product} is not found in database`);
    return;
  }

  try {
    const verification = await verifyUser(
      req.body.username,
      req.body.id_user,
      'admin',
      'user'
    );
    if (verification === null) {
      const user_present = await checkUserIDPresentInDB(
        req.body.id_user as string
      );
      if (!user_present) {
        res.json(`UserID: ${req.body.id_user} is not found in database`);
      } else {
        res.json(`Username: ${req.body.username} is not found in database`);
        return;
      }
    } else if (verification === true) {
      const newOrder: Order = {
        id_product: req.body.id_product as string,
        id_user: req.body.id_user as string,
        quantity: parseInt(req.body.quantity as string),
        status: req.body.status as string,
      };
      const result = await order_.create(newOrder);
      res.json(result);
      return;
    } else if (verification === false) {
      res.send(
        `Request rejected:\nEither User verification failed or user has no permission `
      );
      return;
    } else {
      return;
    }
  } catch (error) {
    throw new Error(` !Error at handler level! can't create order: ${error}`);
  }
};

const showOrder = async (
  req: express.Request,
  res: express.Response
): Promise<void> => {
  const valid_order_id: boolean = /^\d+$/.test(req.params.orderid);
  if (!valid_order_id) {
    res.json('Only numbers are allowed in order id;');
    return;
  }
  const order_present = await checkOrderInDB(req.params.orderid);
  if (!order_present) {
    res.json(`Order ID: ${req.params.orderid} is not found in database`);
    return;
  }
  try {
    const user_id: string = await getCertainDataFromOrders(
      'id',
      req.params.orderid,
      'id_user'
    );
    const verification = await verifyUser(
      req.body.username,
      user_id,
      'admin',
      'user'
    );
    if (verification === null) {
      res.json(`User: ${req.body.username} is not found in database`);
      return;
    } else if (verification === true) {
      const orderID: string = req.params.orderid as string;
      const result = await order_.show(orderID);
      if (result) {
        res.json(result);
      } else if (result === null) {
        res.json(`Order ${orderID}'s cart is empty`);
      }
    } else if (verification === false) {
      res.send(
        `Request rejected:\nEither User verification failed or user has no permission `
      );
      return;
    }
  } catch (error) {
    throw new Error(` !Error at handler level! can't show order: ${error}`);
  }
};

const addItem = async (
  req: express.Request,
  res: express.Response
): Promise<void> => {
  const valid_order_id: boolean = /^\d+$/.test(req.body.id_order);
  if (!valid_order_id) {
    res.json('Only numbers are allowed in order id;');
    return;
  }
  const order_present = await checkOrderInDB(req.body.id_order);
  if (!order_present) {
    res.json(`Order ID: ${req.body.id_order} is not found in database`);
    return;
  }
  const valid_product_id: boolean = /^\d+$/.test(req.body.id_product);
  if (!valid_product_id) {
    res.json('Only numbers are allowed in product id;');
    return;
  }
  const product_present = await checkProductInDB(req.body.id_product);
  if (!product_present) {
    res.json(`Product ID: ${req.body.id_product} is not found in database`);
    return;
  }
  try {
    const user_id: string = await getCertainDataFromOrders(
      'id',
      req.body.id_order,
      'id_user'
    );
    const verification = await verifyUser(
      req.body.username,
      user_id,
      'admin',
      'user'
    );
    if (verification === null) {
      res.json(`User: ${req.body.username} is not found in database`);
      return;
    } else if (verification === true) {
      const newItem: CartItem = {
        id_product: req.body.id_product as string,
        id_order: req.body.id_order as string,
        quantity: parseInt(req.body.quantity as string),
      };
      const created_order = await order_.addToCart(newItem);
      if (created_order === true) {
        res.json(`New item added to order: ${newItem.id_order}`);
        return;
      } else if (created_order === false) {
        res.json('Order not found in database');
        return;
      } else {
        res.json(`Can't add items to order!`);
        return;
      }
    } else if (verification === false) {
      res.send(
        `Request rejected:\nEither User verification failed or user has no permission `
      );
      return;
    } else {
      return;
    }
  } catch (error) {
    throw new Error(` !Error at handler level! can't create order: ${error}`);
  }
};

const updateOrder = async (
  req: express.Request,
  res: express.Response
): Promise<void> => {
  const valid_order_id: boolean = /^\d+$/.test(req.body.orderid);
  if (!valid_order_id) {
    res.json('Only numbers are allowed in order id;');
    return;
  }
  const order_present = await checkOrderInDB(req.body.orderid);
  if (!order_present) {
    res.json(`Order ID: ${req.body.orderid} is not found in database`);
    return;
  }
  if (!checkColumnExits('orders', req.body.updatefield)) {
    res.json('Column does not exist in orders table, check your parameters!');
    return;
  }
  try {
    const user_id: string = await getCertainDataFromOrders(
      'id',
      req.body.orderid,
      'id_user'
    );
    const verification = await verifyUser(
      req.body.username,
      user_id,
      'admin',
      'user'
    );
    if (verification === null) {
      res.json(`User: ${req.body.username} is not found in database`);
      return;
    } else if (verification === true) {
      const orderID: string = req.body.orderid as string;
      const param: string = req.body.updatefield as string;
      const value: string = req.body.updatevalue as string;

      if (param === 'id_user' || param === 'status') {
        try {
          const result = await order_.Update(param, orderID, value);
          res.json(result);
        } catch (error) {
          res.json(`updating order failed`);
          throw new Error(`Error: ${error}`);
        }
        return;
      } else if (param === 'total_items' || param === 'total_price') {
        res.json(
          `User Can't update ${param}, values are only updated automatically!`
        );
      } else {
        res.json(`Check entered argument: ${param}`);
      }
    } else if (verification === false) {
      res.send(
        `Request rejected:\nEither User verification failed or user has no permission `
      );
      return;
    } else {
      return;
    }
  } catch (error) {
    throw new Error(` !Error at handler level! can't update order: ${error}`);
  }
};

const deleteOrder = async (
  req: express.Request,
  res: express.Response
): Promise<void> => {
  const valid_order_id: boolean = /^\d+$/.test(req.body.orderid);
  if (!valid_order_id) {
    res.json('Only numbers are allowed in order id;');
    return;
  }
  const order_present = await checkOrderInDB(req.body.orderid);
  if (!order_present) {
    res.json(`Order ID: ${req.body.orderid} is not found in database`);
    return;
  }
  try {
    let user_id: string;
    try {
      user_id = await getCertainDataFromOrders(
        'id',
        req.body.orderid,
        'id_user'
      );
    } catch (error) {
      res.json(`Order not found!`);
      return;
    }
    const verification = await verifyUser(
      req.body.username,
      user_id,
      'admin',
      'user'
    );
    if (verification === null) {
      res.json(`User: ${req.body.username} is not found in database`);
      return;
    } else if (verification === true) {
      const orderID: string = req.body.orderid as string;
      const result = await order_.delete(orderID);
      res.json(result);
    } else if (verification === false) {
      res.send(
        `Request rejected:\nEither User verification failed or user has no permission `
      );
      return;
    } else {
      return;
    }
  } catch (error) {
    throw new Error(` !Error at handler level! can't delete order: ${error}`);
  }
};

const deleteFromCart = async (
  req: express.Request,
  res: express.Response
): Promise<void> => {
  const valid_cart_id: boolean = /^\d+$/.test(req.body.id_cart);
  if (!valid_cart_id) {
    res.json('Only numbers are allowed in cart id;');
    return;
  }
  const cart_present = await checkCartInDB(req.body.id_cart);
  if (!cart_present) {
    res.json(`Cart ID: ${req.body.id_cart} is not found in database`);
    return;
  }
  try {
    let user_id: string;
    let order_id: string;
    try {
      order_id = await getCertainDataFromCarts(
        'id',
        req.body.id_cart,
        'id_order'
      );
      user_id = await getCertainDataFromOrders('id', order_id, 'id_user');
    } catch (error) {
      res.json(
        `cart with id ${req.body.id_cart} not found or no user is associated with this order, contact adminstrator!`
      );
      return;
    }
    const verification = await verifyUser(
      req.body.username,
      user_id,
      'admin',
      'user'
    );
    if (verification === null) {
      res.json(`User: ${req.body.username} is not found in database`);
      return;
    } else if (verification === true) {
      const cartID: string = req.body.id_cart as string;
      const result = await order_.deleteFromCart(cartID, order_id);
      res.json(result);
    } else if (verification === false) {
      res.send(
        `Request rejected:\nEither User verification failed or user has no permission `
      );
      return;
    } else {
      return;
    }
  } catch (error) {
    throw new Error(` !Error at handler level! can't delete order: ${error}`);
  }
};

const showOrderByUser = async (
  req: express.Request,
  res: express.Response
): Promise<void> => {
  const valid_user_id: boolean = /^\d+$/.test(req.params.userid);
  if (!valid_user_id) {
    res.json('Only numbers are allowed in user id;');
    return;
  }
  const user_present = await checkUserIDPresentInDB(req.params.userid);
  if (!user_present) {
    res.json(`User ID: ${req.params.userid} is not found in database`);
    return;
  }
  try {
    const userID: string = req.params.userid as string;
    const result = await order_.showOrderByUser('users.id', userID);
    if (result) {
      res.json(result);
    } else if (result === null) {
      res.json(`No orders found database associated with user ${userID}`);
    }
  } catch (error) {
    throw new Error(
      ` !Error at handler level! can't show order by User: ${error}`
    );
  }
};

const showOrderByStatus = async (
  req: express.Request,
  res: express.Response
): Promise<void> => {
  try {
    const orderStatus: string = req.params.status as string;
    const result = await order_.showOrderByStatus('orders.status', orderStatus);
    if (result) {
      res.json(result);
    } else if (result === null) {
      res.json(`No ${req.params.status} orders found`);
    }
  } catch (error) {
    throw new Error(
      ` !Error at handler level! can't show order by User: ${error}`
    );
  }
};

const welcome = async (
  _req: express.Request,
  res: express.Response
): Promise<void> => {
  try {
    res.send('Welcome to the orders section');
  } catch (error) {
    throw new Error(`Can't welcome`);
  }
};

orders_routes.get('/index', authenticateUser, verifyToken, indexOrders);
orders_routes.get('/show/:orderid', authenticateUser, verifyToken, showOrder);
orders_routes.get(
  '/showorder-byuser/:userid',
  authenticateUser,
  verifyToken,
  showOrderByUser
);
orders_routes.get(
  '/showorder-bystatus/:status',
  authenticateUser,
  verifyToken,
  showOrderByStatus
);
orders_routes.get('/', welcome);

orders_routes.post('/create', authenticateUser, verifyToken, createOrder);
orders_routes.post('/addtocart', authenticateUser, verifyToken, addItem);

orders_routes.delete(
  '/deleteorder',
  authenticateUser,
  verifyToken,
  deleteOrder
);
orders_routes.delete(
  '/deletefromcart',
  authenticateUser,
  verifyToken,
  deleteFromCart
);

orders_routes.put('/update', authenticateUser, verifyToken, updateOrder);

export default orders_routes;

import { Product, products } from '../models/product';
import express from 'express';
import { verifyToken, authenticateUser, verifyUser } from './authentication';
import {
  checkColumnExits,
  checkProductInDB,
} from '../services/helperFunctions';

const prod = new products();
const products_routes = express.Router();

const indexProducts = async (
  req: express.Request,
  res: express.Response
): Promise<void> => {
  try {
    const products__ = await prod.index(); // reconsider putting await before the function
    res.json(products__);
  } catch (error) {
    throw new Error(` !Error at handler level! can't retriev data: ${error}`);
  }
};

const showProduct = async (
  req: express.Request,
  res: express.Response
): Promise<void> => {
  const valid_product_id: boolean = /^\d+$/.test(req.params.productid);
  if (!valid_product_id) {
    res.json('Only numbers are allowed in product id;');
    return;
  }
  const product_present = await checkProductInDB(req.params.productid);
  if (!product_present) {
    res.json(`Product ID: ${req.params.productid} is not found in database`);
    return;
  }
  try {
    const productID: string = req.params.productid as string;
    const result = await prod.show(productID);
    res.json(result);
  } catch (error) {
    throw new Error(` !Error at handler level! can't show product: ${error}`);
  }
};

const createProduct = async (
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
      res.json(`User ID: ${req.body.userid} is not found in database`);
      return;
    } else if (verification === true) {
      const newProduct: Product = {
        name: req.body.name as string,
        price: parseFloat(req.body.price as string),
        category: req.body.category as string,
      };
      const createdProduct = await prod.create(newProduct);
      if (createdProduct === null) {
        res.json(`Product ${newProduct.name} is already present.`);
        return;
      } else {
        res.json(`Created new product: ${newProduct.name}`);
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
    throw new Error(` !Error at handler level! can't create product: ${error}`);
  }
};

const deleteProduct = async (
  req: express.Request,
  res: express.Response
): Promise<void> => {
  const valid_product_id: boolean = /^\d+$/.test(req.body.productid);
  if (!valid_product_id) {
    res.json('Only numbers are allowed in product id;');
    return;
  }
  const product_present = await checkProductInDB(req.body.productid);
  if (!product_present) {
    res.json(`Product ID: ${req.body.productid} is not found in database`);
    return;
  }
  try {
    const verification = await verifyUser(req.body.username, '', 'admin');
    if (verification === null) {
      res.json(`User ID: ${req.body.userid} is not found in database`);
      return;
    } else if (verification === true) {
      const productID: string = req.body.productid as string;
      const result = await prod.delete(productID);
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
    throw new Error(` !Error at handler level! can't delete product: ${error}`);
  }
};

const updateProduct = async (
  req: express.Request,
  res: express.Response
): Promise<void> => {
  const valid_product_id: boolean = /^\d+$/.test(req.body.productid);
  if (!valid_product_id) {
    res.json('Only numbers are allowed in product id;');
    return;
  }
  const product_present = await checkProductInDB(req.body.productid);
  if (!product_present) {
    res.json(`Product ID: ${req.body.productid} is not found in database`);
    return;
  }
  if (!checkColumnExits('products', req.body.updatefield)) {
    res.json('Column does not exist in products table, check your parameters!');
    return;
  }
  try {
    const verification = await verifyUser(req.body.username, '', 'admin');
    if (verification === null) {
      res.json(`User ID: ${req.body.userid} is not found in database`);
      return;
    } else if (verification === true) {
      const productID: string = req.body.productid as string;
      const param: string = req.body.updatefield as string;
      const value: string = req.body.updatevalue as string;
      const updatedProduct = await prod.Update(param, productID, value);
      res.send(updatedProduct);
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
    throw new Error(` !Error at handler level! can't update order: ${error}`);
  }
};

const welcome = async (
  _req: express.Request,
  res: express.Response
): Promise<void> => {
  try {
    res.send('Welcome to the products section');
  } catch (error) {
    throw new Error(`Can't welcome`);
  }
};

products_routes.get('/index', indexProducts);
products_routes.get('/show/:productid', showProduct);
products_routes.get('/', welcome);

products_routes.post('/create', authenticateUser, verifyToken, createProduct);

products_routes.delete('/delete', authenticateUser, verifyToken, deleteProduct);

products_routes.put('/update', authenticateUser, verifyToken, updateProduct);

export default products_routes;

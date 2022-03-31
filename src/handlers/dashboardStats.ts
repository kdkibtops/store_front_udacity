import express from 'express';
import { DashBoardStats } from '../services/dashboard';
import { verifyToken, authenticateUser, verifyUser } from './authentication';

const dasboard_stats = new DashBoardStats();
const dashboard_routes = express.Router();

const topPopularProducts = async (
  req: express.Request,
  res: express.Response
): Promise<void> => {
  try {
    const products = await dasboard_stats.topPopularProducts(5);
    res.json(products);
  } catch (error) {
    res.json(`${error}`);
    throw new Error(`${error}`);
  }
};
const topProductsSales = async (
  req: express.Request,
  res: express.Response
): Promise<void> => {
  try {
    const products = await dasboard_stats.topProductsSales(5);
    res.json(products);
  } catch (error) {
    res.json(`${error}`);
    throw new Error(`${error}`);
  }
};
const leastPopularProducts = async (
  req: express.Request,
  res: express.Response
): Promise<void> => {
  try {
    const products = await dasboard_stats.leastPopularProducts(5);
    res.json(products);
  } catch (error) {
    res.json(`${error}`);
    throw new Error(`${error}`);
  }
};
const completedOrdersByUser = async (
  req: express.Request,
  res: express.Response
): Promise<void> => {
  try {
    const user_id: string = req.params.id_user;
    const orders = await dasboard_stats.completedOrdersByUser(user_id);
    if (orders.length === 0) {
      res.json(`No completed orders found for user ${user_id}`);
    } else {
      res.json(orders);
    }
  } catch (error) {
    res.json(`${error}`);
    throw new Error(`${error}`);
  }
};
const productsByCategories = async (
  req: express.Request,
  res: express.Response
): Promise<void> => {
  try {
    const category: string = req.params.category;
    const products = await dasboard_stats.productsByCategories(category);
    res.json(products);
  } catch (error) {
    res.json(`${error}`);
    throw new Error(`${error}`);
  }
};

const welcome = async (req: express.Request, res: express.Response) => {
  res.json(`Welcome to dashboard`);
};

dashboard_routes.get('/top_products_sales', topProductsSales);
dashboard_routes.get('/bottom_products', leastPopularProducts);
dashboard_routes.get('/top_products', topPopularProducts);
dashboard_routes.get('/products_by_category/:category', productsByCategories);
dashboard_routes.get(
  '/completedordersbyuser/:id_user',
  authenticateUser,
  verifyToken,
  completedOrdersByUser
);
dashboard_routes.get('/', welcome);

export default dashboard_routes;

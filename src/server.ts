import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import users_routes from './handlers/user_handler';
import products_routes from './handlers/product_handler';
import orders_routes from './handlers/order_handler';
import dashboard_routes from './handlers/dashboardStats';

const app: express.Application = express();
const address = 'localhost:3000';

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cors());

app.get('/', function (req: Request, res: Response) {
  res.send('Welcome to the store front app');
});

app.listen(3000, function () {
  console.log(`Server ready: app listening on: ${address}`);
});

app.use('/users', users_routes);
app.use('/products', products_routes);
app.use('/orders', orders_routes);
app.use('/dashboard', dashboard_routes);

export default app;

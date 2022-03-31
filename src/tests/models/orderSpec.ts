import { Order, orders } from '../../models/order';
import { Product, products } from '../../models/product';
import { User, users } from '../../models/user';
import { CartItem } from '../../services/dashboard';
import {
  getCertainDataFromCarts,
  getCertainDataFromOrders,
  getCertainDataFromProducts,
  getCertainDataFromUser,
} from '../../services/helperFunctions';
const testOrder = new orders();
const testProd = new products();
const testUser = new users();

describe('Order model testing', () => {
  it('Should have index method', () => {
    expect(testOrder.index).toBeDefined();
  });
  it('Should have show method', () => {
    expect(testOrder.show).toBeDefined();
  });
  it('Should have create method', () => {
    expect(testOrder.create).toBeDefined();
  });
  it('Should have update method', () => {
    expect(testOrder.Update).toBeDefined();
  });
  it('Should have delete method', () => {
    expect(testOrder.delete).toBeDefined();
  });
  it('Should have add to cart method', () => {
    expect(testOrder.addToCart).toBeDefined();
  });
  it('Should have delete from cart method', async () => {
    expect(testOrder.deleteFromCart).toBeDefined();
  });
  it('Should have showOrder by user method', async () => {
    expect(testOrder.showOrderByUser).toBeDefined();
  });
  it('Should have showOrder by status method', async () => {
    expect(testOrder.showOrderByStatus).toBeTruthy();
  });
});

describe('Order functions return values', () => {
  it('Index method should return array', async () => {
    expect(await testOrder.index()).toBeTruthy();
  });

  it('Create method should retrun string with the created order ID', async () => {
    const prod: Product = { name: 'Apple', price: 1, category: 'fruits' };
    const user: User = {
      user_name: 'product',
      first_name: 'test',
      last_name: 'test',
      password: 'password',
      role: 'product',
    };
    await testUser.create(user);
    await testProd.create(prod);
    const prod_id = await getCertainDataFromProducts('name', 'Apple', 'id');
    const user_id = await getCertainDataFromUser('user_name', 'product', 'id');
    const newOrder: Order = {
      id_product: prod_id,
      id_user: user_id,
      quantity: 1,
      status: 'test',
    };

    const result = await testOrder.create(newOrder);
    const ordID = await getCertainDataFromOrders('status', 'test', 'id');
    expect(result).toEqual(`New order created, order id: ${ordID}`);
  });

  it('add to cart should return true', async () => {
    const ordID = await getCertainDataFromOrders('status', 'test', 'id');
    const prod_id = await getCertainDataFromProducts('name', 'Apple', 'id');
    const newCArt: CartItem = {
      id_order: ordID,
      id_product: prod_id,
      quantity: 1,
    };
    const result = await testOrder.addToCart(newCArt);
    expect(result).toBeTrue();
  });

  it('Show method should return array of cart_item objects in this order', async () => {
    const ordID = await getCertainDataFromOrders('status', 'test', 'id');
    const result = (await testOrder.show(ordID)) as Order[];
    expect(result[0].status).toEqual('test');
  });

  it('Update method should return string with order id if successful', async () => {
    const ordID = await getCertainDataFromOrders('status', 'test', 'id');
    const result = await testOrder.Update('status', ordID, 'test');
    expect(result).toEqual(`Order with id:${ordID} is updated successfuly`);
  });

  it('Order by user Returns array of orders by this user', async () => {
    const userID = await getCertainDataFromUser('user_name', 'product', 'id');
    const result = (await testOrder.showOrderByUser(
      'users.id',
      userID
    )) as Order[];
    expect(result[0].status).toBe('test');
  });

  it('order by status should return array of orders', async () => {
    expect(testOrder.showOrderByStatus('orders.status', 'test')).toBeDefined();
  });

  it('Delete from cart retruns a confirmations string with deleted id', async () => {
    const cartID = await getCertainDataFromCarts('quantity', '1', 'id');
    const ordID = await getCertainDataFromOrders('status', 'test', 'id');
    const result = await testOrder.deleteFromCart(cartID, ordID);
    expect(result).toEqual(`Item(s) in cart with id:${cartID} are deleted `);
  });

  it('Delete order retruns a confirmations string with deleted order id', async () => {
    const ordID = await getCertainDataFromOrders('status', 'test', 'id');
    expect(await testOrder.delete(ordID)).toEqual(
      `Order with id:${ordID} is deleted `
    );
  });
});

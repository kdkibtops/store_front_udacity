import {
  getCertainDataFromProducts,
  getCertainDataFromUser,
} from '../../services/helperFunctions';
import { Product, products } from '../../models/product';

const testProduct = new products();

describe('Products model testing', () => {
  it('Should have an index method', () => {
    expect(testProduct.index).toBeDefined();
  });
  it('Should have an show method', () => {
    expect(testProduct.show).toBeDefined();
  });
  it('Should have an create method', () => {
    expect(testProduct.create).toBeDefined();
  });
  it('Should have an update method', () => {
    expect(testProduct.Update).toBeDefined();
  });
  it('Should have an delete method', () => {
    expect(testProduct.delete).toBeDefined();
  });
});

describe('Products model testing : Functions return values', () => {
  it('Index method should retrun an empty array of products', async () => {
    expect(await testProduct.index()).toBeTruthy();
  });

  it('Create method should return Product object', async () => {
    const newProduct = {
      name: 'testProduct',
      price: 1,
      category: 'testProduct',
    };
    const result = await testProduct.create(newProduct);
    expect(result).toEqual(newProduct);
  });

  it('Show method should return product object with given id', async () => {
    const prdID = await getCertainDataFromProducts('name', 'testProduct', 'id');
    const expectedPro = {
      id: prdID,
      name: 'testProduct',
      price: '1',
      category: 'testProduct',
      total_ordered: null,
      sales: null,
    };
    const result = await testProduct.show(prdID);
    expect(result).toEqual(expectedPro);
  });

  it('Update method should return string with given id', async () => {
    const prdID = await getCertainDataFromProducts('name', 'testProduct', 'id');
    const result = await testProduct.Update('name', prdID, 'testProduct');
    expect(result).toEqual(`Product with id:${prdID} is updated `);
  });

  it('Delete method should return string with given id', async () => {
    const prdID = await getCertainDataFromProducts('name', 'testProduct', 'id');
    const result = await testProduct.delete(prdID);
    expect(result).toEqual(`Product with id:${prdID} is deleted `);
  });
});

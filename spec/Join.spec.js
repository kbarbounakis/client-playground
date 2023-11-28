import { QueryExpression, SqlFormatter, QueryEntity } from "@themost/query";
import Table from 'easy-table';
import { TestDatabase } from '../db.js';

describe('SQL', () => {

  /** 
  * @type {TestDatabase}
  */
  let db;
  beforeAll(() => {
    db = new TestDatabase();
  });

  afterAll(async () => {
    await db.closeAsync();
  })

  it('should use join', async () => {
    const Products = new QueryEntity('OrderData');
    const Customers = new QueryEntity('PersonData').as('customer');
    const OrderedItems = new QueryEntity('ProductData').as('orderedItem');
    const q = new QueryExpression().select((x) => {
      const customerDescription = x.customer.description;
      const productName = x.orderedItem.name;
      const id = x.id;
      return {
        id,
        customerDescription,
        productName
      }
    }).from(Products).join(Customers).with((x, y) => {
      return x.customer === y.id;
    }).join(OrderedItems).with((x, y) => {
      return x.orderedItem === y.id;
    }).take(25);

    console.log(new SqlFormatter().format(q));
    const data = await db.executeAsync(q);
    console.log(Table.print(data));
  });
});
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

  it('should use then by', async () => {
    const Orders = new QueryEntity('OrderData');
    const Customers = new QueryEntity('PersonData').as('customer');
    const Products = new QueryEntity('ProductData').as('orderedItem');
    const q = new QueryExpression().select((x) => {
      return {
        id: x.id,
        product: x.orderedItem.name,
        price: x.orderedItem.price,
        customerFamilyName: x.customer.familyName,
        customerGivenName: x.customer.givenName,
        orderDate: x.orderDate
      }
    }).from(Orders)
      .join(Customers).with((x, y) => {
        return x.customer === y.id;
      })
      .join(Products).with((x, y) => {
        return x.orderedItem === y.id;
      })
      .orderByDescending((x) => x.orderedItem.price)
      .thenBy((x) => x.customer.familyName)
      .thenBy((x) => x.customer.givenName)
      .take(10);

    console.log(new SqlFormatter().format(q));
    const data = await db.executeAsync(q);
    console.log(Table.print(data));
  });
});
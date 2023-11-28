
import { QueryExpression, SqlFormatter, QueryEntity, sum } from "@themost/query";
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

  it('should use sum', async () => {

    const Orders = new QueryEntity('OrderData');
    const Products = new QueryEntity('ProductData').as('orderedItem');
    let q = new QueryExpression()
      .select((x) => {
        return {
          total: round(sum(x.orderedItem.price),2)
        }
      })
      .from(Orders)
      .join(Products).with((x, y) => {
        return x.orderedItem === y.id;
      })
      .where((x) => {
        return x.orderedItem.category === 'Laptops';
      })
      .take(1);

    console.log(new SqlFormatter().format(q));
    const data = await db.executeAsync(q);
    console.log(Table.print(data));
  });
});
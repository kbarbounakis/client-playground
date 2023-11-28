import { QueryExpression, SqlFormatter, QueryEntity, min } from "@themost/query";
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

  it('should use min', async () => {
    const Products = new QueryEntity('ProductData');
    const q = new QueryExpression().select((x) => {
      return {
        name: x.name,
        price: min(x.price)
      }
    }).from(Products)
      .where((x) => {
        return x.category === 'Laptops';
      });

    console.log(new SqlFormatter().format(q));
    const data = await db.executeAsync(q);
    console.log(Table.print(data));
  });
});
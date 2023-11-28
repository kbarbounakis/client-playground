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

  it('should use limit', async () => {
    const Products = new QueryEntity('ProductData');
    const q = new QueryExpression().select(({ id, name, category, model, price }) => ({
      id,
      name,
      category,
      model,
      price
    })).from(Products)
      .orderBy((x) => x.price).take(10);

    console.log(new SqlFormatter().format(q));
    let data = await db.executeAsync(q);
    console.log(Table.print(data));

    q.take(10).skip(10);

    console.log(new SqlFormatter().format(q));
    data = await db.executeAsync(q);
    console.log(Table.print(data));

  });
});
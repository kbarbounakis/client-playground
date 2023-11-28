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

  it('should use params', async () => {
    const Products = new QueryEntity('ProductData');
    const q = new QueryExpression().select(({ id, name, category, model, price }) => ({
      id,
      name,
      category,
      model,
      price
    })).from(Products)
      .where((x, price) => {
        return x.price > price;
      }, {
        price: 500
      }).take(10);

    console.log(new SqlFormatter().format(q));
    const data = await db.executeAsync(q);
    console.log(Table.print(data));
  });
})
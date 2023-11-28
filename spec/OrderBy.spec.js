
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

  it('should use order by', async () => {
    const Orders = new QueryEntity('OrderData');
    const Customers = new QueryEntity('PersonData').as('customer');
    const q = new QueryExpression().select((x) => {
      return {
        id: x.id,
        orderDate: x.orderDate,
        customer: x.customer.description
      }
    }).from(Orders)
      .join(Customers).with((x, y) => {
        return x.customer === y.id;
      })
      .orderBy((x) => x.orderDate).take(10);

    console.log(new SqlFormatter().format(q));
    const data = await db.executeAsync(q);
    console.log(Table.print(data));
  });
});
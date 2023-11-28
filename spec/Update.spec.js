import {
  QueryExpression,
  SqlFormatter,
  QueryEntity,
  avg,
} from "@themost/query";
import Table from "easy-table";
import { TestDatabase, TestUtils } from "../db.js";

describe("SQL", () => {
  /**
   * @type {TestDatabase}
   */
  let db;
  beforeAll(() => {
    db = new TestDatabase();
  });

  afterAll(async () => {
    await db.closeAsync();
  });

  it("should use update", async () => {
    const Products = new QueryEntity("ProductData");
    const q = new QueryExpression()
      .select(({ id, name, model, price }) => ({
        id,
        name,
        price,
        model,
      }))
      .from(Products)
      .where((x) => {
        return x.name === "Lenovo Yoga 2 Pro";
      });
    console.log(new SqlFormatter().format(q));
    const data = await db.executeAsync(q);
    console.log(Table.print(data));

    const product = data[0];

    // IMPORTANT NOTE
    // Product model follows table inheritance architecture and is being represented by 2 different records.
    // The first record exists at ThingBase(id, name, description, dateCreated, dateModified, ...) table
    // and the other one at ProductBase(id, model, price, ...) table where ThingBase.id = ProductBase.id
    // Read more about structured database models at MOST Framework ORM module
    // https://github.com/themost-framework/data
    // and don't forget to checkout the sample sqlite database for more information
    // https://github.com/themost-framework/test/tree/master/modules/test/server/db

    const Product = new QueryEntity("ProductBase");
    await TestUtils.executeInTestTransaction(db, async () => {
      // delete record at ProductBase table
      let q1 = new QueryExpression()
        .update(Product)
        .set({
          price: product.price * 0.75,
        })
        .where(
          (x, value) => {
            return x.id === value;
          },
          {
            value: product.id,
          },
        );
      console.log(new SqlFormatter().format(q1));
      await db.executeAsync(q1);

      const data = await db.executeAsync(q);
      console.log(Table.print(data));
    });
  });
});

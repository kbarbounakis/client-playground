import {
  QueryExpression,
  SqlFormatter,
  QueryEntity,
  sum,
} from "@themost/query";
import Table from "easy-table";
import { TestDatabase } from "../db.js";
import path from "path";

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

  it("should use startsWith", async () => {
    const People = new QueryEntity("PersonData");
    const q = new QueryExpression()
      .select((x) => {
        x.id, x.familyName, x.givenName, x.email, x.dateCreated;
      })
      .from(People)
      .where((x) => {
        return x.familyName.startsWith("Cam") === true;
      });

    console.log(new SqlFormatter().format(q));
    const data = await db.executeAsync(q);
    console.log(Table.print(data));
  });
});

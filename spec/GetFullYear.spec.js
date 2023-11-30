import Table from "easy-table";
import { TestApplication } from "../TestApplication.js";

describe("Request", () => {
  /**
   * @type {TestApplication}
   */
  let app;
  beforeAll(async () => {
    app = new TestApplication();
  });
  afterAll(async () => {
    //
  });

  it("should use getFullYear", async () => {
    const context = await app.createContext();
    const q = context
      .model("Orders")
      .select((x) => {
        return {
          year: x.orderDate.getFullYear(),
          total: round(sum(x.orderedItem.price), 2),
        };
      })
      .groupBy((x) => x.orderDate.getFullYear());

    console.log(q.toString());
    const data = await q.getItems();
    console.log(Table.print(data));
  });
});

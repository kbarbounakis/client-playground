import Table from "easy-table";
import { TestApplication } from "../TestApplication.js";

describe("Request", () => {
  /**
   * @type {TestApplication}
   */
  let app;
  beforeAll(async () => {
    app = new TestApplication();
    await app.start();
  });
  afterAll(async () => {
    // close
    if (app.server) {
      await app.stop();
    }
  });

  it("should use getMonth", async () => {
    const context = await app.createContext();
    const q = context
      .model("Orders")
      .select((x) => {
        return {
          year: x.orderDate.getFullYear(),
          month: x.orderDate.getMonth(),
          total: round(sum(x.orderedItem.price), 2),
        };
      })
      .where((x) => x.orderDate.getFullYear() === 2019)
      .groupBy(
        (x) => x.orderDate.getFullYear(),
        (x) => x.orderDate.getMonth(),
      );

    console.log(q.toString());
    const data = await q.getItems();
    console.log(Table.print(data));
  });
});

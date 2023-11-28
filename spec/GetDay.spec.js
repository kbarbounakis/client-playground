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

  it("should use getDate", async () => {
    const context = await app.createContext();
    const q = context
      .model("Orders")
      .select((x) => {
        return {
          month: x.orderDate.getMonth(),
          dayOfMonth: x.orderDate.getDate(),
          total: round(sum(x.orderedItem.price), 2),
        };
      })
      .where((x) => {
        return (
          x.orderDate.getFullYear() === 2019 && x.orderDate.getMonth() === 1
        );
      })
      .groupBy(
        (x) => x.orderDate.getMonth(),
        (x) => x.orderDate.getDate(),
      );

    console.log(q.toString());
    const data = await q.getItems();
    console.log(Table.print(data));
  });
});

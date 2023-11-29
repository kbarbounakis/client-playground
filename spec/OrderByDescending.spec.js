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

  it("should use order by descending", async () => {
    const context = await app.createContext();
    const q = context
      .model("Orders")
      .select((x) => {
        return {
          id: x.id,
          orderDate: x.orderDate,
          customer: x.customer.description,
        };
      })
      .orderByDescending((x) => x.orderDate)
      .take(10);

    console.log(q.toString());
    const data = await q.getItems();
    console.log(Table.print(data));
  });
});

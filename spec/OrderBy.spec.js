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

  it("should use order by", async () => {
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
      .orderBy((x) => x.orderDate)
      .take(10);
    console.log(q.toString());
    const data = await q.getItems();
    console.log(Table.print(data));
  });
});

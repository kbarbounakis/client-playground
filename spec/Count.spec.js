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
  
  it("should use count", async () => {
    const context = await app.createContext();
    const q = context
      .model("Orders")
      .select((x) => {
        const name = x.orderStatus.alternateName;
        const total = count(x.id);
        return {
          name,
          total,
        };
      })
      .where((x) => x.orderedItem.category === "Laptops")
      .groupBy((x) => x.orderStatus.alternateName);

    console.log(q.toString());
    const data = await q.getItems();
    console.log(Table.print(data));
  });
});

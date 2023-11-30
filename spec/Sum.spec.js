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

  it("should use sum", async () => {
    const context = await app.createContext();
    const q = context
      .model("Orders")
      .select((x) => {
        return {
          total: round(sum(x.orderedItem.price), 2),
        };
      })
      .where((x) => {
        return x.orderedItem.category === "Laptops";
      })
      .take(1);

    console.log(q.toString());
    const data = await q.getItems();
    console.log(Table.print(data));
  });
});

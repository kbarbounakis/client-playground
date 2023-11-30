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

  it("should use average", async () => {
    const context = await app.createContext();
    const q = context
      .model("Products")
      .select((x) => {
        return {
          category: x.category,
          price: round(avg(x.price), 2),
        };
      })
      .groupBy((x) => x.category);

    console.log(q.toString());
    const data = await q.getItems();
    console.log(Table.print(data));
  });
});

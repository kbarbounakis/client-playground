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

  it("should use indexOf", async () => {
    const context = await app.createContext();
    const q = context
      .model("Products")
      .select(({ id, name, category, model, price }) => ({
        id,
        name,
        category,
        model,
        price,
      }))
      .where((x) => {
        return x.name.indexOf("Apple") >= 0;
      });

    console.log(q.toString());
    const data = await q.getItems();
    console.log(Table.print(data));
  });
});

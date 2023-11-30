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

  it("should use and", async () => {
    const context = await app.createContext();
    /**
     * @type {import('@themost/client').ClientDataQueryable}
     */
    const query = context
      .model("Products")
      .asQueryable()
      .select(({ id, name, category, model, price }) => ({
        id,
        name,
        category,
        model,
        price,
      }))
      .where((x) => {
        return x.price > 500 && x.category === "Laptops";
      })
      .orderByDescending((x) => x.price)
      .take(10);
    console.log(query.toString());
    const data = await query.getItems();
    console.log(Table.print(data));
  });
});

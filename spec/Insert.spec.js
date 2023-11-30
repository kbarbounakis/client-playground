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

  it("should use insert", async () => {
    const context = await app.createContext();
    const product = {
      name: "Acer New Gaming Laptop 17",
      model: "AC1705",
      price: 989.5,
      releaseDate: new Date(),
    };
    await context.model("Products").save(product);

    const q = context
      .model("Products")
      .asQueryable()
      .select(({ id, name, model, price }) => ({
        id,
        name,
        model,
        price,
      }))
      .where((x) => {
        return x.model === "AC1705";
      });
    console.log(q.toString());
    const data = await q.getItems();
    console.log(Table.print(data));
  });
});

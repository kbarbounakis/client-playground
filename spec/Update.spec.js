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

  it("should use update", async () => {
    const context = await app.createContext();
    const q = context
      .model("Products")
      .select(({ id, name, model, price }) => ({
        id,
        name,
        price,
        model,
      }))
      .where((x) => {
        return x.name === "Lenovo Yoga 2 Pro";
      });
    console.log(q.toString());
    const data = await q.getItems();
    console.log(Table.print(data));

    const product = data[0];
    const newPrice = product.price * 0.75;
    product.price = newPrice;
    await context.model("Products").save(product);

    const q2 = context
      .model("Products")
      .select(({ id, name, model, price }) => ({
        id,
        name,
        price,
        model,
      }))
      .where((x) => {
        return x.name === "Lenovo Yoga 2 Pro";
      });
    console.log(q2.toString());
    const item = await q2.getItem();
    expect(item.price).toEqual(newPrice);
    console.log(Table.print(item));
  });
});

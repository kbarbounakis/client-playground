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

  it('should use limit', async () => {
    const context = await app.createContext();
    const q = context.model('Products').select(({ id, name, category, model, price }) => ({
      id,
      name,
      category,
      model,
      price
    })).orderBy((x) => x.price).take(10);

    console.log(q.toString());
    const data = await q.getItems();
    console.log(Table.print(data));

  });
});
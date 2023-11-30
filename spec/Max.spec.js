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

  it('should use max', async () => {
    const context = await app.createContext();
    const q = context.model('Products').select((x) => {
      return {
        name: x.name,
        price: max(x.price)
      }
    }).where((x) => {
        return x.category === 'Desktops';
      });
      console.log(q.toString());
      const data = await q.getItems();
      console.log(Table.print(data));
  });
});
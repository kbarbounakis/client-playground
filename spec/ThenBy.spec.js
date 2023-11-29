import Table from "easy-table";
import { TestApplication } from "../TestApplication.js";

describe("Request", () => {
  /**
   * @type {TestApplication}
   */
  let app;
  beforeAll(async () => {
    app = new TestApplication();
    await app.start();
  });
  afterAll(async () => {
    // close
    if (app.server) {
      await app.stop();
    }
  });

  it("should use then by", async () => {
    const context = await app.createContext();
    const q = context
      .model("Orders")
      .select((x) => {
        return {
          id: x.id,
          product: x.orderedItem.name,
          price: x.orderedItem.price,
          customerFamilyName: x.customer.familyName,
          customerGivenName: x.customer.givenName,
          orderDate: x.orderDate,
        };
      })
      .orderByDescending((x) => x.orderedItem.price)
      .thenBy((x) => x.customer.familyName)
      .thenBy((x) => x.customer.givenName)
      .take(10);

    console.log(q.toString());
    const data = await q.getItems();
    console.log(Table.print(data));
  });
});

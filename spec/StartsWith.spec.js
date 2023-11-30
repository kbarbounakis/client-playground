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

  it("should use startsWith", async () => {
    const context = await app.createContext();
    const q = context
      .model("People")
      .select((x) => {
        x.id, x.familyName, x.givenName, x.email, x.dateCreated;
      })
      .where((x) => {
        return x.familyName.startsWith("Cam") === true;
      });

    console.log(q.toString());
    const data = await q.getItems();
    console.log(Table.print(data));
  });
});

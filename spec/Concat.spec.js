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

  it("should use concat", async () => {
    const context = await app.createContext();
    const q = context
      .model("People")
      .select((x) => {
        return {
          id: x.id,
          familyName: x.familyName,
          givenName: x.givenName,
          name: x.givenName.concat(" ", x.familyName),
        };
      })
      .where((x) => {
        return x.givenName.indexOf("Chri") >= 0;
      });

    console.log(q.toString());
    const data = await q.getItems();
    console.log(Table.print(data));
  });
});

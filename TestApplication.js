import {
  getApplication,
  serveApplication,
  getServerAddress,
  getToken,
} from "@themost/test";
import { NodeDataContext } from "@themost/node";
/**
 * TestApplication starts the test api server provided by @themost/test
 */
class TestApplication {
  /**
   * @type {import('http').Server}
   */
  server;
  /**
   * @type {string}
   * @returns {Promise<TestApplication>}
   */
  server_uri;
  async start() {
    if (this.server != null) {
      return this;
    }
    // create api server
    const app = getApplication();
    // serve
    this.server = await serveApplication(app, 8000);
    // get server_uri for further processing
    this.server_uri = getServerAddress(this.server);
    return this;
  }

  async stop() {
    if (this.server) {
      this.server.close();
    }
    return this;
  }

  /**
   * Create a test context
   * @returns {Promise<import('@themost/client').ClientDataContext>}
   */
  async createContext() {
    return this.createContextFor("alexis.rees@example.com", "secret");
  }

  /**
   * @returns {Promise<import('@themost/client').ClientDataContext>}
   */
  async createContextFor(username, password) {
    const { access_token } = await getToken(
      this.server_uri,
      username,
      password,
    );
    const context = new NodeDataContext(new URL("api", this.server_uri), {
      useResponseConversion: true,
    });
    // set bearer authorization
    context.setBearerAuthorization(access_token);
    return context;
  }
}

export { TestApplication };

import { SqliteAdapter } from "@themost/sqlite";
import path from "path";
import os from "os";

class TestDatabase extends SqliteAdapter {
  constructor() {
    // read more about sample database here
    // https://github.com/themost-framework/test/tree/master/modules/test/server/db
    super({
      database: path.resolve("node_modules/@themost/test/server/db/local.db"),
    });
  }

  open(callback) {
    // override SqliteAdapter.open() method to check the support of REGEXP function which is not available in all dev environments
    void super.open((err) => {
      if (err) {
        return callback(err);
      }
      if (os.platform() !== "linux") {
        return callback();
      }
      // an important workaround: load REGEXP function
      // try regexp support
      void this.execute("SELECT ('Hello' REGEXP '^H') = true", null, (err) => {
        if (err) {
          // load regexp lib
          return this.rawConnection.loadExtension(
            path.resolve(
              process.cwd(),
              "node_modules/@themost/sqlite/regexp.0.dylib",
            ),
            (err) => {
              if (err) {
                // an error occurred while loading extension
                return callback(err);
              }
              // extension has been loaded
              return callback();
            },
          );
        }
        // regexp is supported
        // exit without doing nothing
        return callback();
      });
    });
  }
}

class CancelTransactionError extends Error {
  constructor() {
    super();
  }
}

class TestUtils {
  /**
   * Wraps DataAdapter.executeInTransaction() for using in testing environments
   * @param {TestDatabase} db
   * @param {Function} func
   * @returns {Promise<any>}
   */
  static executeInTestTransaction(db, func) {
    return new Promise((resolve, reject) => {
      // start transaction
      db.executeInTransaction(
        (cb) => {
          try {
            func()
              .then(() => {
                return cb(new CancelTransactionError());
              })
              .catch((err) => {
                return cb(err);
              });
          } catch (err) {
            return cb(err);
          }
        },
        (err) => {
          // if error is an instance of CancelTransactionError
          if (err && err instanceof CancelTransactionError) {
            return resolve();
          }
          if (err) {
            return reject(err);
          }
          // exit
          return resolve();
        },
      );
    });
  }

  static cancelTransaction() {
    throw new CancelTransactionError();
  }
}

export { TestDatabase, TestUtils };

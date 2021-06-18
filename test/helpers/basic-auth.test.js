const bootstrap = require("../bootstrap");
const username = "YOUR_USER_NAME";
const password = "YOUR_PASSWORD";
const notpassword = "YOUR_PASSWORDRD";

describe("Testing Helpers - basicAuth works when ", () => {
  test("use correct username & password", () => {
    return bootstrap(
      "/helpers/basic-auth",
      `
      app.use("/helpers/basic-auth", basicAuth())
      app.use("/helpers/basic-auth", event => {
        return new Response("Bypassed basicAuth");
      })
    `,
      {
        method: "GET",
        headers: {
          Authorization:
            "Basic " +
            Buffer.from(username + ":" + password).toString("base64"),
        },
      }
    ).then(async (res) => {
      expect(res.status).toBe(200);
    });
  });
  test("use incorrect username & password", () => {
    return bootstrap(
      "/helpers/basic-not-auth",
      `
      app.use("/helpers/basic-not-auth", basicAuth())
      app.use("/helpers/basic-not-auth", event => {
        return new Response("Bypassed basicAuth");
      })
    `,
      {
        method: "GET",
        headers: {
          Authorization:
            "Basic " +
            Buffer.from(username + ":" + notpassword).toString("base64"),
        },
      }
    ).then(async (res) => {
      expect(res.status).toBe(401);
    });
  });
  test("use wildcard", () => {
    return bootstrap(
      "/helpers/basic-not-auth/a/b/c",
      `
      app.use("/helpers/basic-not-auth/(.*)", basicAuth())
      app.use("/helpers/basic-not-auth/a/b/c", event => {
        return new Response("Bypassed basicAuth");
      })
    `,
      {
        method: "GET",
        headers: {
          Authorization:
            "Basic " +
            Buffer.from(username + ":" + notpassword).toString("base64"),
        },
      }
    ).then(async (res) => {
      expect(res.status).toBe(401);
    });
  });
});

const bootstrap = require("../bootstrap");

describe("Testing Helpers - cors works when ", () => {
  test("request method is 'OPTIONS' which should be bypass", () => {
    return bootstrap(
      "/helpers/cors/test-option",
      `
      app.use(cors())
    `,
      { method: "OPTIONS" }
    ).then((res) => {
      expect(res.status).toBe(204);
    });
  });
  test("request method is 'OPTIONS' with custom headers", () => {
    return bootstrap(
      "/helpers/cors/test-option",
      `
      app.use(cors({'allowedHeaders': 'Test-Header'}))
    `,
      {
        method: "OPTIONS",
        headers: {
          "Test-Header": "this-is-a-test-header",
        },
      }
    ).then((res) => {
      expect(res.headers.get("Access-Control-Allow-Headers")).toBe(
        "Test-Header"
      );
    });
  });
});

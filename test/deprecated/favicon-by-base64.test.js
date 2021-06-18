const bootstrap = require("../bootstrap");

describe("Testing Deprecated - faviconByBase64 works when ", () => {
  test("use 'ignored'", () => {
    return bootstrap(
      "/favicon.ico",
      `
      app.use(faviconByBase64("ignored"));
    `
    ).then((res) => {
      expect(res.status).toBe(204);
    });
  });
});

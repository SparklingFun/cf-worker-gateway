const bootstrap = require("../bootstrap");

describe("Testing Middleware - rewrite works when ", () => {
  test("rewrite to other path", () => {
    return bootstrap(
      "/middleware/rewrite/origin",
      `
      app.use("/middleware/rewrite/origin", rewrite("/middleware/rewrite/other"));
    `
    ).then(async (res) => {
      const body = await res.text();
      expect(body.indexOf("/middleware/rewrite/other") > -1).toBe(true);
    });
  });
  test("rewrite to other domain", () => {
    return bootstrap(
      "/middleware/rewrite/origin",
      `
      app.use("/middleware/rewrite/origin", rewrite("https://github.com/"));
    `
    ).then(async (res) => {
      const body = await res.text();
      // Last middleware in bootstrap will return request url.
      expect(body).toBe("https://github.com/");
    });
  });
  // TODO: Multi times rewrite is not supported in current version.
  // test("multi times rewrite", () => {
  //   return bootstrap("/middleware/rewrite/origin", `
  //     app.use("/middleware/rewrite/origin", rewrite("/middleware/rewrite/a"));
  //     app.use("/middleware/rewrite/a", rewrite("https://github.com/"));
  //   `).then(async res => {
  //     const body = await res.text();
  //     // Last middleware in bootstrap will return request url.
  //     expect(body).toBe("https://github.com/");
  //   })
  // })
  test("matched path with `path-to-regexp`", () => {
    return bootstrap(
      "/middleware/rewrite/origin",
      `
      app.use("/middleware/rewrite/:oldpath", rewrite("/middleware/rewrited/hello"));
      app.use(event => {
        return new Response(event.match ? event.match.params.oldpath : "No match");
      })
    `
    ).then(async (res) => {
      const body = await res.text();
      // Last middleware in bootstrap will return request url.
      expect(body).toBe("origin");
    });
  });
});

const bootstrap = require("../bootstrap");
describe("Testing Middleware - redirect works when ", () => {
  test("redirect to other path", () => {
    return bootstrap(
      "/middleware/redirect/path",
      `
      app.use("/middleware/redirect/path", redirect("/middleware/redirect/other-path"));
    `
    ).then(async (res) => {
      expect(
        res.headers.get("Location").indexOf("/middleware/redirect/other-path") >
          -1
      ).toBe(true);
    });
  });
  test("redirect to other domain", () => {
    return bootstrap(
      "/middleware/redirect/domain",
      `
      app.use("/middleware/redirect/domain", redirect("https://github.com/"));
    `
    ).then(async (res) => {
      expect(res.headers.get("Location")).toBe("https://github.com/");
    });
  });
  test("redirect use permant mode", () => {
    return bootstrap(
      "/middleware/redirect/permant",
      `
      app.use("/middleware/redirect/permant", redirect("/middleware/redirect/permant-status", true));
    `
    ).then(async (res) => {
      expect(res.status).toBe(308);
    });
  });
  test("redirect use custom status", () => {
    return bootstrap(
      "/middleware/redirect/custom-status",
      `
      app.use("/middleware/redirect/custom-status", redirect("/middleware/redirect/custom-status-after", 302));
    `
    ).then(async (res) => {
      expect(res.status).toBe(302);
    });
  });
});

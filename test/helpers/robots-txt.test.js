const bootstrap = require("../bootstrap");

describe("Testing Helpers - robotsTxt works when ", () => {
  test("robotsHandler return all allow", () => {
    return bootstrap(
      "/robots.txt",
      `
      app.use("/robots.txt", robotsTxt({
        rules: [
            {
                userAgent: "*",
                allow: ["/"]
            }
        ]
      }))
    `
    ).then(async (res) => {
      let body = await res.text();
      expect(body).toBe(`User-agent: *
Allow: /`);
    });
  });
  test("robotsHandler return all disallow", () => {
    return bootstrap(
      "/robots.txt",
      `
      app.use("/robots.txt", robotsTxt({
        rules: [
            {
                userAgent: "*",
                disallow: ["/"]
            }
        ]
      }))
    `
    ).then(async (res) => {
      let body = await res.text();
      expect(body).toBe(`User-agent: *
Disallow: /`);
    });
  });
  test("robotsHandler return allow & disallow both", () => {
    return bootstrap(
      "/robots.txt",
      `
    app.use("/robots.txt", robotsTxt({
      rules: [
        {
            userAgent: "*",
            allow: ["/welcome", "/hello-world"],
            disallow: ["/"]
        }
    ]
    }))
    `
    ).then(async (res) => {
      let resText = await res.text();
      expect(resText).toBe(`User-agent: *
Allow: /welcome
Allow: /hello-world
Disallow: /`);
    });
  });
  test("robotsHandler multi User-agent", () => {
    return bootstrap(
      "/robots.txt",
      `
    app.use("/robots.txt", robotsTxt({
      rules: [
        {
            userAgent: "GoogleBot",
            disallow: ["/"]
        },
        {
            userAgent: "Bingbot",
            disallow: ["/google-only"]
        }
    ]
    }))
    `
    ).then(async (res) => {
      let resText = await res.text();
      expect(resText).toBe(`User-agent: GoogleBot
Disallow: /
User-agent: Bingbot
Disallow: /google-only`);
    });
  });
  test("robotsHandler multi User-agent with sitemap", () => {
    return bootstrap(
      "/robots.txt",
      `
    app.use("/robots.txt", robotsTxt({
      rules: [
        {
            userAgent: "GoogleBot",
            disallow: ["/"]
        },
        {
            userAgent: "Bingbot",
            disallow: ["/google-only"]
        }
    ],
    sitemapUrl: ["https://localhost/sitemap.xml"]
    }))
    `
    ).then(async (res) => {
      let resText = await res.text();
      expect(resText).toBe(`User-agent: GoogleBot
Disallow: /
User-agent: Bingbot
Disallow: /google-only

Sitemap: https://localhost/sitemap.xml`);
    });
  });
});

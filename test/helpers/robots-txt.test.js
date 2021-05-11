const bootstrap = require("../bootstrap");

test('robotsHandler return all allow', async () => {
    const tester = bootstrap('/robots.txt', '/robots.txt', `robotsTxt({
        rules: [
            {
                userAgent: "*",
                allow: ["/"]
            }
        ]
    })`)
    let res = await tester.run();
    let resText = await res.text()
    return expect(resText).toBe(`User-agent: *
Allow: /`);
});

test('robotsHandler return all disallow', async () => {
    const tester = bootstrap('/robots.txt', '/robots.txt', `robotsTxt({
        rules: [
            {
                userAgent: "*",
                disallow: ["/"]
            }
        ]
    })`)
    let res = await tester.run();
    let resText = await res.text()
    return expect(resText).toBe(`User-agent: *
Disallow: /`);
});

test('robotsHandler return allow & disallow both', async () => {
    const tester = bootstrap('/robots.txt', '/robots.txt', `robotsTxt({
        rules: [
            {
                userAgent: "*",
                allow: ["/welcome", "/hello-world"],
                disallow: ["/"]
            }
        ]
    })`)
    let res = await tester.run();
    let resText = await res.text()
    return expect(resText).toBe(`User-agent: *
Allow: /welcome
Allow: /hello-world
Disallow: /`);
});

test('robotsHandler multi User-agent', async () => {
    const tester = bootstrap('/robots.txt', '/robots.txt', `robotsTxt({
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
    })`)
    let res = await tester.run();
    let resText = await res.text()
    return expect(resText).toBe(`User-agent: GoogleBot
Disallow: /
User-agent: Bingbot
Disallow: /google-only`);
});

test('robotsHandler multi User-agent with sitemap', async () => {
    const tester = bootstrap('/robots.txt', '/robots.txt', `robotsTxt({
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
    })`)
    const res = await tester.run();
    let resText = await res.text()
    return expect(resText).toBe(`User-agent: GoogleBot
Disallow: /
User-agent: Bingbot
Disallow: /google-only

Sitemap: https://localhost/sitemap.xml`);
});
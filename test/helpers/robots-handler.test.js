const Cloudworker = require("@dollarshaveclub/cloudworker");
const { robotsHandler } = require("../../dist/index");

function robotsHandlerTester(options) {
  const simpleScript = `
const robotsHandler = ${robotsHandler};
addEventListener('fetch', event => {
  let res = robotsHandler(event, ${JSON.stringify(options)})
  event.respondWith(res || new Response('hello', {status: 200}));
})
`
  const req = new Cloudworker.Request('http://127.0.0.1/robots.txt');
  const cw = new Cloudworker(simpleScript, {
    bindings: {
      robotsHandler
    }
  })
  return cw.dispatch(req)
}

test('robotsHandler return all allow', () => {
  return robotsHandlerTester({
    rules: [
      {
        userAgent: "*",
        allow: ["/"]
      }
    ]
  }).then(async res => {
    let resText = await res.text()
    expect(resText).toBe(`User-agent: *
Allow: /`);
  })
});

test('robotsHandler return all disallow', () => {
  return robotsHandlerTester({
    rules: [
      {
        userAgent: "*",
        disallow: ["/"]
      }
    ]
  }).then(async res => {
    let resText = await res.text()
    expect(resText).toBe(`User-agent: *
Disallow: /`);
  })
});

test('robotsHandler return allow first', () => {
  return robotsHandlerTester({
    rules: [
      {
        userAgent: "*",
        allow: ["/welcome", "/hello-world"],
        disallow: ["/"]
      }
    ]
  }).then(async res => {
    let resText = await res.text()
    expect(resText).toBe(`User-agent: *
Allow: /welcome
Allow: /hello-world`);
  })
});

test('robotsHandler multi User-agent', () => {
  return robotsHandlerTester({
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
  }).then(async res => {
    let resText = await res.text()
    expect(resText).toBe(`User-agent: GoogleBot
Disallow: /
User-agent: Bingbot
Disallow: /google-only`);
  })
});

test('robotsHandler multi User-agent with sitemap', () => {
  return robotsHandlerTester({
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
  }).then(async res => {
    let resText = await res.text()
    expect(resText).toBe(`User-agent: GoogleBot
Disallow: /
User-agent: Bingbot
Disallow: /google-only

Sitemap: https://localhost/sitemap.xml`);
  })
});
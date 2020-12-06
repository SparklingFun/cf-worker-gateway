const Cloudworker = require("@dollarshaveclub/cloudworker");
const { robotsHandler } = require("../../dist/index");

function robotsHandlerTester() {
  const simpleScript = `
  const robotsHandler = ${robotsHandler};
addEventListener('fetch', event => {
  let res = robotsHandler(event, {
    rules: [
        {
            userAgent: "*",
            disallow: ["/"]
        }
    ]
})
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

test('robots handler works well', () => {
    return robotsHandlerTester().then(async res => {
        let resText = await res.text()
        expect(resText).toBe(`User-agent: *
Disallow: /`);
    })
});
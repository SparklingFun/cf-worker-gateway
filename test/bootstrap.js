const fs = require('fs');
const Cloudworker = require("@dollarshaveclub/cloudworker");
const code = fs.readFileSync(process.cwd() + "/dist/index.js");

function gatewayTester(testPath = '/test2') {
  const simpleScript = `
${code.toString().replace(/export [\s\S]*;/g, '')}

addEventListener('fetch', event => {
    const app = new Gateway(event);
    app.use(redirect([
        {
            source: '/test2',
            destination: '/api/test2',
        }
    ]))
    const gatewayResult = app();

    event.respondWith(gatewayResult instanceof Response ? gatewayResult : new Response(gatewayResult.request.url, {status: 200}));
})
`
  const req = new Cloudworker.Request('http://127.0.0.1' + testPath);
  const cw = new Cloudworker(simpleScript, {
    bindings: {
      Event,
      Buffer
    }
  })
  return cw.dispatch(req)
}

module.exports = gatewayTester
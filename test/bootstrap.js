const fs = require('fs');
const Cloudworker = require("@dollarshaveclub/cloudworker");
const code = fs.readFileSync(process.cwd() + "/dist/index.js");

function gatewayTester(testPath = '/test2', middlewareName, options) {
  let opt = options;
  if(typeof opt === 'object') {
    opt = JSON.stringify(options);
  }
  const simpleScript = `
${code.toString().replace(/export [\s\S]*;/g, '')}

addEventListener('fetch', event => {
    const app = new Gateway(event);
    
    app.use(${middlewareName}(${opt || ''}));

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
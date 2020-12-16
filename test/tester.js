const fs = require('fs');
const Cloudworker = require("@dollarshaveclub/cloudworker");
const code = fs.readFileSync(process.cwd() + "/dist/index.js");

function gatewayTester(rules, testPath = '/test2', init = {method: 'GET'}) {
  const simpleScript = `
  ${code.toString().replace(/export {[ \w_,]+};\n$/g, '')}

addEventListener('fetch', event => {
  let _newEvt = gateway(event, ${JSON.stringify(rules)});
  event.respondWith(_newEvt instanceof Response ? _newEvt : new Response(_newEvt.request.url, {status: 200}));
})
`
  const req = new Cloudworker.Request('http://127.0.0.1' + testPath, init);
  const cw = new Cloudworker(simpleScript, {
    bindings: {
      Event,
      Buffer
    }
  })
  return cw.dispatch(req)
}

module.exports = gatewayTester
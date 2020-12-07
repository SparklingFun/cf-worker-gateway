const fs = require('fs');
const Cloudworker = require("@dollarshaveclub/cloudworker");
const code = fs.readFileSync(process.cwd() + "/dist/index.js");

function gatewayTester(rules) {
  const simpleScript = `
  ${code.toString().replace(/export {[ \w_,]+};\n$/g, '')}

addEventListener('fetch', event => {
  let _newEvt = gateway(event, ${JSON.stringify(rules)});
  event.respondWith(_newEvt instanceof Response ? _newEvt : new Response('hello', {status: 200}));
})
`
  const req = new Cloudworker.Request('http://127.0.0.1/test2');
  const cw = new Cloudworker(simpleScript)
  return cw.dispatch(req)
}

module.exports = gatewayTester
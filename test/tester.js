const Cloudworker = require("@dollarshaveclub/cloudworker");
const gateway = require("../lib/index").default;

function gatewayTester(rules) {
  const simpleScript = `
addEventListener('fetch', event => {
  let _newEvt = gateway.call(this, event, ${JSON.stringify(rules)});
  event.respondWith(_newEvt instanceof Response ? _newEvt : new Response('hello', {status: 200}));
})
`
  const req = new Cloudworker.Request('http://127.0.0.1/test2');
  const cw = new Cloudworker(simpleScript, {
    bindings: {
      gateway
    }
  })
  return cw.dispatch(req)
}

module.exports = gatewayTester
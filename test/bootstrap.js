const fs = require('fs');
const Cloudworker = require("@dollarshaveclub/cloudworker");
const code = fs.readFileSync(process.cwd() + "/dist/index.js");
const KeyValueStore = require("@dollarshaveclub/cloudworker/lib/kv").KeyValueStore;

function gatewayTester(testPath = '/test2', functionCode, init = { method: 'GET' }) {
  const simpleScript = `
${code.toString().replace(/export [\s\S]*;/g, '')}

addEventListener('fetch', event => {
    const app = new Gateway(event);
    app.use(${functionCode});
    app.use((event) => {
      return new Response(event.request.url, {status: 200})
    });
    
    return event.respondWith(app.run());
})
`
  const req = new Cloudworker.Request('http://127.0.0.1' + testPath, init);
  const cw = new Cloudworker(simpleScript, {
    bindings: {
      Event,
      Buffer,
      KeyValueStore: new KeyValueStore()
    }
  });
  return cw.dispatch(req);
}

module.exports = gatewayTester
const fs = require('fs');
const Cloudworker = require("@dollarshaveclub/cloudworker");
const code = fs.readFileSync(process.cwd() + "/dist/index.js");
const KeyValueStore = require("@dollarshaveclub/cloudworker/lib/kv").KeyValueStore;
const Request = require("@dollarshaveclub/cloudworker/lib/runtime").Request;

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
  const cw = new Cloudworker(simpleScript, {
    bindings: {
      Event,
      Buffer,
      KeyValueStore: new KeyValueStore()
    }
  });
  // const req = new Cloudworker.Request('http://127.0.0.1' + testPath, init);
  return { cw, run: () => {
    return cw.dispatch(new Request('http://127.0.0.1' + testPath, init));
  } };
}

module.exports = gatewayTester
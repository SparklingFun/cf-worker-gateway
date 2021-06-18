const fs = require("fs");
const Cloudworker = require("@dollarshaveclub/cloudworker");
const Request = require("@dollarshaveclub/cloudworker/lib/runtime").Request;

let workerContent = fs.readFileSync(process.cwd() + "/dist/index.js");
workerContent = workerContent.toString().replace(/export [\s\S]*;/g, "");
let injectWorkerRunner = function (code) {
  return `
  ${workerContent}

  addEventListener('fetch', event => {
    const app = new WorkerScaffold(event, true);
    ${code}
    app.use(async event => {
      return new Response(event.request.url, {status: 404})
    });
    
    event.respondWith(app.run());
  })
  `;
};

function bootstrap(reqPath = "/test", code, init = { method: "GET" }) {
  const runCode = injectWorkerRunner(code);
  const cw = new Cloudworker(runCode, {
    bindings: {
      Event,
      Buffer,
    },
  });
  return cw.dispatch(
    new Request(
      reqPath.startsWith("http") ? reqPath : "http://127.0.0.1" + reqPath,
      init
    )
  );
}

module.exports = bootstrap;

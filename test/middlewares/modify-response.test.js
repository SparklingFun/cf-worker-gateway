const fs = require('fs');
const Cloudworker = require("@dollarshaveclub/cloudworker");
const code = fs.readFileSync(process.cwd() + "/dist/index.js");
const origin = 'http://127.0.0.1';

// test bootstrapper
function gatewayTester(testPath = '/test2', middlewaresCode) {
  const simpleScript = `
${code.toString().replace(/export [\s\S]*;/g, '')}

addEventListener('fetch', event => {
    const app = new Gateway(event);
    
    ${middlewaresCode || ''}

    app.use((event) => {
      return new Response(event.request.url, {status: 200})
    });
    
    return event.respondWith(app.run(async (res) => {
      res.headers.set("Access-Control-Allow-Origin", "*");
      const anotherRes = await fetch("https://api.github.com/users/arctome");
      const anotherResJSON = await anotherRes.json();
      res.headers.set("Test-Await-Success", anotherResJSON.id);
      return res;
    }));
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

// multi return response test
test('[Base] Callback in app.run can modify response', () => {
  return gatewayTester('/test2', `
      app.use(function(event) {
        if(event.request.url === "http://127.0.0.1/test") {
          return new Response("test", {status: 204});
        }
      })
      app.use(function(event) {
        if(event.request.url === "http://127.0.0.1/test2") {
          return new Response("test", {status: 200});
        }
      })
      app.use(function(event) {
        if(event.request.url === "http://127.0.0.1/test2") {
          return new Response("test", {status: 400});
        }
      })
    `).then(res => {
    expect(res.headers.get("Access-Control-Allow-Origin")).toBe("*");
  })
});

// multi return response test
test('[Base] Callback in app.run can modify response', () => {
  return gatewayTester('/test2', `
      app.use(function(event) {
        if(event.request.url === "http://127.0.0.1/test") {
          return new Response("test", {status: 204});
        }
      })
      app.use(function(event) {
        if(event.request.url === "http://127.0.0.1/test2") {
          return new Response("test", {status: 200});
        }
      })
      app.use(function(event) {
        if(event.request.url === "http://127.0.0.1/test2") {
          return new Response("test", {status: 400});
        }
      })
    `).then(res => {
    expect(res.headers.get("Test-Await-Success")).toBe("29349655");
  })
});
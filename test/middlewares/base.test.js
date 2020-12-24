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

// multi return response test
test('[Base] Multi middlewares with response should return first match', () => {
  return gatewayTester('/test2', `
      app.use(function(event, next) {
        if(event.request.url === "http://127.0.0.1/test") {
          return new Response("test", {status: 204});
        } else {
          next();
        }
      })
      app.use(function(event, next) {
        if(event.request.url === "http://127.0.0.1/test2") {
          return new Response("test", {status: 200});
        } else {
          next();
        }
      })
      app.use(function(event, next) {
        if(event.request.url === "http://127.0.0.1/test2") {
          return new Response("test", {status: 400});
        } else {
          next();
        }
      })
    `).then(res => {
    expect(res.status).toBe(200);
  })
});

// multi middleware modify event test (using rewrite, should compare to `rewrite` unit test)
test('[Base] Middlewares which modify event should return all modification', () => {
  return gatewayTester('/test', `
    app.use(rewrite([
      {
        source: '/test',
        destination: '/test2',
      }
    ]))
    app.use(rewrite([
      {
        source: '/test2',
        destination: '/docs/test2',
      }
    ]))
  `).then(async res => {
    const resText = await res.text();
    expect(resText).toBe(origin + '/docs/test2');
  })
});
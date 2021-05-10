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
    
    return event.respondWith(app.run());
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
    expect(res.status).toBe(200);
  })
});
// multi middleware modify event test (using rewrite, should compare to `rewrite` unit test)
test('Continuous rewrite', () => {
  return gatewayTester('/test', `
    app.use('/test', rewrite('/test2'));
    app.use('/test2', rewrite('/docs/test2'))
  `).then(async res => {
    const resText = await res.text();
    expect(resText).toBe(origin + '/docs/test2');
  })
});
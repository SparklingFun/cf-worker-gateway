const Cloudworker = require("@dollarshaveclub/cloudworker");
const gateway = require("../lib/index").default;

const simpleScript = `
addEventListener('fetch', event => {
  let _newEvt = gateway.call(this, event, {
    redirects: [{source: '/test2', destination: '/test-slug'}]
  });
  event.respondWith(_newEvt instanceof Response ? _newEvt : new Response('hello', {status: 200}));
})
`
const req = new Cloudworker.Request('http://127.0.0.1/test2')
const cw = new Cloudworker(simpleScript, {
  bindings: {
    gateway
  }
})
cw.dispatch(req).then((res) => {
  console.log("Response Status: ", res.status)
  res.text().then((body) =>{
    console.log("Response Body: ", body)
  })
})
const bootstrap = require("../bootstrap");
const origin = 'http://127.0.0.1';

test('[Interceptor] Interceptor make response', async () => {
    const tester = bootstrap('/test2', `interceptor('/test2', (event) => {
        return new Response(null, {status: 204})
    })`)
    let res = await tester.run();
    return expect(res.status).toBe(204);
});

test('[Interceptor] Interceptor make a new FetchEvent', async () => {
    const tester = bootstrap('/test2', `interceptor('/test2', (event) => {
        function _modifyEvent(event, modifiedReq) {
            // let _req = event.request.clone();
            let _req = event.request;
            let newReq = Object.assign({}, _req, modifiedReq);
            let _evt = new Event("fetch");
            // @ts-ignore
            _evt.request = newReq;
            _evt.tester = 'blablabla';
            // @ts-ignore
            return _evt;
        }
        let newEvt = _modifyEvent(event, {url: '${origin}' + '/test3'})
        return newEvt;
    })`)
    let res = await tester.run();
    let resText = await res.text();
    return expect(resText).toBe(origin + '/test3');
});
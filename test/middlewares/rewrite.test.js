const bootstrap = require("../bootstrap");
const origin = 'http://127.0.0.1';

test('[Middleware - Rewrite] From-to rewrite', async () => {
    const tester = bootstrap('/test2', '/test2', `rewrite('/test2')`)
    let res = await tester.run();
    const resText = await res.text();
    return expect(resText).toBe(origin + '/test2');
});
test('[Middleware - Rewrite] Simple Redirect', async () => {
    const tester = bootstrap('/test2', '/test2', `rewrite('/docs/test2')`)
    const res = await tester.run();
    const resText = await res.text();
    return expect(resText).toBe(origin + '/docs/test2');
});
test('[Middleware - Rewrite] Remove prefix rewrite', async () => {
    // See also {@link https://github.com/pillarjs/path-to-regexp#compatibility-with-express--4x}
    const tester = bootstrap('/docs/test2', '/docs/(.*)', `rewrite('/test2')`)
    const res = await tester.run();
    const resText = await res.text();
    return expect(resText).toBe(origin + '/test2');
});
test('[Middleware - Rewrite] Remove prefixed deep path rewrite', async () => {
    const tester = bootstrap('/docs/test1/test2/test3', '/docs/(.*)+', `rewrite('/test2')`)
    const res = await tester.run();
    const resText = await res.text();
    return expect(resText).toBe(origin + '/test2');
});
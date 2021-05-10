const bootstrap = require("../bootstrap");
const origin = 'http://127.0.0.1';

test('[Redirect] Simple Redirect', async () => {
    const tester = bootstrap('/test2', '/test2', `redirect('/api/test2')`)
    let res = await tester.run();
    return expect(res.status).toBe(307);
});

test('[Redirect] Permant Redirect', async () => {
    const tester = bootstrap('/test2', '/test2', `redirect('/api/test2', 308)`)
    let res = await tester.run()
    return expect(res.status).toBe(308);
});

test('[Redirect] Permant Redirect with boolean', async () => {
    const tester = bootstrap('/test2', '/test2', `redirect('/api/test2', true)`)
    let res = await tester.run()
    return expect(res.status).toBe(308);
});
test('[Redirect] CrossOrigin Redirect', async () => {
    const tester = bootstrap('/test2', '/test2', `redirect('https://www.google.com/')`)
    let res = await tester.run();
    return expect(res.headers.get("Location")).toBe('https://www.google.com/');
});
const bootstrap = require("../bootstrap");
const origin = 'http://127.0.0.1';

test('[Redirect] Simple Redirect', async () => {
    const tester = bootstrap('/test2', `redirect({
        rules: [
            {
                source: '/test2',
                destination: '/api/test2',
            }
        ]
    })`)
    let res = await tester.run();
    return expect(res.status).toBe(307);
});

test('[Redirect] Permant Redirect', async () => {
    const tester = bootstrap('/test2', `redirect({
        rules: [
            {
                source: '/test2',
                destination: '/api/test2',
                permanent: true
            }
        ]
    })`)
    let res = await tester.run()
    return expect(res.status).toBe(308);
});
test('[Redirect] CrossOrigin Redirect', async () => {
    const tester = bootstrap('/test2', `redirect({
        rules: [
            {
                source: '/test2',
                destination: 'https://www.google.com/'
            }
        ]
    })`)
    let res = await tester.run();
    return expect(res.headers.get("Location")).toBe('https://www.google.com/');
});
test('[Redirect] CrossOrigin Redirect with basePath should be ignored', async () => {
    const tester = bootstrap('/docs/test2',`redirect({
        basePath: '/docs',
        rules: [
            {
                source: '/test2',
                destination: 'https://www.google.com/'
            }
        ]
    })`)
    const res = await tester.run();
    const resText = await res.text();
    return expect(resText).toBe(origin + '/docs/test2');
});
const bootstrap = require('../bootstrap');
const origin = '127.0.0.1';

test('ip controller should block local addr', async () => {
    const tester = bootstrap('/test', `ipController({
        deny: ['127.0.0.1']
    })`, {
        headers: {
            "CF-Connecting-IP": "127.0.0.1"
        }
    })
    let res = await tester.run();
    return expect(res.status).toBe(403);
})

test('ip controller should allow localhost addr', async () => {
    const tester = bootstrap('/test', `ipController({
        allow: ['10.1.1.0/24']
    })`, {
        headers: {
            "CF-Connecting-IP": "10.1.1.1"
        }
    })
    let res = await tester.run();
    return expect(res.status).toBe(200);
})
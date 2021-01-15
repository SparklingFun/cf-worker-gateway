const bootstrap = require('../bootstrap');
// const origin = '127.0.0.1';

test('ip controller should block local addr', async () => {
    let req = () => {
        return bootstrap('/api/test', `accessRateLimit({
            rules: [
                {
                    path: "/api/test",
                    times: 1,
                    banTime: 1000
                }
            ],
            jailKVSpace: KeyValueStore
        })`, {
            headers: {
                "CF-Connecting-IP": "127.0.0.1"
            }
        })
    }
    let res1 = await req();
    let res2 = await req();
    // console.log(await res2.text());
    return expect(res2.status).toBe(403);
})
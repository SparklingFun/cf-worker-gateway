const bootstrap = require("../bootstrap");

test('[Helpers - BasicAuth] Basic Auth take effect', async () => {
    const username = "YOUR_USER_NAME";
    const password = "YOUR_PASSWORD";
    const tester = bootstrap("/test2", "/test2", `basicAuth()`, {
        method: 'GET',
        headers: {
            'Authorization': 'Basic ' + Buffer.from(username + ":" + password).toString('base64')
        }
    })
    let res = await tester.run();
    return expect(res.status).toBe(200);
});

test('[Helpers - BasicAuth] Wrong password will be blocked',async () => {
    const username = "YOUR_USER_NAME";
    const password = "YOUR_PASSWORDRD";
    const tester = bootstrap("/test2", "/test2", `basicAuth()`, {
        method: 'GET',
        headers: {
            'Authorization': 'Basic ' + Buffer.from(username + ":" + password).toString('base64')
        }
    })
    let res = await tester.run()
    return expect(res.status).toBe(401);
});

test('[Helpers - BasicAuth] Children paths will also be blocked',async () => {
    const username = "YOUR_USER_NAME";
    const password = "YOUR_PASSWORDRD";
    const tester = bootstrap("/test2/a/b/c", "/test2/(.*)+", `basicAuth()`, {
        method: 'GET',
        headers: {
            'Authorization': 'Basic ' + Buffer.from(username + ":" + password).toString('base64')
        }
    })
    let res = await tester.run();
    return expect(res.status).toBe(401);
});
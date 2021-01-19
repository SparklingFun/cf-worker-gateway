const bootstrap = require("../bootstrap");

test('[Helpers] Basic Auth take effect', async () => {
    const username = "YOUR_USER_NAME";
    const password = "YOUR_PASSWORD";
    const tester = bootstrap("/test2", `basicAuth({
        path: "/test2"
    })`, {
        method: 'GET',
        headers: {
            'Authorization': 'Basic ' + Buffer.from(username + ":" + password).toString('base64')
        }
    })
    let res = await tester.run();
    return expect(res.status).toBe(200);
});

test('[Helpers] Wrong password will be blocked',async () => {
    const username = "YOUR_USER_NAME";
    const password = "YOUR_PASSWORDRD";
    const tester = bootstrap("/test2", `basicAuth({
        path: "/test2"
    })`, {
        method: 'GET',
        headers: {
            'Authorization': 'Basic ' + Buffer.from(username + ":" + password).toString('base64')
        }
    })
    let res = await tester.run()
    return expect(res.status).toBe(401);
});

test('[Helpers] Children paths will also be blocked',async () => {
    const username = "YOUR_USER_NAME";
    const password = "YOUR_PASSWORDRD";
    const tester = bootstrap("/test2", `basicAuth({
        path: ["/test2", "/test2/**"]
    })`, {
        method: 'GET',
        headers: {
            'Authorization': 'Basic ' + Buffer.from(username + ":" + password).toString('base64')
        }
    })
    let res = await tester.run();
    return expect(res.status).toBe(401);
});

test('[Helpers] Unset path means all path',async () => {
    const username = "YOUR_USER_NAME";
    const password = "YOUR_PASSWORDRD";
    const tester = bootstrap("/test2", `basicAuth()`, {
        method: 'GET',
        headers: {
            'Authorization': 'Basic ' + Buffer.from(username + ":" + password).toString('base64')
        }
    })
    let res = await tester.run();
    return expect(res.status).toBe(401);
});
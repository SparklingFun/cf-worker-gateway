const bootstrap = require("../bootstrap");

test('[Helpers] Basic Auth take effect', () => {
    const username = "YOUR_USER_NAME";
    const password = "YOUR_PASSWORD";
    return bootstrap("/test2", `basicAuth({
        path: "/test2"
    })`, {
        method: 'GET',
        headers: {
            'Authorization': 'Basic ' + Buffer.from(username + ":" + password).toString('base64')
        }
    }).then(res => {
        expect(res.status).toBe(200);
    })
});

test('[Helpers] Wrong password will be blocked', () => {
    const username = "YOUR_USER_NAME";
    const password = "YOUR_PASSWORDRD";
    return bootstrap("/test2", `basicAuth({
        path: "/test2"
    })`, {
        method: 'GET',
        headers: {
            'Authorization': 'Basic ' + Buffer.from(username + ":" + password).toString('base64')
        }
    }).then(res => {
        expect(res.status).toBe(401);
    })
});

test('[Helpers] Child path will also be blocked', () => {
    const username = "YOUR_USER_NAME";
    const password = "YOUR_PASSWORDRD";
    return bootstrap("/test2/docs", `basicAuth({
        path: "/test2/*"
    })`, {
        method: 'GET',
        headers: {
            'Authorization': 'Basic ' + Buffer.from(username + ":" + password).toString('base64')
        }
    }).then(res => {
        expect(res.status).toBe(401);
    })
});

test('[Helpers] All path test Auth', () => {
    const username = "YOUR_USER_NAME";
    const password = "YOUR_PASSWORDRD";
    return bootstrap("/test2", `basicAuth()`, {
        method: 'GET',
        headers: {
            'Authorization': 'Basic ' + Buffer.from(username + ":" + password).toString('base64')
        }
    }).then(res => {
        expect(res.status).toBe(401);
    })
});
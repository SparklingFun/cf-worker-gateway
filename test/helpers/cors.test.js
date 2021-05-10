const bootstrap = require("../bootstrap");

test('[Helpers] Allow OPTIONS request', async () => {
    const tester = bootstrap("/test2", "/", "cors({'test': '1'})", {
        method: 'OPTIONS'
    })
    let res = await tester.run();
    return expect(res.status).toBe(204);
});

test('[Helpers] Allow OPTIONS request with custom headers', async () => {
    const tester = bootstrap("/test2", "/test2", "cors({'allowedHeaders': 'Test-Header'})", {
        method: 'OPTIONS',
        headers: {
            "Test-Header": "this-is-a-test-header"
        }
    })
    let res = await tester.run();
    return expect(res.headers.get("Access-Control-Allow-Headers")).toBe("Test-Header");
});
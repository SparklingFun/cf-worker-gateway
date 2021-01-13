const bootstrap = require("../bootstrap");

test('[Helpers] Allow OPTIONS request', () => {
    return bootstrap("/test2", "allowOption()", {
        method: 'OPTIONS'
    }).then(res => {
        expect(res.status).toBe(204);
    })
});

test('[Helpers] Allow OPTIONS request with custom headers', () => {
    return bootstrap("/test2", "allowOption()", {
        method: 'OPTIONS',
        headers: {
            "Test-Header": "this-is-a-test-header",
            "access-control-request-headers": "Test-Header"
        }
    }).then(res => {
        expect(res.headers.get("Access-Control-Allow-Headers")).toBe("Test-Header");
    })
});
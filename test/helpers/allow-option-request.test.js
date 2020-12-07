const tester = require("../tester");

test('Allow OPTIONS request', () => {
    return tester({
        allowOptionRequest: true
    }, undefined, {
        method: 'OPTIONS'
    }).then(res => {
        expect(res.status).toBe(204);
    })
});

test('Allow OPTIONS request with custom headers', () => {
    return tester({
        allowOptionRequest: true
    }, undefined, {
        method: 'OPTIONS',
        headers: {
            "Test-Header": "this-is-a-test-header",
            "access-control-request-headers": "Test-Header"
        }
    }).then(res => {
        expect(res.headers.get("Access-Control-Allow-Headers")).toBe("Test-Header");
    })
});
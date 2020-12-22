const bootstrap = require("../bootstrap");

test('Simple Redirect', () => {
    return bootstrap('/test2').then(res => {
        expect(res.status).toBe(307);
    })
});
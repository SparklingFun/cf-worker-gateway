const bootstrap = require("../bootstrap");

test('Simple Redirect', () => {
    return bootstrap('/test2', 'redirect', JSON.stringify([
        {
            source: '/test2',
            destination: '/api/test2',
        }
    ])).then(res => {
        expect(res.status).toBe(307);
    })
});
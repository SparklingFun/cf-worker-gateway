const tester = require("../tester");
const testRule = {
    redirects: [
        {
            source: '/test2',
            destination: '/api/test2',
        }
    ]
}

test('307 Redirect', () => {
    return tester(testRule).then(res => {
        expect(res.status).toBe(307);
    })
});
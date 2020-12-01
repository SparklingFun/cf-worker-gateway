const tester = require("../tester");
const testRule = {
    rewrites: [
        {
            source: '/:path*/',
            destination: '/:path*/',
        },
        {
            source: '/:path*/',
            destination: 'http://localhost:__EXTERNAL_PORT__/:path*',
        },
    ]
}

test('Trailing slashes rewrites', () => {
    return tester(testRule).then(res => {
        expect(res.status).toBe(200);
    })
});
const tester = require("../tester");
const testRule = {
    rewrites: [
        {
            source: '/:path*',
            destination: '/:path*',
        },
        {
            source: '/:path*(/?(?!.html))',
            destination: '/category/:path*',
        },
    ]
}

test('Client resoving rewrites', () => {
    return tester(testRule).then(res => {
        expect(res.status).toBe(200);
    })
});
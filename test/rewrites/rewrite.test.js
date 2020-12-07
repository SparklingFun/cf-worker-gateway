const tester = require("../tester");
const testRule = {
    rewrites: [
        {
            source: '/:path*',
            destination: '/:path*',
        },
        // {
        //     source: '/:path*(/?(?!.html))',
        //     destination: '/category/:path*',
        // },
        // {
        //     source: '/:path*/',
        //     destination: '/:path*/',
        // },
        // {
        //     source: '/:path*/',
        //     destination: 'http://localhost:__EXTERNAL_PORT__/:path*',
        // },
    ]
}

test('From-to rewrite', () => {
    return tester({
        rewrites: [
            {
                source: '/:path*',
                destination: '/:path*',
            }
        ]
    }).then(async res => {
        const resText = await res.text();
        expect(resText).toBe('http://127.0.0.1/test2');
    })
});
test('From-Prefix rewrite', () => {
    return tester({
        rewrites: [
            {
                source: '/:path*',
                destination: '/docs/:path*',
            }
        ]
    }).then(async res => {
        const resText = await res.text();
        expect(resText).toBe('http://127.0.0.1/docs/test2');
    })
});
const tester = require("../tester");
const origin = 'http://127.0.0.1'

test('From-to rewrite', () => {
    return tester({
        rewrites: [
            {
                source: '/test2',
                destination: '/test2',
            }
        ]
    }).then(async res => {
        const resText = await res.text();
        expect(resText).toBe(origin + '/test2');
    })
});
test('From-Prefix rewrite', () => {
    return tester({
        rewrites: [
            {
                source: '/test2',
                destination: '/docs/test2',
            }
        ]
    }).then(async res => {
        const resText = await res.text();
        expect(resText).toBe(origin + '/docs/test2');
    })
});
test('Remove prefix rewrite', () => {
    return tester({
        rewrites: [
            {
                source: '/docs/*',
                destination: '/test2',
            }
        ]
    }, '/docs/test2').then(async res => {
        const resText = await res.text();
        expect(resText).toBe(origin + '/test2');
    })
});
test('Remove prefixed deep path rewrite', () => {
    return tester({
        rewrites: [
            {
                source: '/docs/**/*',
                destination: '/test2',
            }
        ]
    }, '/docs/test1/test2/test3').then(async res => {
        const resText = await res.text();
        expect(resText).toBe(origin + '/test2');
    })
});
test('Rewrite with basePath', () => {
    return tester({
        basePath: '/docs',
        rewrites: [
            {
                source: '/**/*',
                destination: '/test2',
            }
        ]
    }, '/docs/test1/test2/test3').then(async res => {
        const resText = await res.text();
        expect(resText).toBe(origin + '/docs/test2');
    })
})
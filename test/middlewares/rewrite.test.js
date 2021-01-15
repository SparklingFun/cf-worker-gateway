const bootstrap = require("../bootstrap");
const origin = 'http://127.0.0.1';

test('From-to rewrite', async () => {
    const tester = bootstrap('/test2', `rewrite({
        rules: [
            {
                source: '/test2',
                destination: '/test2',
            }
        ]
    })`)
    let res = await tester.run();
    const resText = await res.text();
    return expect(resText).toBe(origin + '/test2');
});
test('Simple Redirect', async () => {
    const tester = bootstrap('/test2', `rewrite({
        rules: [
            {
                source: '/test2',
                destination: '/docs/test2',
            }
        ]
    })`)
    const res = await tester.run();
    const resText = await res.text();
    return expect(resText).toBe(origin + '/docs/test2');
});
test('From-Prefix rewrite', async () => {
    const tester = bootstrap('/test2', `rewrite({
        rules: [
            {
                source: '/test2',
                destination: '/docs/test2',
            }
        ]
    })`)
    const res = await tester.run()
    const resText = await res.text();
    return expect(resText).toBe(origin + '/docs/test2');
});
test('Remove prefix rewrite', async () => {
    const tester = bootstrap('/docs/test2', `rewrite({
        rules: [
            {
                source: '/docs/*',
                destination: '/test2',
            }
        ]
    })`)
    const res = await tester.run();
    const resText = await res.text();
    return expect(resText).toBe(origin + '/test2');
});
test('Remove prefixed deep path rewrite', async () => {
    const tester = bootstrap('/docs/test1/test2/test3', `rewrite({
        rules: [
            {
                source: '/docs/**/*',
                destination: '/test2',
            }
        ]
    })`)
    const res = await tester.run();
    const resText = await res.text();
    return expect(resText).toBe(origin + '/test2');
});
test('Rewrite with basePath', async () => {
    const tester = bootstrap('/docs/test1/test2/test3', `rewrite({
        basePath: '/docs',
        rules: [
            {
                source: '/**/*',
                destination: '/test2',
            }
        ]
    })`)
    const res = await tester.run();
    const resText = await res.text();
    return expect(resText).toBe(origin + '/docs/test2');
})
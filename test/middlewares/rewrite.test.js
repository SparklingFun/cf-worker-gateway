const bootstrap = require("../bootstrap");
const origin = 'http://127.0.0.1';

test('From-to rewrite', () => {
    return bootstrap('/test2', `rewrite({
        rules: [
            {
                source: '/test2',
                destination: '/test2',
            }
        ]
    })`).then(async res => {
        const resText = await res.text();
        expect(resText).toBe(origin + '/test2');
    })
});
test('Simple Redirect', () => {
    return bootstrap('/test2', `rewrite({
        rules: [
            {
                source: '/test2',
                destination: '/docs/test2',
            }
        ]
    })`).then(async res => {
        const resText = await res.text();
        expect(resText).toBe(origin + '/docs/test2');
    })
});
test('From-Prefix rewrite', () => {
    return bootstrap('/test2', `rewrite({
        rules: [
            {
                source: '/test2',
                destination: '/docs/test2',
            }
        ]
    })`).then(async res => {
        const resText = await res.text();
        expect(resText).toBe(origin + '/docs/test2');
    })
});
test('Remove prefix rewrite', () => {
    return bootstrap('/docs/test2', `rewrite({
        rules: [
            {
                source: '/docs/*',
                destination: '/test2',
            }
        ]
    })`).then(async res => {
        const resText = await res.text();
        expect(resText).toBe(origin + '/test2');
    })
});
test('Remove prefixed deep path rewrite', () => {
    return bootstrap('/docs/test1/test2/test3', `rewrite({
        rules: [
            {
                source: '/docs/**/*',
                destination: '/test2',
            }
        ]
    })`).then(async res => {
        const resText = await res.text();
        expect(resText).toBe(origin + '/test2');
    })
});
test('Rewrite with basePath', () => {
    return bootstrap('/docs/test1/test2/test3', `rewrite({
        basePath: '/docs',
        rules: [
            {
                source: '/**/*',
                destination: '/test2',
            }
        ]
    })`).then(async res => {
        const resText = await res.text();
        expect(resText).toBe(origin + '/docs/test2');
    })
})
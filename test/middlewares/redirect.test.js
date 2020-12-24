const bootstrap = require("../bootstrap");
const origin = 'http://127.0.0.1';

test('[Redirect] Simple Redirect', () => {
    return bootstrap('/test2', 'redirect', {
        rules: [
            {
                source: '/test2',
                destination: '/api/test2',
            }
        ]
    }).then(res => {
        expect(res.status).toBe(307);
    })
});

test('[Redirect] Permant Redirect', () => {
    return bootstrap('/test2', 'redirect', {
        rules: [
            {
                source: '/test2',
                destination: '/api/test2',
                permanent: true
            }
        ]
    }).then(res => {
        expect(res.status).toBe(308);
    })
});
test('[Redirect] CrossOrigin Redirect', () => {
    return bootstrap('/test2', 'redirect', {
        rules: [
            {
                source: '/test2',
                destination: 'https://www.google.com/'
            }
        ]
    }).then(res => {
        expect(res.headers.get("Location")).toBe('https://www.google.com/');
    })
});
test('[Redirect] CrossOrigin Redirect with basePath should be ignored', () => {
    return bootstrap('/docs/test2', 'redirect', {
        basePath: '/docs',
        rules: [
            {
                source: '/test2',
                destination: 'https://www.google.com/'
            }
        ]
    }).then(async res => {
        const resText = await res.text();
        expect(resText).toBe(origin + '/docs/test2');
    })
});
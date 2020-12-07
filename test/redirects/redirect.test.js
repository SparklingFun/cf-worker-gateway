const tester = require("../tester");

test('Simple Redirect', () => {
    return tester({
        redirects: [
            {
                source: '/test2',
                destination: '/api/test2',
            }
        ]
    }).then(res => {
        expect(res.status).toBe(307);
    })
});
test('Permant Redirect', () => {
    return tester({
        redirects: [
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
test('CrossOrigin Redirect', () => {
    return tester({
        redirects: [
            {
                source: '/test2',
                destination: 'https://www.google.com/',
                crossOrigin: true
            }
        ]
    }).then(res => {
        expect(res.headers.get("Location")).toBe('https://www.google.com/');
    })
});
test('CrossOrigin Redirect without crossOrigin set', () => {
    return tester({
        redirects: [
            {
                source: '/test2',
                destination: 'https://www.google.com/'
            }
        ]
    }).then(res => {
        expect(res.status).toBe(200);
    })
});
test('CrossOrigin Redirect in basePath settled condition', () => {
    return tester({
        basePath: '/docs',
        redirects: [
            {
                source: '/test2',
                destination: 'https://www.google.com/',
                crossOrigin: true
            }
        ]
    }, '/docs/test2').then(res => {
        expect(res.headers.get("Location")).toBe('https://www.google.com/');
    })
});
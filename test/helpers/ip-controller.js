// const bootstrap = require('../bootstrap');
// // const origin = '127.0.0.1';

// test('ip controller should block local addr', () => {
//     return bootstrap('/test', 'ipController', {
//         deny: ['127.0.0.1']
//     }, {
//         headers: {
//             "CF-Connecting-IP": "127.0.0.1"
//         }
//     }).then(res => {
//         expect(res.status).toBe(403);
//     })
// })

// test('ip controller should allow localhost addr', () => {
//     return bootstrap('/test', 'ipController', {
//         allow: ['10.1.1.0/24']
//     }, {
//         headers: {
//             "CF-Connecting-IP": "10.1.1.1"
//         }
//     }).then(res => {
//         expect(res.status).toBe(200);
//     })
// })
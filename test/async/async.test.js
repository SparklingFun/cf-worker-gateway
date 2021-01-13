const bootstrap = require("../bootstrap");

test('[Async] Allow using async/await', () => {
    return bootstrap("/test2", `async function(event, next) {
        const data = await fetch("http://www.google.com");
        let body = await data.text();
        return new Response(body, {
            status: 400
        })
    }`, {
        method: 'GET'
    }).then(res => {
        console.log(res);
        expect(res.status).toBe(200);
    })
});
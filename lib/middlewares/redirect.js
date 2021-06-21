const redirect = function (path, permanent) {
    return function (event) {
        if (!path) {
            return;
        }
        let redirectedUrl;
        try {
            const tmp = new URL(path);
            redirectedUrl = tmp;
        }
        catch (e) {
            const reqUrl = new URL(event.request.url);
            const tmp = new URL(`${reqUrl.protocol}//${reqUrl.host}${path}`);
            redirectedUrl = tmp;
        }
        let status = false;
        if (typeof permanent === "number")
            status = permanent;
        if (typeof permanent === "boolean") {
            status = permanent ? 308 : 307;
        }
        return Response.redirect(redirectedUrl.href, status || 307);
    };
};
export default redirect;

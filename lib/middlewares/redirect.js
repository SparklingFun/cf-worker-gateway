const redirect = function (path, permanent) {
    return function (event) {
        if (!path) {
            return;
        }
        let redirectedUrl;
        try {
            let tmp = new URL(path);
            redirectedUrl = tmp;
        }
        catch (e) {
            let reqUrl = new URL(event.request.url);
            let tmp = new URL(reqUrl.protocol + "//" + reqUrl.host + path);
            redirectedUrl = tmp;
        }
        let status = typeof permanent === "number" ? permanent : permanent ? 308 : 307;
        return Response.redirect(redirectedUrl.href, status);
    };
};
export default redirect;

const rewrite = function (path) {
    return function (event) {
        if (!path)
            return;
        const oldReq = event.request;
        let redirectedUrl;
        try {
            const tmp = new URL(path);
            redirectedUrl = tmp;
        }
        catch (e) {
            const reqUrl = new URL(oldReq.url);
            const tmp = new URL(`${reqUrl.protocol}//${reqUrl.host}${path}${reqUrl.search}`);
            redirectedUrl = tmp;
        }
        const rewritedReq = new Event("fetch");
        const newReq = new Request(redirectedUrl.href, Object.assign({}, oldReq));
        rewritedReq.request = newReq;
        return rewritedReq;
    };
};
export default rewrite;

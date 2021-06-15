const rewrite = function (path) {
    return function (event) {
        if (!path)
            return;
        let oldReq = event.request;
        let redirectedUrl;
        try {
            let tmp = new URL(path);
            redirectedUrl = tmp;
        }
        catch (e) {
            let reqUrl = new URL(oldReq.url);
            let tmp = new URL(reqUrl.protocol + '//' + reqUrl.host + path + reqUrl.search);
            redirectedUrl = tmp;
        }
        let rewritedReq = new Event("fetch");
        let newReq = new Request(redirectedUrl.href, Object.assign({}, oldReq));
        rewritedReq.request = newReq;
        return rewritedReq;
    };
};
export default rewrite;

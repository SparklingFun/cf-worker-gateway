/**
 * Middleware - Rewrite
 * @param path Rewrite url path (will automatically try absolute or relative)
 * @returns Middleware handler
 */
const rewrite = function (path: string) {
    return function (event: FetchEvent) {
        if (!path) return;
        let oldReq = event.request;
        let redirectedUrl;
        try {
            let tmp = new URL(path);
            redirectedUrl = tmp;
        } catch(e) {
            let reqUrl = new URL(oldReq.url);
            let tmp = new URL(reqUrl.protocol + '//' + reqUrl.host + path);
            redirectedUrl = tmp;
            // if not correct, throw error.
        }
        let rewritedReq = new Event("fetch");
        let newReq = Object.assign({}, rewritedReq, {url: redirectedUrl.href});
        // @ts-ignore
        rewritedReq.request = newReq;
        return rewritedReq;
    }
}

export default rewrite;
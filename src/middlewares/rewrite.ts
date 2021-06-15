import * as PathToRegexp from "path-to-regexp";
const { match } = PathToRegexp;

/**
 * Middleware - Rewrite
 * @param path Rewrite url path (will automatically try absolute or relative)
 * @returns Middleware handler
 */
const rewrite = function (targetRegexp: string, topath: string) {
    return function (event: FetchEvent) {
        if (!topath || !targetRegexp) return;
        const isMatched = match(targetRegexp || "", { encode: encodeURI, decode: decodeURIComponent });
        let matchResult: boolean|Object = false;
        try {
            matchResult = isMatched(new URL(event.request.url).pathname);
        } catch(e) {}

        let oldReq = event.request;
        let redirectedUrl;
        try {
            let tmp = new URL(topath);
            redirectedUrl = tmp;
        } catch(e) {
            let reqUrl = new URL(oldReq.url);
            let tmp = new URL(reqUrl.protocol + '//' + reqUrl.host + topath);
            redirectedUrl = tmp;
            // if not correct, throw error.
        }
        let rewritedReq = new Event("fetch");
        let newReq = Object.assign({}, rewritedReq, {url: redirectedUrl.href});
        // @ts-ignore
        rewritedReq.request = newReq;
        if(matchResult) {
            // @ts-ignore
            rewritedReq.match = matchResult;
        }
        return rewritedReq;
    }
}

export default rewrite;
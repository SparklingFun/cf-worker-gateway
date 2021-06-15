import * as PathToRegexp from "path-to-regexp";
const { match } = PathToRegexp;
const rewrite = function (targetRegexp, topath) {
    return function (event) {
        if (!topath || !targetRegexp)
            return;
        const isMatched = match(targetRegexp || "", { encode: encodeURI, decode: decodeURIComponent });
        let matchResult = false;
        try {
            matchResult = isMatched(new URL(event.request.url).pathname);
        }
        catch (e) { }
        let oldReq = event.request;
        let redirectedUrl;
        try {
            let tmp = new URL(topath);
            redirectedUrl = tmp;
        }
        catch (e) {
            let reqUrl = new URL(oldReq.url);
            let tmp = new URL(reqUrl.protocol + '//' + reqUrl.host + topath);
            redirectedUrl = tmp;
        }
        let rewritedReq = new Event("fetch");
        let newReq = Object.assign({}, rewritedReq, { url: redirectedUrl.href });
        rewritedReq.request = newReq;
        if (matchResult) {
            rewritedReq.match = matchResult;
        }
        return rewritedReq;
    };
};
export default rewrite;

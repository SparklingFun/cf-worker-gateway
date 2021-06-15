// type import
import { Match } from "path-to-regexp";
interface MiddlewareFetchEvent extends Event {
    request?: Request;
    match?: Match;
}
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
            let tmp = new URL(reqUrl.protocol + '//' + reqUrl.host + path + reqUrl.search);
            redirectedUrl = tmp;
            // if not correct, throw error.
        }
        let rewritedReq: MiddlewareFetchEvent = new Event("fetch");
        let newReq = new Request(redirectedUrl.href, {
            ...oldReq
        })
        rewritedReq.request = newReq;
        return rewritedReq;
    }
}

export default rewrite;
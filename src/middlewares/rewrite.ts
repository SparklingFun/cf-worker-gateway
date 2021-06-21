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
    const oldReq = event.request;
    let redirectedUrl;
    try {
      const tmp = new URL(path);
      redirectedUrl = tmp;
    } catch (e) {
      const reqUrl = new URL(oldReq.url);
      const tmp = new URL(
        `${reqUrl.protocol}//${reqUrl.host}${path}${reqUrl.search}`
      );
      redirectedUrl = tmp;
      // if not correct, throw error.
    }
    const rewritedReq: MiddlewareFetchEvent = new Event("fetch");
    const newReq = new Request(redirectedUrl.href, {
      ...oldReq,
    });
    rewritedReq.request = newReq;
    return rewritedReq;
  };
};

export default rewrite;

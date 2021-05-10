import { _matchPath, _modifyEvent } from "../utils/utils";
import { GatewayRewrite, FetchEvent } from "../types";

// const rewrite = function (option: GatewayRewrite) {
//     return function (event: FetchEvent) {
//         // rules check
//         if (!option.rules) {
//             return;
//         }
//         if (!Array.isArray(option.rules)) {
//             console.log("[Gateway Error] `rewrites` config is not an Array! Continuous working in disabled mode.");
//             return;
//         }
//         if (!option.rules.length) {
//             return;
//         }
//         // check complete, start rewrite
//         let matched = option.rules.find(rule => {
//             // fill source url if `basePath`
//             const source = (option.basePath || "") + rule.source;
//             return _matchPath(event.request.url, source);
//         });
//         if (matched) {
//             // wrong config
//             if (!matched.destination) return;
//             let newEvt = _modifyEvent(event, {
//                 url: new URL(event.request.url).origin + (option.basePath || "") + matched.destination
//             })
//             // @ts-ignore
//             if(!newEvt.$$origin) newEvt.$$origin = event;
//             return newEvt;
//         }
//         // no rewrite rule matched
//         return;
//     }
// }

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
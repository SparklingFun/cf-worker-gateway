import { _matchPath, _modifyEvent } from "../utils/utils";
import { GatewayRedirect } from "../types";

// const redirect = function (option: GatewayRedirect) {
//     // middlewareWrapper = function (event, next) {
//     return function (event: FetchEvent) {
//         // exceptions
//         if (!option) {
//             return;
//         }
//         if (!Array.isArray(option.rules)) {
//             return;
//         }
//         if (option.rules.length < 1) {
//             return;
//         }
//         // logic
//         const matched = option.rules.find(rule => {
//             // fill source url if `basePath`
//             const source = (option.basePath || "") + rule.source;
//             return _matchPath(event.request.url, source);
//         });
//         if (matched) {
//             if (!matched.destination) {
//                 return;
//             }
//             let origin = new URL(event.request.url).origin;
//             let fullURL = false
//             try {
//                 new URL(matched.destination);
//                 fullURL = true;
//             } catch (e) {
//                 // console.log(e.message)
//             }
//             if (fullURL && option.basePath) {
//                 console.log('When basePath is configured, destination should not be a full URL!')
//                 return;
//             }
//             // @ts-ignore
//             return Response.redirect(fullURL ? matched.destination : origin + (option.basePath || "") + matched.destination, matched.permanent ? 308 : 307);
//         }
//         // if no match, use `next()` to skip.
//         return;
//     }
//     // return middlewareWrapper;
// }

const redirect = function (path: string, permanent: boolean|number) {
    return function (event: FetchEvent) {
        // exceptions
        if (!path) {
            return;
        }
        // try to recognize relative url or absolute url
        let redirectedUrl;
        try {
            let tmp = new URL(path);
            redirectedUrl = tmp;
        } catch(e) {
            let reqUrl = new URL(event.request.url);
            let tmp = new URL(reqUrl.protocol + '//' + reqUrl.host + path);
            redirectedUrl = tmp;
            // if not correct, throw error.
        }
        let status = typeof permanent === "number" ? permanent : (permanent ? 308 : 307);
        // @ts-ignore
        return Response.redirect(redirectedUrl.href, status);
    }
}

export default redirect;
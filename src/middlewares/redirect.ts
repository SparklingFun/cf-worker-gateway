import { _matchPath, _modifyEvent } from "../utils/utils";
import { CommonMiddleware, GatewayRedirect } from "../types";

const redirect = function (option: Array<GatewayRedirect>) {
    let middlewareWrapper: CommonMiddleware;
    // middlewareWrapper = function (event, next) {
        // @ts-ignore
    return function (event, next) {
        // exceptions
        if (!option) {
            next();
        }
        if (!Array.isArray(option)) {
            next();
        }
        if (option.length < 1) {
            next();
        }
        // logic
        const matched = option.find(rule => {
            // fill source url if `basePath`
            // const source = (option.basePath || "") + rule.source;
            const source = rule.source;
            return _matchPath(event.request.url, source);
        });
        if (matched) {
            if (!matched.destination) {
                next();
            }
            let origin = new URL(event.request.url).origin;
            let isCrossOrigin = false
            try {
                new URL(matched.destination);
                isCrossOrigin = true
            } catch (e) {
                // console.log(e.message)
            }
            // if (!matched.crossOrigin && isCrossOrigin) {
            //     console.log('Cross Origin redirect should be configured as `crossOrigin`')
            //     return;
            // }
            // @ts-ignore
            return Response.redirect(origin + matched.destination, matched.permanent ? 308 : 307);
        }
        // if no match, use `next()` to skip.
        next();
    }
    // return middlewareWrapper;
}

export default redirect;
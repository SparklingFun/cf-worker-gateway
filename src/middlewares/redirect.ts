import { _matchPath, _modifyEvent } from "../utils/utils";
import { GatewayRedirect } from "../types";

const redirect = function (option: GatewayRedirect) {
    // middlewareWrapper = function (event, next) {
    return function (event: FetchEvent, next: Function) {
        // exceptions
        if (!option) {
            next();
            return;
        }
        if (!Array.isArray(option.rules)) {
            next();
            return;
        }
        if (option.rules.length < 1) {
            next();
            return;
        }
        // logic
        const matched = option.rules.find(rule => {
            // fill source url if `basePath`
            const source = (option.basePath || "") + rule.source;
            return _matchPath(event.request.url, source);
        });
        if (matched) {
            if (!matched.destination) {
                next();
            }
            let origin = new URL(event.request.url).origin;
            let fullURL = false
            try {
                new URL(matched.destination);
                fullURL = true;
            } catch (e) {
                // console.log(e.message)
            }
            if (fullURL && option.basePath) {
                console.log('When basePath is configured, destination should not be a full URL!')
                return;
            }
            // @ts-ignore
            return Response.redirect(fullURL ? matched.destination : origin + (option.basePath || "") + matched.destination, matched.permanent ? 308 : 307);
        }
        // if no match, use `next()` to skip.
        next();
        return;
    }
    // return middlewareWrapper;
}

export default redirect;
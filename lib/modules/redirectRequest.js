import { _matchPath } from "../utils/utils";
export default function _redirectRequest(event, options) {
    if (!options.redirects)
        return;
    if (!Array.isArray(options.redirects)) {
        console.log("[Gateway Error] `redirects` config is not an Array! Continuous working in disabled mode.");
        return;
    }
    if (!options.redirects.length)
        return;
    let matched = options.redirects.find(rule => {
        const source = (options.basePath || "") + rule.source;
        return _matchPath(event.request.url, source);
    });
    if (matched) {
        if (!matched.destination)
            return;
        let origin = matched.crossOrigin ? '' : new URL(event.request.url).origin;
        return Response.redirect(origin + (options.basePath || "") + matched.destination, matched.permanent ? 308 : 307);
    }
    return;
}

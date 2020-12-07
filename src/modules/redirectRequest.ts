import { _matchPath, _modifyEvent } from "../utils/utils";
import { GatewayOption } from "../types";

export default function _redirectRequest(event: FetchEvent, options: GatewayOption): Response | undefined {
    // rules check
    if (!options.redirects) return;
    if (!Array.isArray(options.redirects)) {
        console.log("[Gateway Error] `redirects` config is not an Array! Continuous working in disabled mode.");
        return;
    }
    if (!options.redirects.length) return;
    // check complete, start rewrite
    let matched = options.redirects.find(rule => {
        // fill source url if `basePath`
        const source = (options.basePath || "") + rule.source;
        return _matchPath(event.request.url, source);
    });
    if (matched) {
        if (!matched.destination) return;
        let origin = new URL(event.request.url).origin;
        let isCrossOrigin = false
        try {
            new URL(matched.destination);
            isCrossOrigin = true
        } catch(e) {
            // console.log(e.message)
        }
        if(!matched.crossOrigin && isCrossOrigin) {
            console.log('Cross Origin redirect should be configured as `crossOrigin`')
            return;
        }
        // @ts-ignore
        return Response.redirect(matched.crossOrigin ? matched.destination : origin + (options.basePath || "") + matched.destination, matched.permanent ? 308 : 307);
    }
    // no rewrite rule matched
    return;
}
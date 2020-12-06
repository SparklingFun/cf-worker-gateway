import { _matchPath, _modifyEvent } from "../utils/utils";
import { GatewayOption, CustomFetchEvent } from "../types";

export default function _rewriteRequest(event: FetchEvent | CustomFetchEvent, options: GatewayOption): Event | undefined {
    // rules check
    if (!options.rewrites) return;
    if (!Array.isArray(options.rewrites)) {
        console.log("[Gateway Error] `rewrites` config is not an Array! Continuous working in disabled mode.");
        return;
    }
    if (!options.rewrites.length) return;
    // check complete, start rewrite
    let matched = options.rewrites.find(rule => {
        // fill source url if `basePath`
        const source = (options.basePath || "") + rule.source;
        return _matchPath(event.request.url, source);
    });
    if (matched) {
        // wrong config
        if (!matched.destination) return;
        let newEvt = _modifyEvent(event, {
            url: new URL(event.request.url).origin + (options.basePath || "") + matched.destination
        })
        return newEvt;
    }
    // no rewrite rule matched
    return;
}
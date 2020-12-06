import { _matchPath, _modifyEvent } from "../utils/utils";
export default function _rewriteRequest(event, options) {
    if (!options.rewrites)
        return;
    if (!Array.isArray(options.rewrites)) {
        console.log("[Gateway Error] `rewrites` config is not an Array! Continuous working in disabled mode.");
        return;
    }
    if (!options.rewrites.length)
        return;
    let matched = options.rewrites.find(rule => {
        const source = (options.basePath || "") + rule.source;
        return _matchPath(event.request.url, source);
    });
    if (matched) {
        if (!matched.destination)
            return;
        let newEvt = _modifyEvent(event, {
            url: new URL(event.request.url).origin + (options.basePath || "") + matched.destination
        });
        return newEvt;
    }
    return;
}

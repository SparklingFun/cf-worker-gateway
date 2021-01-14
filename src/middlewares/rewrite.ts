import { _matchPath, _modifyEvent } from "../utils/utils";
import { GatewayRewrite, FetchEvent } from "../types";

// TODO: Should we support rewrite to CrossDomain?
const rewrite = function (option: GatewayRewrite) {
    return function (event: FetchEvent) {
        // rules check
        if (!option.rules) {
            return;
        }
        if (!Array.isArray(option.rules)) {
            console.log("[Gateway Error] `rewrites` config is not an Array! Continuous working in disabled mode.");
            return;
        }
        if (!option.rules.length) {
            return;
        }
        // check complete, start rewrite
        let matched = option.rules.find(rule => {
            // fill source url if `basePath`
            const source = (option.basePath || "") + rule.source;
            return _matchPath(event.request.url, source);
        });
        if (matched) {
            // wrong config
            if (!matched.destination) return;
            let newEvt = _modifyEvent(event, {
                url: new URL(event.request.url).origin + (option.basePath || "") + matched.destination
            })
            // @ts-ignore
            if(!newEvt.$$origin) newEvt.$$origin = event;
            return newEvt;
        }
        // no rewrite rule matched
        return;
    }
}

export default rewrite;
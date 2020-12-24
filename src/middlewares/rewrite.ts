import { _matchPath, _modifyEvent } from "../utils/utils";
import { GatewayRewrite, FetchEvent } from "../types";

// TODO: Clearify option types
// TODO: Should we support rewrite to CrossDomain?
const rewrite = function (option: any) {
    return function (event: FetchEvent, next: Function) {
        // rules check
        if (!option.rules) next();
        if (!Array.isArray(option.rules)) {
            console.log("[Gateway Error] `rewrites` config is not an Array! Continuous working in disabled mode.");
            next();
        }
        if (!option.rules.length) next();
        // check complete, start rewrite
        // @ts-ignore
        let matched = option.rules.find(rule => {
            // fill source url if `basePath`
            const source = (option.basePath || "") + rule.source;
            return _matchPath(event.request.url, source);
        });
        if (matched) {
            // wrong config
            if (!matched.destination) next();
            let newEvt = _modifyEvent(event, {
                url: new URL(event.request.url).origin + (option.basePath || "") + matched.destination
            })
            next(newEvt);
        }
        // no rewrite rule matched
        next();
    }
}

export default rewrite;
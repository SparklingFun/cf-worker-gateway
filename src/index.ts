import { FetchEvent } from "./types";
// imported but not used, only for jest test.
import redirect from "./middlewares/redirect";
import rewrite from "./middlewares/rewrite";
import faviconByBase64 from "./deprecated/faviconByBase64";
import allowOption from "./helpers/allowOption";
import robotsTxt from "./helpers/robotsTxt";
import ipController from "./helpers/ipController";

const Gateway = function(event: FetchEvent): Function {
    // middlewares quene
    const fns: Array<Function> = [];
    let seizeResp: Response | undefined = undefined;
    // main executer
    // PS: it's a quene model, first `use`, first execute, first return when matched.
    const app = function(): Response | FetchEvent {
        let i = 0;
        let modified = event;
        function next(stdinEvent: FetchEvent) {
            if(stdinEvent !== event && stdinEvent) {
                modified = stdinEvent
            };
            let task = fns[i++];
            if (!task) {
                return;
            }
            let _t = task(stdinEvent || modified, next);
            if(_t && _t instanceof Response) seizeResp = _t;
        }
        next(modified);
        if (seizeResp && seizeResp instanceof Response) {
            return seizeResp;
        }
        return modified;
    }
    app.use = function(handler: Function): void {
        fns.push(handler);
    }
    return app;
}

export { redirect, rewrite, faviconByBase64, allowOption, robotsTxt, ipController };
export default Gateway;

import { FetchEvent } from "./types";
// imported but not used, only for jest test.
import redirect from "./middlewares/redirect";
import rewrite from "./middlewares/rewrite";
import faviconByBase64 from "./deprecated/faviconByBase64";
import allowOption from "./helpers/allowOption";
import robotsTxt from "./helpers/robotsTxt";
import ipController from "./helpers/ipController";
import basicAuth from "./helpers/basicAuth";

const Gateway = function (event: FetchEvent): Function {
    // middlewares quene
    const fns: Array<Function> = [];
    // main executer
    // PS: it's a quene model, first `use`, first execute, first return when matched.
    const app = function () {
        // let i = 0;
        // let modified = event;
        // async function next(stdinEvent: FetchEvent) {
        //     if(stdinEvent !== event && stdinEvent) {
        //         modified = stdinEvent
        //     };
        //     let task = fns[i++];
        //     if (!task) {
        //         return;
        //     }
        //     let _t = task(stdinEvent || modified, next);
        //     if(_t && _t instanceof Response) seizeResp = _t;
        // }
        // await next(modified);
        // if (seizeResp && seizeResp instanceof Response) {
        //     return seizeResp;
        // }
        // return modified;
    }

    app.use = function (handler: Function): void {
        fns.push(handler);
    }
    app.run = async function (): Promise<Response> {
        try {
            let respond;
            let modified = event;
            for (let i = 0; i < fns.length; i++) {
                let result = await fns[i](modified);
                if (result instanceof Response) {
                    respond = result;
                    return respond;
                } else {
                    if (result !== undefined) {
                        modified = result;
                    }
                }
            }
            return new Response(null, {
                status: 404,
                statusText: "Not Found"
            })
        } catch (e) {
            return new Response("Worker Error: " + e.message, {
                status: 500
            })
        }
    }
    return app;
}

// Only for jest testing, not recommand to use directly from index.
export { redirect, rewrite, faviconByBase64, allowOption, robotsTxt, ipController, basicAuth };
export default Gateway;

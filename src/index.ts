import { FetchEvent } from "./types";
// imported but not used, only for jest test.
import redirect from "./middlewares/redirect";
import rewrite from "./middlewares/rewrite";
import interceptor from "./middlewares/interceptor";
import faviconByBase64 from "./deprecated/faviconByBase64";
import allowOption from "./helpers/allowOption";
import robotsTxt from "./helpers/robotsTxt";
import ipController from "./helpers/ipController";
import accessRateLimit from "./helpers/accessRateLimit";
import basicAuth from "./helpers/basicAuth";

const Gateway = function (event: FetchEvent): Function {
    // middlewares quene
    const fns: Array<Function> = [];
    // main executer
    // PS: it's a quene model, first `use`, first execute, first return when matched.
    const app = function () {}
    app.use = function (handler: Function): void {
        fns.push(handler);
    }
    app.run = async function (fn ?: Function): Promise<Response> {
        if(typeof fn !== 'function') {
            fn = function(res: Response): Response {
                return res;
            }
        }
        try {
            let respond;
            let modified = event;
            for (let i = 0; i < fns.length; i++) {
                let result = await fns[i](modified);
                if (result instanceof Response) {
                    respond = result;
                    break;
                } else {
                    if (result !== undefined) {
                        modified = result;
                    }
                }
            }
            if(respond && respond instanceof Response) {
                return await fn(respond)
            } else {
                return await fn(new Response(null, {
                    status: 404,
                    statusText: "Not Found"
                }))
            }
        } catch (e) {
            return await fn(new Response("Worker Error: " + e.message, {
                status: 500
            }))
        }
    }
    return app;
}

// Only for jest testing, not recommand to use directly from index.
export { redirect, rewrite, faviconByBase64, allowOption, robotsTxt, ipController, accessRateLimit, basicAuth, interceptor };
export default Gateway;

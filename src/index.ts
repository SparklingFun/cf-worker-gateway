import * as PathToRegexp from "path-to-regexp";
// imported but not used, only for jest test & convient import.
import redirect from "./middlewares/redirect";
import rewrite from "./middlewares/rewrite";
import faviconByBase64 from "./deprecated/faviconByBase64";
import cors from "./helpers/cors";
import robotsTxt from "./helpers/robotsTxt";
import basicAuth from "./helpers/basicAuth";
// type import
import { Match } from "path-to-regexp";

interface FetchEvent extends Event {
    request: Request;
    respondWith(response: Promise<Response> | Response): Promise<Response>;
    match?: Match;
}
interface MiddlewareHandlerBundle {
    default: Function|Promise<Function>
    callback?: Function|Promise<Function>
}

const { match } = PathToRegexp;

const WorkerScaffold = function (event: FetchEvent, isDev: boolean=false): Function {
    // middlewares quene
    const fns: Array<Function|Promise<Function>|MiddlewareHandlerBundle> = [];
    // main executer (it's a quene model, first `use`, first execute, first return when matched)
    const app = function () {}
    let matched: Match;

    /**
     * Declare middleware handler and its path, handlers will automatically execute in serial.
     * @param path Matched path for URL, see also {@link https://github.com/pillarjs/path-to-regexp}
     * @param handler Middleware handler function or object which contains `default` & `callback`
     */
    app.use = function (path: string|undefined, handler?: Function|MiddlewareHandlerBundle): void {
        if((typeof path === "function" || typeof path === "object") && typeof handler === "undefined") {
            handler = path;
            path = undefined;
        }

        const isMatched = match(path || "", { encode: encodeURI, decode: decodeURIComponent });
        let matchResult: Match = false;
        try {
            matchResult = isMatched(new URL(event.request.url).pathname);
        } catch(e) {}
        if((path === undefined || matchResult) && handler) {
            if(matchResult) {
                matched = matchResult;
            }
            fns.push(handler);
        }
    }
    /**
     * A bundle of alias functions of `app.use`
     * @returns app.use function
     */
    app.get = function (path: string|undefined, handler?: Function|MiddlewareHandlerBundle): void|Function {
        if(event.request.method.toLowerCase() !== "get") return;
        return app.use(path, handler);
    }
    app.post = function (path: string|undefined, handler?: Function|MiddlewareHandlerBundle): void|Function {
        if(event.request.method.toLowerCase() !== "post") return;
        return app.use(path, handler);
    }
    app.head = function (path: string|undefined, handler?: Function|MiddlewareHandlerBundle): void|Function {
        if(event.request.method.toLowerCase() !== "head") return;
        return app.use(path, handler);
    }
    app.put = function (path: string|undefined, handler?: Function|MiddlewareHandlerBundle): void|Function {
        if(event.request.method.toLowerCase() !== "put") return;
        return app.use(path, handler);
    }
    app.delete = function (path: string|undefined, handler?: Function|MiddlewareHandlerBundle): void|Function {
        if(event.request.method.toLowerCase() !== "delete") return;
        return app.use(path, handler);
    }
    app.options = function (path: string|undefined, handler?: Function|MiddlewareHandlerBundle): void|Function {
        if(event.request.method.toLowerCase() !== "options") return;
        return app.use(path, handler);
    }


    /**
     * Generate response for `event.respondWith`
     * @returns Expected response which is generated through multiple middlewares
     */
    app.run = async function (): Promise<Response> {
        try {
            let respond;
            let modified = event;
            for (let i = 0; i < fns.length; i++) {
                // An Typescript issue which needs an ignore, same below {@link https://github.com/microsoft/TypeScript/issues/37663}
                // @ts-ignore
                let result = typeof fns[i] === "function" ? await fns[i](modified) : await fns[i].default(modified);
                if (result instanceof Response) {
                    respond = result;
                    break;
                } else {
                    if (result !== undefined) {
                        modified = result;
                        modified.match = matched;
                    }
                }
            }
            if(!respond || !(respond instanceof Response)) respond = new Response(null, {status: 404})
            for (let i = 0; i < fns.length; i++) {
                // @ts-ignore
                if(fns[i].callback && typeof fns[i].callback === "function") {
                    // @ts-ignore
                    respond = await fns[i].callback(event, respond);
                }
            }
            return respond;
        } catch (e) {
            if(isDev) return new Response("Worker Error: " + e.message, {
                status: 500
            })
            return new Response("Worker Execution failed.", {
                status: 500
            })
        }
    }
    return app;
}

// Only for jest testing, not recommand to use directly from index.
export { redirect, rewrite, faviconByBase64, cors, robotsTxt, basicAuth };
export default WorkerScaffold;

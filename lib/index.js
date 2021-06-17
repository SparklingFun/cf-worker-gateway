var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as PathToRegexp from "path-to-regexp";
import redirect from "./middlewares/redirect";
import rewrite from "./middlewares/rewrite";
import faviconByBase64 from "./deprecated/faviconByBase64";
import cors from "./helpers/cors";
import robotsTxt from "./helpers/robotsTxt";
import basicAuth from "./helpers/basicAuth";
const { match } = PathToRegexp;
const WorkerScaffold = function (event, isDev = false) {
    const fns = [];
    const app = function () { };
    let matched;
    app.use = function (path, handler) {
        if ((typeof path === "function" || typeof path === "object") &&
            typeof handler === "undefined") {
            handler = path;
            path = undefined;
        }
        const isMatched = match(path || "", {
            encode: encodeURI,
            decode: decodeURIComponent,
        });
        let matchResult = false;
        try {
            matchResult = isMatched(new URL(event.request.url).pathname);
        }
        catch (e) { }
        if ((path === undefined || matchResult) && handler) {
            if (matchResult) {
                matched = matchResult;
            }
            fns.push(handler);
        }
    };
    app.get = function (path, handler) {
        if (event.request.method.toLowerCase() !== "get")
            return;
        return app.use(path, handler);
    };
    app.post = function (path, handler) {
        if (event.request.method.toLowerCase() !== "post")
            return;
        return app.use(path, handler);
    };
    app.head = function (path, handler) {
        if (event.request.method.toLowerCase() !== "head")
            return;
        return app.use(path, handler);
    };
    app.put = function (path, handler) {
        if (event.request.method.toLowerCase() !== "put")
            return;
        return app.use(path, handler);
    };
    app.delete = function (path, handler) {
        if (event.request.method.toLowerCase() !== "delete")
            return;
        return app.use(path, handler);
    };
    app.options = function (path, handler) {
        if (event.request.method.toLowerCase() !== "options")
            return;
        return app.use(path, handler);
    };
    app.run = function () {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let respond;
                let modified = event;
                for (let i = 0; i < fns.length; i++) {
                    let result = typeof fns[i] === "function"
                        ?
                            yield fns[i](modified)
                        :
                            yield fns[i].default(modified);
                    if (result instanceof Response) {
                        respond = result;
                        break;
                    }
                    else {
                        if (result !== undefined) {
                            modified = result;
                            modified.match = matched;
                        }
                    }
                }
                if (!respond || !(respond instanceof Response))
                    respond = new Response(null, { status: 404 });
                for (let i = 0; i < fns.length; i++) {
                    if (fns[i].callback && typeof fns[i].callback === "function") {
                        respond = yield fns[i].callback(event, respond);
                    }
                }
                return respond;
            }
            catch (e) {
                if (isDev)
                    return new Response("Worker Error: " + e.message, {
                        status: 500,
                    });
                return new Response("Worker Execution failed.", {
                    status: 500,
                });
            }
        });
    };
    return app;
};
export { redirect, rewrite, faviconByBase64, cors, robotsTxt, basicAuth };
export default WorkerScaffold;

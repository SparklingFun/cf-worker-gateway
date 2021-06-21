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
class WorkerScaffold {
    constructor(event, isDev) {
        this.isDev = false;
        this.fns = [];
        this.matched = false;
        this.event = event;
        this.isDev = isDev || false;
    }
    errorHandler(_error) { }
    use(path, handler) {
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
            matchResult = isMatched(new URL(this.event.request.url).pathname);
        }
        catch (e) {
            if (this.isDev)
                throw new Error(e);
            return;
        }
        if ((path === undefined || matchResult) && handler) {
            if (matchResult) {
                this.matched = matchResult;
            }
            this.fns.push(handler);
        }
    }
    get(path, handler) {
        if (this.event.request.method.toLowerCase() !== "get")
            return;
        return this.use(path, handler);
    }
    post(path, handler) {
        if (this.event.request.method.toLowerCase() !== "post")
            return;
        return this.use(path, handler);
    }
    head(path, handler) {
        if (this.event.request.method.toLowerCase() !== "head")
            return;
        return this.use(path, handler);
    }
    put(path, handler) {
        if (this.event.request.method.toLowerCase() !== "put")
            return;
        return this.use(path, handler);
    }
    delete(path, handler) {
        if (this.event.request.method.toLowerCase() !== "delete")
            return;
        return this.use(path, handler);
    }
    options(path, handler) {
        if (this.event.request.method.toLowerCase() !== "options")
            return;
        return this.use(path, handler);
    }
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let respond;
                let modified = this.event;
                for (let i = 0; i < this.fns.length; i += 1) {
                    const result = typeof this.fns[i] === "function"
                        ?
                            yield this.fns[i](modified)
                        :
                            yield this.fns[i].default(modified);
                    if (result instanceof Response) {
                        respond = result;
                        break;
                    }
                    else if (result !== undefined) {
                        modified = result;
                        modified.match = this.matched;
                    }
                }
                if (!respond || !(respond instanceof Response))
                    respond = new Response(null, { status: 404 });
                for (let i = 0; i < this.fns.length; i += 1) {
                    if (this.fns[i].callback &&
                        typeof this.fns[i].callback === "function") {
                        respond = yield this.fns[i].callback(this.event, respond);
                    }
                }
                return respond;
            }
            catch (e) {
                if (this.errorHandler && typeof this.errorHandler === "function") {
                    this.errorHandler(e);
                }
                if (this.isDev) {
                    return new Response(`Worker Error: ${e.message}`, {
                        status: 500,
                    });
                }
                return new Response("Worker Execution failed.", {
                    status: 500,
                });
            }
        });
    }
}
export { redirect, rewrite, faviconByBase64, cors, robotsTxt, basicAuth };
export default WorkerScaffold;

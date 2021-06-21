import { Match } from "path-to-regexp";
import redirect from "./middlewares/redirect";
import rewrite from "./middlewares/rewrite";
import faviconByBase64 from "./deprecated/faviconByBase64";
import cors from "./helpers/cors";
import robotsTxt from "./helpers/robotsTxt";
import basicAuth from "./helpers/basicAuth";
interface FetchEvent extends Event {
    request: Request;
    respondWith(response: Promise<Response> | Response): Promise<Response>;
    match?: Match;
}
interface MiddlewareHandlerBundle {
    default: Function | Promise<Function>;
    callback?: Function | Promise<Function>;
}
declare class WorkerScaffold {
    private event;
    private isDev;
    private fns;
    private matched;
    constructor(event: FetchEvent, isDev?: boolean);
    static errorHandler(_error: Error): void;
    use(path: string | undefined, handler?: Function | MiddlewareHandlerBundle): void;
    get(path: string | undefined, handler?: Function | MiddlewareHandlerBundle): void | Function;
    post(path: string | undefined, handler?: Function | MiddlewareHandlerBundle): void | Function;
    head(path: string | undefined, handler?: Function | MiddlewareHandlerBundle): void | Function;
    put(path: string | undefined, handler?: Function | MiddlewareHandlerBundle): void | Function;
    delete(path: string | undefined, handler?: Function | MiddlewareHandlerBundle): void | Function;
    options(path: string | undefined, handler?: Function | MiddlewareHandlerBundle): void | Function;
    run(): Promise<Response>;
}
export { redirect, rewrite, faviconByBase64, cors, robotsTxt, basicAuth };
export default WorkerScaffold;

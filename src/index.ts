import * as PathToRegexp from "path-to-regexp";
// imported but not used, only for jest test & convient import.
import { Match } from "path-to-regexp";
import redirect from "./middlewares/redirect";
import rewrite from "./middlewares/rewrite";
import faviconByBase64 from "./deprecated/faviconByBase64";
import cors from "./helpers/cors";
import robotsTxt from "./helpers/robotsTxt";
import basicAuth from "./helpers/basicAuth";

interface FetchEvent extends Event {
  request: Request;
  // eslint-disable-next-line
  respondWith(response: Promise<Response> | Response): Promise<Response>;
  match?: Match;
}
interface MiddlewareHandlerBundle {
  default: Function | Promise<Function>;
  callback?: Function | Promise<Function>;
}

const { match } = PathToRegexp;

class WorkerScaffold {
  // internal members;
  private event: FetchEvent;
  private isDev: boolean = false;
  private fns: Array<Function | Promise<Function> | MiddlewareHandlerBundle> =
    [];
  private matched: Match = false;
  constructor(event: FetchEvent, isDev?: boolean) {
    this.event = event;
    this.isDev = isDev || false;
  }
  // public configurations
  public errorHandler(_error: Error) {}
  // public members
  public use(
    path: string | undefined,
    handler?: Function | MiddlewareHandlerBundle
  ): void {
    if (
      (typeof path === "function" || typeof path === "object") &&
      typeof handler === "undefined"
    ) {
      handler = path;
      path = undefined;
    }

    const isMatched = match(path || "", {
      encode: encodeURI,
      decode: decodeURIComponent,
    });
    let matchResult: Match = false;
    try {
      matchResult = isMatched(new URL(this.event.request.url).pathname);
    } catch (e) {
      if (this.isDev) throw new Error(e);
      return;
    }
    if ((path === undefined || matchResult) && handler) {
      if (matchResult) {
        this.matched = matchResult;
      }
      this.fns.push(handler);
    }
  }
  /**
   * A bundle of alias functions of `app.use`
   * @returns app.use function
   */
  get(
    path: string | undefined,
    handler?: Function | MiddlewareHandlerBundle
  ): void | Function {
    if (this.event.request.method.toLowerCase() !== "get") return;
    return this.use(path, handler);
  }
  post(
    path: string | undefined,
    handler?: Function | MiddlewareHandlerBundle
  ): void | Function {
    if (this.event.request.method.toLowerCase() !== "post") return;
    return this.use(path, handler);
  }
  head(
    path: string | undefined,
    handler?: Function | MiddlewareHandlerBundle
  ): void | Function {
    if (this.event.request.method.toLowerCase() !== "head") return;
    return this.use(path, handler);
  }
  put(
    path: string | undefined,
    handler?: Function | MiddlewareHandlerBundle
  ): void | Function {
    if (this.event.request.method.toLowerCase() !== "put") return;
    return this.use(path, handler);
  }
  delete(
    path: string | undefined,
    handler?: Function | MiddlewareHandlerBundle
  ): void | Function {
    if (this.event.request.method.toLowerCase() !== "delete") return;
    return this.use(path, handler);
  }
  options(
    path: string | undefined,
    handler?: Function | MiddlewareHandlerBundle
  ): void | Function {
    if (this.event.request.method.toLowerCase() !== "options") return;
    return this.use(path, handler);
  }
  /**
   * Generate response for `event.respondWith`
   * @returns Expected response which is generated through multiple middlewares
   */
  async run(): Promise<Response> {
    try {
      let respond;
      let modified = this.event;
      /* eslint-disable no-await-in-loop */
      for (let i = 0; i < this.fns.length; i += 1) {
        // An Typescript issue which needs an ignore, same below {@link https://github.com/microsoft/TypeScript/issues/37663}
        const result =
          typeof this.fns[i] === "function"
            ? // @ts-ignore
              await this.fns[i](modified)
            : // @ts-ignore
              await this.fns[i].default(modified);
        if (result instanceof Response) {
          respond = result;
          break;
        } else if (result !== undefined) {
          modified = result;
          modified.match = this.matched;
        }
      }
      if (!respond || !(respond instanceof Response))
        respond = new Response(null, { status: 404 });
      for (let i = 0; i < this.fns.length; i += 1) {
        // @ts-ignore
        if (
          this.fns[i].callback &&
          typeof this.fns[i].callback === "function"
        ) {
          // @ts-ignore
          respond = await this.fns[i].callback(this.event, respond);
        }
      }
      /* eslint-enable no-await-in-loop */
      return respond;
    } catch (e) {
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
  }
}

// Export shortcuts for easier usage
export { redirect, rewrite, faviconByBase64, cors, robotsTxt, basicAuth };
export default WorkerScaffold;

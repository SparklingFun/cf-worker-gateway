"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const glob_to_regexp_1 = __importDefault(require("glob-to-regexp"));
// interface Request extends Body {
// 	new(url: string, init?: {
//     method?: string,
//     url?: string,
//     referrer?: string,
//     mode?: 'cors'|'no-cors'|'same-origin'|'navigate',
//     credentials?: 'omit'|'same-origin'|'include',
//     redirect?: 'follow'|'error'|'manual',
//     integrity?: string,
//     cache?: 'default'|'no-store'|'reload'|'no-cache'|'force-cache'
//     headers?: Headers
// 	}): Request;
// 	cache: RequestCache;
// 	credentials: RequestCredentials;
// 	headers: Headers;
// 	integrity: string;
// 	method: string;
// 	mode: RequestMode;
// 	referrer: string;
// 	referrerPolicy: ReferrerPolicy;
// 	redirect: RequestRedirect;
// 	url: string;
// 	clone(): Request;
// }
// interface Response extends Body {
// 	new(url: string): Response;
// 	new(body: Blob|BufferSource|FormData|String, init: {
// 		status?: number,
// 		statusText?: string,
// 		headers?: (Headers|{ [k: string]: string })
// 	}): Response;
// 	headers: Headers;
// 	ok: boolean;
// 	redirected: boolean;
// 	status: number;
// 	statusText: string;
// 	type: ResponseType;
// 	url: string;
// 	useFinalURL: boolean;
// 	clone(): Response;
// 	error(): Response;
// 	redirect(): Response;
// }
function _modifyEvent(event, modifiedReq) {
    let _req = event.request.clone();
    let newReq = Object.assign({}, _req, modifiedReq);
    let _evt = new Event("fetch");
    // @ts-ignore
    _evt.request = newReq;
    return _evt;
}
function _matchPath(urlString, target) {
    let url;
    try {
        url = new URL(urlString);
    }
    catch (e) {
        console.log("[Gateway Error] Request URL '" + urlString + "': Invalid URL.");
        return false;
    }
    let re = glob_to_regexp_1.default(target);
    return re.test(url.pathname);
}
function _rewriteRequest(event, options) {
    // rules check
    if (!options.rewrites)
        return;
    if (!Array.isArray(options.rewrites)) {
        console.log("[Gateway Error] `rewrites` config is not an Array! Continuous working in disabled mode.");
        return;
    }
    if (!options.rewrites.length)
        return;
    // check complete, start rewrite
    let matched = options.rewrites.find(rule => _matchPath(event.request.url, rule.source));
    if (matched) {
        let newEvt = _modifyEvent(event, {
            url: new URL(event.request.url).origin + matched.destination
        });
        return newEvt;
    }
    // no rewrite rule matched
    return;
}
function _redirectRequest(event, options, helpers) {
    let Response;
    if (!Response) {
        if (helpers && helpers.Response) {
            Response = helpers.Response;
        }
        else {
            throw new Error("[Gateway Error] Runtime miss `Response`, Helpers are not available!");
        }
    }
    // rules check
    if (!options.redirects)
        return;
    if (!Array.isArray(options.redirects)) {
        console.log("[Gateway Error] `redirects` config is not an Array! Continuous working in disabled mode.");
        return;
    }
    if (!options.redirects.length)
        return;
    // check complete, start rewrite
    let matched = options.redirects.find(rule => _matchPath(event.request.url, rule.source));
    if (matched) {
        let origin = new URL(event.request.url).origin;
        // @ts-ignore
        return Response.redirect(origin + matched.destination, matched.permanent ? 308 : 307);
    }
    // no rewrite rule matched
    return;
}
function gateway(event, options, helpers) {
    let Response;
    if (!Response) {
        console.log("[Gateway Warning] Runtime miss `Response`, trying to use `helper.Response`...");
        if (helpers && helpers.Response) {
            Response = helpers.Response;
        }
        else {
            throw new Error("[Gateway Error] Runtime miss `Response`, Helpers are not available!");
        }
    }
    // rewrite always has a higher priority.
    let _evt = _rewriteRequest(event, options);
    if (_evt)
        return _evt;
    // if no rewrite rule matched, check redirect.
    let _redirectResp = _redirectRequest(event, options, helpers);
    if (_redirectResp) {
        return _redirectResp;
    }
    // all rules passed, return origin event
    return event;
}
exports.default = gateway;

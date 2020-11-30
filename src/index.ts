import globToRegExp from "glob-to-regexp";

interface GatewayRewrite {
    source: string;
    destination: string;
    basePath?: boolean;
}

interface GatewayRedirect {
    source: string;
    destination: string;
    permanent?: boolean;
    basePath?: boolean;
}

interface GatewayOption {
    rewrites?: Array<GatewayRewrite>,
    redirects?: Array<GatewayRedirect>
}

interface FetchEvent extends Event {
	request: Request;
	respondWith(response: Promise<Response>|Response): Promise<Response>;
}

function _modifyEvent(event: FetchEvent, modifiedReq: Object) {
    let _req = event.request.clone();
    let newReq = Object.assign({}, _req, modifiedReq)
    let _evt = new Event("fetch");
    // @ts-ignore
    _evt.request = newReq;
    return _evt;
}

function _matchPath(urlString: string, target: string) {
    let url;
    try {
        url = new URL(urlString);
    } catch (e) {
        console.log("[Gateway Error] Request URL '" + urlString + "': Invalid URL.");
        return false;
    }
    let re = globToRegExp(target);
    return re.test(url.pathname);
}

function _rewriteRequest(event: FetchEvent, options: GatewayOption) {
    // rules check
    if(!options.rewrites) return;
    if(!Array.isArray(options.rewrites)) {
        console.log("[Gateway Error] `rewrites` config is not an Array! Continuous working in disabled mode.");
        return;
    }
    if(!options.rewrites.length) return;
    // check complete, start rewrite
    let matched = options.rewrites.find(rule => _matchPath(event.request.url, rule.source));
    if(matched) {
        let newEvt = _modifyEvent(event, {
            url: new URL(event.request.url).origin + matched.destination
        })
        return newEvt;
    }
    // no rewrite rule matched
    return;
}

function _redirectRequest(event: FetchEvent, options: GatewayOption) {
    // rules check
    if(!options.redirects) return;
    if(!Array.isArray(options.redirects)) {
        console.log("[Gateway Error] `redirects` config is not an Array! Continuous working in disabled mode.");
        return;
    }
    if(!options.redirects.length) return;
    // check complete, start rewrite
    let matched = options.redirects.find(rule => _matchPath(event.request.url, rule.source));
    if(matched) {
        let origin = new URL(event.request.url).origin;
        return Response.redirect(origin + matched.destination, matched.permanent ? 308 : 307);
    }
    // no rewrite rule matched
    return;
}

export default function gateway(event: FetchEvent, options: GatewayOption) {
    // rewrite always has a higher priority.
    let _evt = _rewriteRequest(event, options);
    if(_evt) return _evt;
    // if no rewrite rule matched, check redirect.
    let _redirectResp = _redirectRequest(event, options);
    if(_redirectResp && _redirectResp instanceof Response) {
        event.respondWith(_redirectResp);
        return;
    }
    // all rules passed, return origin event
    return event;
}
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const glob_to_regexp_1 = __importDefault(require("glob-to-regexp"));
function _modifyEvent(event, modifiedReq) {
    let _req = event.request.clone();
    let newReq = Object.assign({}, _req, modifiedReq);
    let _evt = new Event("fetch");
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
    if (!options.rewrites)
        return;
    if (!Array.isArray(options.rewrites)) {
        console.log("[Gateway Error] `rewrites` config is not an Array! Continuous working in disabled mode.");
        return;
    }
    if (!options.rewrites.length)
        return;
    let matched = options.rewrites.find(rule => {
        const source = (options.basePath || "") + rule.source;
        return _matchPath(event.request.url, source);
    });
    if (matched) {
        if (!matched.destination)
            return;
        let newEvt = _modifyEvent(event, {
            url: new URL(event.request.url).origin + (options.basePath || "") + matched.destination
        });
        return newEvt;
    }
    return;
}
function _redirectRequest(event, options) {
    if (!options.redirects)
        return;
    if (!Array.isArray(options.redirects)) {
        console.log("[Gateway Error] `redirects` config is not an Array! Continuous working in disabled mode.");
        return;
    }
    if (!options.redirects.length)
        return;
    let matched = options.redirects.find(rule => {
        const source = (options.basePath || "") + rule.source;
        return _matchPath(event.request.url, source);
    });
    if (matched) {
        if (!matched.destination)
            return;
        let origin = new URL(event.request.url).origin;
        return this ? this.Response.redirect(origin + (options.basePath || "") + matched.destination, matched.permanent ? 308 : 307) : Response.redirect(origin + (options.basePath || "") + matched.destination, matched.permanent ? 308 : 307);
    }
    return;
}
function gateway(event, options) {
    let _evt = _rewriteRequest(event, options);
    if (_evt) {
        _evt.$$origin = event;
        return _evt;
    }
    let _redirectResp = _redirectRequest.call(this, event, options);
    if (_redirectResp) {
        return _redirectResp;
    }
    return event;
}
exports.default = gateway;

import globToRegExp from "glob-to-regexp";
import { CustomFetchEvent } from "../types";

export function _matchPath(urlString: string, target: string): Boolean {
    let url;
    try {
        url = new URL(urlString);
    } catch (e) {
        console.log("[Gateway Error] Request URL '" + urlString + "': Invalid URL.");
        return false;
    }
    let re = globToRegExp(target, {globstar: true});
    return re.test(url.pathname);
}

export function _modifyEvent(event: FetchEvent | CustomFetchEvent, modifiedReq: Object): FetchEvent {
    // let _req = event.request.clone();
    let _req = event.request;
    let newReq = Object.assign({}, _req, modifiedReq);
    let _evt = new Event("fetch");
    // @ts-ignore
    _evt.request = newReq;
    // @ts-ignore
    return _evt;
}

export function cfRealIp(event: FetchEvent): string {
    return event.request.headers.get("CF-Connecting-IP") || "";
}
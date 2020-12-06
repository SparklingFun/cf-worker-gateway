import globToRegExp from "glob-to-regexp";
export function _matchPath(urlString, target) {
    let url;
    try {
        url = new URL(urlString);
    }
    catch (e) {
        console.log("[Gateway Error] Request URL '" + urlString + "': Invalid URL.");
        return false;
    }
    let re = globToRegExp(target);
    return re.test(url.pathname);
}
export function _modifyEvent(event, modifiedReq) {
    let _req = event.request.clone();
    let newReq = Object.assign({}, _req, modifiedReq);
    let _evt = new Event("fetch");
    _evt.request = newReq;
    return _evt;
}

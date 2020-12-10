import _redirectRequest from "./modules/redirectRequest";
import _rewriteRequest from "./modules/rewriteRequest";
import { robotsHandler } from "./modules/robotsHandler";
import { CustomFetchEvent, GatewayOption } from "./types";

function gateway(event: CustomFetchEvent, options: GatewayOption): Response | CustomFetchEvent {
    if (options.allowOptionRequest) {
        if (event.request.method === 'OPTIONS') {
            // @ts-ignore
            let headerObj = Object.fromEntries(event.request.headers);
            return new Response('', {
                status: 204,
                headers: new Headers({
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': headerObj['access-control-request-headers'] || ''
                })
            })
        }
    }
    // helper option
    if (options.faviconBase64) {
        if (event.request.method === 'GET' && event.request.url.endsWith('/favicon.ico')) {
            const buffer = Buffer.alloc(35)
            buffer.write(options.faviconBase64, 'base64')
            return new Response(buffer, {
                headers: {
                    'Content-Type': 'image/x-icon'
                }
            })
        }
    }
    // rewrite always has a higher priority
    let _evt = _rewriteRequest(event, options);
    if (_evt) {
        // @ts-ignore
        _evt.$$origin = event;
        // @ts-ignore
        return _evt;
    }
    // if no rewrite rule matched, check redirect
    // @ts-ignore
    let _redirectResp = _redirectRequest.call(this, event, options);
    if (_redirectResp) {
        return _redirectResp;
    }
    // all rules passed, return origin event
    return event;
}

export { robotsHandler, gateway };
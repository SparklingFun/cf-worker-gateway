import _redirectRequest from "./modules/redirectRequest";
import _rewriteRequest from "./modules/rewriteRequest";
import { robotsHandler } from "./modules/robotsHandler";
function gateway(event, options) {
    if (options.allowOptionRequest) {
        if (event.request.method === 'OPTIONS') {
            let headerObj = Object.fromEntries(event.request.headers);
            return new Response('', {
                status: 200,
                headers: new Headers({
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': headerObj['access-control-request-headers'] || ''
                })
            });
        }
    }
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
export { robotsHandler, gateway };

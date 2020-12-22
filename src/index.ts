import { FetchEvent } from "./types";
import redirect from "./middlewares/redirect";

// function gateway(event: CustomFetchEvent, options: GatewayOption): Response | CustomFetchEvent {
//     if (options.allowOptionRequest) {
//         if (event.request.method === 'OPTIONS') {
//             // @ts-ignore
//             let headerObj = Object.fromEntries(event.request.headers);
//             return new Response('', {
//                 status: 204,
//                 headers: new Headers({
//                     'Access-Control-Allow-Origin': '*',
//                     'Access-Control-Allow-Headers': headerObj['access-control-request-headers'] || ''
//                 })
//             })
//         }
//     }
//     // helper option faviconBase64 (NOT RECOMMAND)
//     if (options.faviconBase64) {
//         if (event.request.method === 'GET' && event.request.url.endsWith('/favicon.ico')) {
//             // you can ignore all request of `favicon.ico`
//             if (options.faviconBase64 === 'ignored') {
//                 return new Response(undefined, {
//                     status: 204
//                 })
//             }
//             const buffer = Buffer.from(options.faviconBase64, 'base64');
//             return new Response(buffer, {
//                 headers: {
//                     'Content-Type': 'image/x-icon'
//                 }
//             })
//         }
//     }
//     // rewrite always has a higher priority
//     let _evt = _rewriteRequest(event, options);
//     if (_evt) {
//         // @ts-ignore
//         _evt.$$origin = event;
//         // @ts-ignore
//         return _evt;
//     }
//     // if no rewrite rule matched, check redirect
//     // @ts-ignore
//     let _redirectResp = _redirectRequest.call(this, event, options);
//     if (_redirectResp) {
//         return _redirectResp;
//     }
//     // all rules passed, return origin event
//     return event;
// }

// export { robotsHandler, gateway };

const Gateway = function(event: FetchEvent): Function {
    // middlewares quene
    const fns: Array<Function> = [];
    // main executer
    const app = function(): void {
        let i = 0;
        function next() {
            let task = fns[i++];
            if (!task) {
                return;
            }
            return task(event, next);
        }
        return next();
    }
    app.use = function(handler: Function): void {
        fns.push(handler);
    }
    return app;
}

export { redirect };
export default Gateway;

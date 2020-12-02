interface GatewayRewrite {
    source: string;
    destination: string;
}
interface GatewayRedirect {
    source: string;
    destination: string;
    permanent?: boolean;
}
interface GatewayOption {
    rewrites?: Array<GatewayRewrite>;
    redirects?: Array<GatewayRedirect>;
    basePath?: String;
}
interface FetchEvent extends Event {
    request: Request;
    respondWith(response: Promise<Response> | Response): Promise<Response>;
}
interface CustomFetchEvent extends FetchEvent {
    $$origin?: Event;
}
declare function gateway(event: CustomFetchEvent, options: GatewayOption): Response | CustomFetchEvent;
export default gateway;

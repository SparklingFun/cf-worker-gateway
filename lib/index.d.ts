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
    rewrites?: Array<GatewayRewrite>;
    redirects?: Array<GatewayRedirect>;
}
interface FetchEvent extends Event {
    request: Request;
    respondWith(response: Promise<Response> | Response): Promise<Response>;
}
export default function gateway(event: FetchEvent, options: GatewayOption): Event | undefined;
export {};

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
export default function gateway(event: FetchEvent, options: GatewayOption): FetchEvent | undefined;
export {};

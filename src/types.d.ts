export interface FetchEvent extends Event {
    request: Request;
    respondWith(response: Promise<Response> | Response): Promise<Response>;
}
export interface CustomFetchEvent extends FetchEvent {
    $$origin?: Event;
}

export interface GatewayRewrite {
    source: string;
    destination: string;
}
export interface GatewayRedirect {
    source: string;
    destination: string;
    permanent?: boolean;
    crossOrigin?: boolean;
}
export interface GatewayOption {
    rewrites?: Array<GatewayRewrite>;
    redirects?: Array<GatewayRedirect>;
    basePath?: string;
    allowOptionRequest?: boolean;
    robotsConfig?: Object;
    faviconBase64?: string;
}
// helpers
export interface RobotsConfig {
    rules?: Array<RobotsConfigRule>;
    sitemapUrl?: Array<string>;
}
export interface RobotsConfigRule {
    userAgent?: string;
    allow?: Array<string>;
    disallow?: Array<string>;
    crawlDelay?: number;
}
export interface EnvHelpers {
    Response?: Response;
    Request?: Request;
}
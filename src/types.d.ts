export interface FetchEvent extends Event {
    request: Request;
    respondWith(response: Promise<Response> | Response): Promise<Response>;
}
export interface CustomFetchEvent extends FetchEvent {
    $$origin?: Event;
}

export interface GatewayRewrite {
    basePath?: string;
    rules: Array<GatewayRewriteRule>;
}
export interface GatewayRewriteRule {
    source: string;
    destination: string;
}
export interface GatewayRedirect {
    basePath?: string;
    rules: Array<GatewayRedirectRule>;
}
export interface GatewayRedirectRule {
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

// since 0.2.0 new interfaces
export interface CommonMiddleware {
    (event: FetchEvent, next: Function, option?: any): Response | Event | void;
}
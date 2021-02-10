export interface FetchEvent extends Event {
    request: Request;
    respondWith(response: Promise<Response> | Response): Promise<Response>;
}
export interface CustomFetchEvent extends FetchEvent {
    $$origin?: FetchEvent;
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
export interface RateLimitConfigType {
    whitelist?: Array<string>;
    rules: Array<RateLimitRuleType>;
    jailKVSpace: any;
}
export interface RateLimitRuleType {
    path: string;
    times: number;
    banTime: number;
}
export interface EnvHelpers {
    Response?: Response;
    Request?: Request;
}

// 0.4.1
export interface InterceptorOption {
    path?: string;
    fn: Function<Response> | Promise<Function<Response>>
}
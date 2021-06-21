interface RobotsConfigRule {
    userAgent?: string;
    allow?: Array<string>;
    disallow?: Array<string>;
    crawlDelay?: number;
}
interface RobotsConfig {
    rules?: Array<RobotsConfigRule>;
    sitemapUrl?: Array<string>;
}
export default function robotsTxt(option: RobotsConfig): Function;
export {};

interface RobotsConfig {
    rules?: Array<RobotsConfigRule>;
    sitemapUrl?: Array<string>;
}
interface RobotsConfigRule {
    userAgent?: string;
    allow?: Array<string>;
    disallow?: Array<string>;
    crawlDelay?: number;
}
export default function robotsTxt(option: RobotsConfig): Function;
export {};

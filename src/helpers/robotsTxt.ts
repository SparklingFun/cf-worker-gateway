// helpers
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

/**
 * Helpers - robotsTxt
 * @param option `robots.txt` Configuration, also see {@link https://www.cloudflare.com/zh-cn/learning/bots/what-is-robots.txt}
 * @returns Middleware handler
 */
export default function robotsTxt(option: RobotsConfig): Function {
  return function (event: FetchEvent): Response | undefined {
    if (!new URL(event.request.url).pathname.endsWith("/robots.txt")) {
      return;
    }
    if (!option) {
      return;
    }
    // decode config
    // - allow & disallow cannot be together.
    // {rules: [{userAgent: "", allow: "", disallow: ""}], sitemapUrl: [""]}
    let sitemap = "";
    if (option.sitemapUrl && option.sitemapUrl.length > 0) {
      for (let i = 0; i < option.sitemapUrl.length; i += 1) {
        sitemap += `Sitemap: ${option.sitemapUrl[i]}\n`;
      }
    }

    if (!option.rules || option.rules.length < 1) {
      return new Response(
        `User-agent: *
Disallow: 
${sitemap}`.trim(),
        {
          status: 200,
        }
      );
    }
    let rules = "";
    for (let k = 0; k < option.rules.length; k += 1) {
      const rule = option.rules[k];
      let ruleText = "";
      ruleText += `User-agent: ${rule.userAgent}\n`;
      if (rule.allow && rule.allow.length) {
        rule.allow.forEach((url) => {
          ruleText += `Allow: ${url}\n`;
        });
      }
      if (rule.disallow && rule.disallow.length) {
        rule.disallow.forEach((url) => {
          ruleText += `Disallow: ${url}\n`;
        });
      }
      rules += ruleText;
    }

    return new Response(
      `
${rules}
${sitemap}
        `.trim(),
      {
        status: 200,
      }
    );
  };
}

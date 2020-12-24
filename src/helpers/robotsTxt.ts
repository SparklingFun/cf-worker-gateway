import { RobotsConfig } from "../types";

// [Reference](https://www.cloudflare.com/zh-cn/learning/bots/what-is-robots.txt)
export default function robotsTxt (option: RobotsConfig): Function {
    return function (event: FetchEvent, next: Function): Response | undefined {
        if (!(new URL(event.request.url).pathname.endsWith('/robots.txt'))) next();
        if (!option) next();
        // decode config
        // - allow & disallow cannot be together.
        // {rules: [{userAgent: "", allow: "", disallow: ""}], sitemapUrl: [""]}
        let sitemap = ""
        if (option.sitemapUrl && option.sitemapUrl.length > 0) {
            for (let i = 0; i < option.sitemapUrl.length; i++) {
                sitemap += `Sitemap: ${option.sitemapUrl[i]}\n`
            }
        }

        if (!option.rules || option.rules.length < 1) {
            return new Response((`User-agent: *
Disallow: 
${sitemap}`).trim(), {
                status: 200
            })
        } else {
            let rules = ""
            for (let k = 0; k < option.rules.length; k++) {
                let rule = option.rules[k]
                let ruleText = ""
                ruleText += `User-agent: ${rule.userAgent}\n`
                if (rule.allow && rule.allow.length) {
                    rule.allow.forEach(url => {
                        ruleText += `Allow: ${url}\n`
                    })
                }
                if (rule.disallow && rule.disallow.length) {
                    rule.disallow.forEach(url => {
                        ruleText += `Disallow: ${url}\n`
                    })
                }
                rules += ruleText
            }

            return new Response((`
${rules}
${sitemap}
        `).trim(), {
                status: 200
            })
        }
    }
}
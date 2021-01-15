import { RateLimitConfigType } from "../types";
import { cfRealIp, _matchPath } from "../utils/utils";

export default function accessRateLimit(options: RateLimitConfigType) {
    return async function (event: FetchEvent) {
        if (!options.jailKVSpace) {
            console.log("[Gateway Error] Jail Worker KV return undefined, please check!");
            return;
        }
        if (!options.rules) {
            return;
        }
        if (!Array.isArray(options.rules)) {
            console.log("[Gateway Error] Rules are not correct array, please check!");
            return;
        }
        // start
        const realIP = cfRealIp(event);
        if (options.whitelist && Array.isArray(options.whitelist)) {
            const isWhiteIP = options.whitelist.find(item => {
                return item === realIP
            })
            if (isWhiteIP) return;
        }
        // not in whitelist
        const matched = options.rules.find(rule => {
            return _matchPath(event.request.url, rule.path)
        })
        if (matched) {
            // jailRecord is an Array of "request" timestamp
            const jailRecord: Array<number> = await options.jailKVSpace.get(`path:${encodeURIComponent(matched.path)}|ip:${realIP}`, "json");
            // except expired records
            if (jailRecord) {
                console.log(jailRecord);
                const effectRecord = jailRecord.filter(item => item + matched.banTime > new Date().getTime());
                if (effectRecord.length >= matched.times) {
                    return new Response(null, {
                        status: 403,
                        statusText: "Banned due to too much requests"
                    })
                } else {
                    effectRecord.push(new Date().getTime())
                    await options.jailKVSpace.put(`path:${encodeURIComponent(matched.path)}|ip:${realIP}`, JSON.stringify(effectRecord));
                    return;
                }
            } else {
                let effectRecord = [];
                effectRecord.push(new Date().getTime())
                await options.jailKVSpace.put(`path:${encodeURIComponent(matched.path)}|ip:${realIP}`, JSON.stringify(effectRecord));
                return;
            }

        }
        return;
    }
}
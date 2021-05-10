// @ts-ignore
// import ipaddr from "ipaddr.js";
import { cfRealIp } from "../utils/utils";

export interface ipControllerOption {
    allow?: Array<string>;
    deny?: Array<string>;
}

export default function ipController(option: any) {
    return function(event: FetchEvent) {
        if(!option) {
            return;
        }
        if(option.allow && !Array.isArray(option.allow)) {
            return;
        }
        if(option.deny && !Array.isArray(option.deny)) {
            return;
        }
        const realIP = cfRealIp(event);
        
        if(!realIP) {
            return;
        }
        if(option.allow) {
            // @ts-ignore
            let matched = option.allow.find(ip => {
                // adjust to ip range
                // return ip === realIP || ipaddr.parse(realIP).match(ipaddr.parseCIDR(ip))
                return true;
            });
            if(!matched) {
                return new Response("", {
                    status: 403
                })
            } else {
                return;
            }
        } else if (option.deny) {
            // @ts-ignore
            let matched = option.deny.find(ip => {
                // adjust to ip range
                // return ip === realIP || ipaddr.parse(realIP).match(ipaddr.parseCIDR(ip))
                return true;
            });
            if(matched) {
                return new Response("", {
                    status: 403
                })
            } else {
                return;
            }
        } else {
            console.log("[Gateway] ipController - configuration is not take effect.");
            return;
        }
    }
}
// @ts-ignore
import ipaddr from "ipaddr.js";
import { cfRealIp } from "../utils/utils";

export interface ipControllerOption {
    allow?: Array<string>;
    deny?: Array<string>;
}

export default function ipController(option: any) {
    return function(event: FetchEvent, next: Function) {
        if(!option) {
            next();
            return;
        }
        if(option.allow && !Array.isArray(option.allow)) {
            next();
            return;
        }
        if(option.deny && !Array.isArray(option.deny)) {
            next();
            return;
        }
        const realIP = cfRealIp(event);
        
        if(!realIP) {
            next();
            return;
        }
        if(option.allow) {
            // @ts-ignore
            let matched = option.allow.find(ip => {
                // adjust to ip range
                return ip === realIP || ipaddr.parse(realIP).match(ipaddr.parseCIDR(ip))
            });
            if(!matched) {
                return new Response("", {
                    status: 403
                })
            } else {
                next();
                return;
            }
        } else if (option.deny) {
            // @ts-ignore
            let matched = option.deny.find(ip => {
                // adjust to ip range
                return ip === realIP || ipaddr.parse(realIP).match(ipaddr.parseCIDR(ip))
            });
            if(matched) {
                return new Response("", {
                    status: 403
                })
            } else {
                next();
                return;
            }
        } else {
            console.log("[Gateway] ipController - configuration is not take effect.");
            next();
            return;
        }
    }
}
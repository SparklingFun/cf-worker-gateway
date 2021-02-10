import { CustomFetchEvent } from "../types";
import { _matchPath } from "../utils/utils";

export default function Interceptor(path: string, fn: Function) {
    path = path || '/';
    return async function(event: CustomFetchEvent) {
        if(!fn) return event;
        const requestUrl = event.request.url;
        if(_matchPath(requestUrl, path)) {
            const result = await fn(event);
            if(result instanceof Response || result instanceof FetchEvent) {
                return result;
            }
        }
        return event;
    }
}
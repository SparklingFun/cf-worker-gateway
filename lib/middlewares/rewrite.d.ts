import { Match } from "path-to-regexp";
interface MiddlewareFetchEvent extends Event {
    request?: Request;
    match?: Match;
}
declare const rewrite: (path: string) => (event: FetchEvent) => MiddlewareFetchEvent | undefined;
export default rewrite;

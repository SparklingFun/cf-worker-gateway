export function cfRealIp(event: FetchEvent): string {
    return event.request.headers.get("CF-Connecting-IP") || "";
}
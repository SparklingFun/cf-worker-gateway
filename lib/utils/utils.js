export function cfRealIp(event) {
    return event.request.headers.get("CF-Connecting-IP") || "";
}

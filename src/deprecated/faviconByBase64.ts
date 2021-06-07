/**
 * Helper - faviconByBase64 (NOT RECOMMAND)
 * @param b64str Image data encoded in Base64, accept "ignored" for empty `favicon.icon` (just for avoiding HTTP Code 500).
 * @returns Middleware handler
 */
export default function faviconByBase64(b64str: string, useExactPath: boolean = false) {
  return function (event: FetchEvent) {
    if (b64str) {
      if(!useExactPath && !event.request.url.endsWith("favicon.ico")) {return;}
      // you can ignore all request of `favicon.ico`
      if (b64str === "ignored") {
        return new Response(null, {
          status: 204
        });
      }
      const buffer = Buffer.from(b64str, "base64");
      return new Response(buffer, {
        headers: {
          "Content-Type": "image/x-icon",
        },
      });
    }
  };
}

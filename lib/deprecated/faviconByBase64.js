export default function faviconByBase64(b64str) {
    return function (event) {
        if (b64str) {
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

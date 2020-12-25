// helper option faviconBase64 (NOT RECOMMAND)
export default function faviconByBase64(b64str: string) {
    return function (event: FetchEvent, next: Function) {
        if (b64str) {
            if (event.request.method === 'GET' && event.request.url.endsWith('/favicon.ico')) {
                // you can ignore all request of `favicon.ico`
                if (b64str === 'ignored') {
                    return new Response(undefined, {
                        status: 204
                    })
                }
                const buffer = Buffer.from(b64str, 'base64');
                return new Response(buffer, {
                    headers: {
                        'Content-Type': 'image/x-icon'
                    }
                })
            }
        } else {
            next();
            return;
        }
    }
}
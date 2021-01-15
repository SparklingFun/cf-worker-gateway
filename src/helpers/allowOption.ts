export default function allowOption() {
    return function (event: FetchEvent) {
        if (event.request.method === 'OPTIONS') {
            // @ts-ignore
            let headerObj = Object.fromEntries(event.request.headers);
            return new Response('', {
                status: 204,
                headers: new Headers({
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': headerObj['access-control-request-headers'] || ''
                })
            })
        }
        return;
    }
}
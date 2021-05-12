// Reference: [MDN](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Authentication)
const NAME = "YOUR_USER_NAME";
const PASS = "YOUR_PASSWORD";

/**
 * RegExp for basic auth credentials
 *
 * credentials = auth-scheme 1*SP token68
 * auth-scheme = "Basic" ; case insensitive
 * token68     = 1*( ALPHA / DIGIT / "-" / "." / "_" / "~" / "+" / "/" ) *"="
 */
const CREDENTIALS_REGEXP = /^ *(?:[Bb][Aa][Ss][Ii][Cc]) +([A-Za-z0-9._~+/-]+=*) *$/;
/**
 * RegExp for basic auth user/pass
 *
 * user-pass   = userid ":" password
 * userid      = *<TEXT excluding ":">
 * password    = *TEXT
 */
const USER_PASS_REGEXP = /^([^:]*):(.*)$/;

/**
 * Object to represent user credentials.
 */
const Credentials = function (this: any, name: string, pass: string): void {
    this.name = name;
    this.pass = pass;
}


const unauthorizedResponse = function (string: string, realm?: string) {
    return new Response(string, {
        status: 401,
        statusText: "'Authentication required.'",
        headers: {
            "WWW-Authenticate": 'Basic' + (realm ? ' realm="'+realm+'"' : "")
        }
    })
}

const parseAuthHeader = function (string: string | null) {
    if (typeof string !== 'string') {
        return false;
    }
    // parse header
    const match = CREDENTIALS_REGEXP.exec(string);
    if (!match) {
        return false;
    }
    // decode user pass
    const userPass = USER_PASS_REGEXP.exec(atob(match[1]));
    if (!userPass) {
        return false;
    }

    // return credentials object
    return new (Credentials as any)(userPass[1], userPass[2]);
}

interface basicAuthOption {
    USER_NAME?: string
    USER_PASS?: string
    realm?: string
}

/**
 * Helpers - basicAuth (Thanks for [@dommmel](https://github.com/dommmel) & [@JonasJasas](https://github.com/JonasJasas) work!)
 * @link https://403page.com/how-to-use-cloudflare-to-enable-basic-auth-on-a-subdirectory/
 * @param options User name & password configuration
 * @returns Middleware handler
 */
export default function basicAuth(options: basicAuthOption) {
    if(!options) options = {};
    const USER_NAME = options.USER_NAME || NAME;
    const USER_PASS = options.USER_PASS || PASS;
    return function (event: FetchEvent) {
        const credentials = parseAuthHeader(event.request.headers.get("Authorization"));
        if (credentials === undefined) {
            return unauthorizedResponse("Unauthorized", options.realm);
        }
        if (!credentials || credentials.name !== USER_NAME || credentials.pass !== USER_PASS) {
            return unauthorizedResponse("Unauthorized", options.realm)
        } else {
            return;
        }
    }
}
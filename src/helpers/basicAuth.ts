// inspired from [This Link](https://403page.com/how-to-use-cloudflare-to-enable-basic-auth-on-a-subdirectory/)
const NAME = "YOUR_USER_NAME"
const PASS = "YOUR_PASSWOED"

/**
 * RegExp for basic auth credentials
 *
 * credentials = auth-scheme 1*SP token68
 * auth-scheme = "Basic" ; case insensitive
 * token68     = 1*( ALPHA / DIGIT / "-" / "." / "_" / "~" / "+" / "/" ) *"="
 */

const CREDENTIALS_REGEXP = /^ *(?:[Bb][Aa][Ss][Ii][Cc]) +([A-Za-z0-9._~+/-]+=*) *$/
/**
 * RegExp for basic auth user/pass
 *
 * user-pass   = userid ":" password
 * userid      = *<TEXT excluding ":">
 * password    = *TEXT
 */

const USER_PASS_REGEXP = /^([^:]*):(.*)$/

/**
 * Object to represent user credentials.
 */

const Credentials = function (this: any, name: string, pass: string): void {
    this.name = name
    this.pass = pass
}


const unauthorizedResponse = function (string: string) {
    return new Response(string, {
        status: 401,
        statusText: "'Authentication required.'",
        headers: {
            "WWW-Authenticate": 'Basic realm="User Visible Realm"'
        }
    })
}

const parseAuthHeader = function (string: string | null) {
    if (typeof string !== 'string') {
        return undefined
    }

    // parse header
    const match = CREDENTIALS_REGEXP.exec(string)

    if (!match) {
        return undefined
    }

    // decode user pass
    const userPass = USER_PASS_REGEXP.exec(atob(match[1]))

    if (!userPass) {
        return undefined
    }

    // return credentials object
    return new (Credentials as any)(userPass[1], userPass[2])
}

export default function basicAuth(event: FetchEvent) {
    if (!event) return;
    const credentials = parseAuthHeader(event.request.headers.get("Authorization"));
    if(credentials === undefined) {
        return;
    }
    if (!credentials || credentials.name !== NAME || credentials.pass !== PASS) {
        return unauthorizedResponse("Unauthorized")
    } else {
        return fetch(event.request)
    }
}
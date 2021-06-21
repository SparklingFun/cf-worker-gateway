const NAME = "YOUR_USER_NAME";
const PASS = "YOUR_PASSWORD";
const CREDENTIALS_REGEXP = /^ *(?:[Bb][Aa][Ss][Ii][Cc]) +([A-Za-z0-9._~+/-]+=*) *$/;
const USER_PASS_REGEXP = /^([^:]*):(.*)$/;
const Credentials = class {
    constructor(name, pass) {
        this.name = name;
        this.pass = pass;
    }
};
const unauthorizedResponse = function (string, realm) {
    return new Response(string, {
        status: 401,
        statusText: "'Authentication required.'",
        headers: {
            "WWW-Authenticate": `Basic${realm ? ` realm="${realm}"` : ""}`,
        },
    });
};
const parseAuthHeader = function (string) {
    if (typeof string !== "string") {
        return false;
    }
    const match = CREDENTIALS_REGEXP.exec(string);
    if (!match) {
        return false;
    }
    const userPass = USER_PASS_REGEXP.exec(atob(match[1]));
    if (!userPass) {
        return false;
    }
    return new Credentials(userPass[1], userPass[2]);
};
export default function basicAuth(options) {
    if (!options)
        options = {};
    const USER_NAME = options.USER_NAME || NAME;
    const USER_PASS = options.USER_PASS || PASS;
    return function (event) {
        const credentials = parseAuthHeader(event.request.headers.get("Authorization"));
        if (credentials === undefined) {
            return unauthorizedResponse("Unauthorized", options.realm);
        }
        if (!credentials ||
            credentials.name !== USER_NAME ||
            credentials.pass !== USER_PASS) {
            return unauthorizedResponse("Unauthorized", options.realm);
        }
    };
}

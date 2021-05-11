function isOriginAllowed(origin, allowedOrigin) {
    if (Array.isArray(allowedOrigin)) {
        for (var i = 0; i < allowedOrigin.length; ++i) {
            if (isOriginAllowed(origin, allowedOrigin[i])) {
                return true;
            }
        }
        return false;
    }
    else if (typeof allowedOrigin === "string") {
        return origin === allowedOrigin;
    }
    else if (allowedOrigin instanceof RegExp) {
        return allowedOrigin.test(origin);
    }
    else {
        return !!allowedOrigin;
    }
}
function configureOrigin(event, options) {
    let requestOrigin = event.request.headers.get("Origin") || "", isAllowed;
    if (!options.origin || options.origin === "*") {
        return {
            key: "Access-Control-Allow-Origin",
            value: "*",
        };
    }
    else if (typeof options.origin === "string") {
        return {
            key: "Access-Control-Allow-Origin",
            value: options.origin,
        };
    }
    else {
        isAllowed = isOriginAllowed(requestOrigin, options.origin);
        return {
            key: "Access-Control-Allow-Origin",
            value: isAllowed ? requestOrigin : false,
        };
    }
}
function configureMethods(options) {
    if (Array.isArray(options.methods) && options.methods.join) {
        options.methods = options.methods.join(",");
    }
    return {
        key: "Access-Control-Allow-Methods",
        value: options.methods,
    };
}
function configureExposeHeaders(options) {
    if (Array.isArray(options.exposedHeaders) && options.exposedHeaders.join) {
        options.exposedHeaders = options.exposedHeaders.join(",");
    }
    return {
        key: "Access-Control-Expose-Headers",
        value: options.exposedHeaders,
    };
}
function configureAllowedHeaders(options) {
    if (Array.isArray(options.allowedHeaders) && options.allowedHeaders.join) {
        options.allowedHeaders = options.allowedHeaders.join(",");
    }
    return {
        key: "Access-Control-Allow-Headers",
        value: options.allowedHeaders,
    };
}
function configureMaxAge(options) {
    var maxAge = (typeof options.maxAge === "number" || options.maxAge) &&
        options.maxAge.toString();
    if (maxAge && maxAge.length) {
        return {
            key: "Access-Control-Max-Age",
            value: maxAge,
        };
    }
}
function configureCredentials(options) {
    if (options.credentials === true) {
        return {
            key: "Access-Control-Allow-Credentials",
            value: "true",
        };
    }
}
const cors = function (options = {
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    optionsSuccessStatus: 204,
}) {
    return {
        default: function (event) {
            if (typeof options === "object" && options.preflightContinue)
                return;
            if (event.request.method === "OPTIONS") {
                return new Response(null, {
                    status: typeof options === "object" && options.optionsSuccessStatus
                        ? options.optionsSuccessStatus
                        : 204,
                });
            }
            return;
        },
        callback: function (event, response) {
            if (options === false)
                return;
            if (options === true)
                options = {
                    origin: "*",
                    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
                    preflightContinue: false,
                    optionsSuccessStatus: 204,
                };
            let headers = [];
            headers.push(configureAllowedHeaders(options));
            headers.push(configureCredentials(options));
            headers.push(configureExposeHeaders(options));
            headers.push(configureMaxAge(options));
            headers.push(configureMethods(options));
            headers.push(configureOrigin(event, options));
            headers.map(header => {
                if (typeof header === 'object' && header.key && header.value)
                    response.headers.set(header.key, header.value.toString());
            });
            return response;
        },
    };
};
export default cors;

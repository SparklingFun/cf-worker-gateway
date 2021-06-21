interface CORSOption {
  origin?: boolean | string | RegExp | Array<string | RegExp> | Function;
  methods?: string | Array<string>;
  allowedHeaders?: string | Array<string>;
  exposedHeaders?: string | Array<string>;
  credentials?: boolean;
  maxAge?: string | number;
  preflightContinue?: boolean;
  optionsSuccessStatus?: number;
}

function isOriginAllowed(
  origin: string,
  allowedOrigin: boolean | string | RegExp | Array<string | RegExp> | Function
) {
  if (Array.isArray(allowedOrigin)) {
    for (let i = 0; i < allowedOrigin.length; i += 1) {
      if (isOriginAllowed(origin, allowedOrigin[i])) {
        return true;
      }
    }
    return false;
  }
  if (typeof allowedOrigin === "string") {
    return origin === allowedOrigin;
  }
  if (allowedOrigin instanceof RegExp) {
    return allowedOrigin.test(origin);
  }
  return !!allowedOrigin;
}

// inject custom header functions for CORS
function configureOrigin(event: FetchEvent, options: CORSOption) {
  const requestOrigin = event.request.headers.get("Origin") || "";

  if (!options.origin || options.origin === "*") {
    return {
      key: "Access-Control-Allow-Origin",
      value: "*",
    };
  }
  if (typeof options.origin === "string") {
    return {
      key: "Access-Control-Allow-Origin",
      value: options.origin,
    };
  }
  const isAllowed = isOriginAllowed(requestOrigin, options.origin);
  // reflect origin
  return {
    key: "Access-Control-Allow-Origin",
    value: isAllowed ? requestOrigin : false,
  };
}
function configureMethods(options: CORSOption) {
  if (Array.isArray(options.methods) && options.methods.join) {
    options.methods = options.methods.join(","); // .methods is an array, so turn it into a string
  }
  return {
    key: "Access-Control-Allow-Methods",
    value: options.methods,
  };
}
function configureExposeHeaders(options: CORSOption) {
  if (Array.isArray(options.exposedHeaders) && options.exposedHeaders.join) {
    options.exposedHeaders = options.exposedHeaders.join(","); // .headers is an array, so turn it into a string
  }
  return {
    key: "Access-Control-Expose-Headers",
    value: options.exposedHeaders,
  };
}
function configureAllowedHeaders(options: CORSOption) {
  if (Array.isArray(options.allowedHeaders) && options.allowedHeaders.join) {
    options.allowedHeaders = options.allowedHeaders.join(","); // .headers is an array, so turn it into a string
  }
  return {
    key: "Access-Control-Allow-Headers",
    value: options.allowedHeaders,
  };
}
function configureMaxAge(options: CORSOption) {
  const maxAge =
    (typeof options.maxAge === "number" || options.maxAge) &&
    options.maxAge.toString();
  if (maxAge && maxAge.length) {
    return {
      key: "Access-Control-Max-Age",
      value: maxAge,
    };
  }
}
function configureCredentials(options: CORSOption) {
  if (options.credentials === true) {
    return {
      key: "Access-Control-Allow-Credentials",
      value: "true",
    };
  }
}

/**
 * Helpers - CORS
 * @param options options for CORS config, same as `cors` npm package ({@link https://github.com/expressjs/cors})
 * @returns Middleware bundle of handlers (default & callback)
 */
const cors = function (
  options: boolean | CORSOption = {
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    optionsSuccessStatus: 204,
  }
) {
  return {
    default(event: FetchEvent) {
      if (typeof options === "object" && options.preflightContinue) return;
      if (event.request.method === "OPTIONS") {
        return new Response(null, {
          status:
            typeof options === "object" && options.optionsSuccessStatus
              ? options.optionsSuccessStatus
              : 204,
        });
      }
    },
    callback(event: FetchEvent, response: Response) {
      if (options === false) return;
      if (options === true) {
        options = {
          origin: "*",
          methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
          preflightContinue: false,
          optionsSuccessStatus: 204,
        };
      }

      const headers = [];
      headers.push(configureAllowedHeaders(options));
      headers.push(configureCredentials(options));
      headers.push(configureExposeHeaders(options));
      headers.push(configureMaxAge(options));
      headers.push(configureMethods(options));
      headers.push(configureOrigin(event, options));
      headers.forEach((header) => {
        if (typeof header === "object" && header.key && header.value)
          response.headers.set(header.key, header.value.toString());
      });

      return response;
    },
  };
};

export default cors;

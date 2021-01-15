# cf-worker-gateway

# v0.2

> If you are using version below 0.2.0, please read [README.old.md](https://github.com/SparklingFun/cf-worker-gateway/blob/main/README.old.md) to see full reference.

## Usage

Pre-handle requests that worker receive, get directly response or modify event, original event will be passed if no middleware is used and matched.

## Quick Start

```bash
npm install cf-worker-gateway@0.2.0-canary.1 --save
# yarn add cf-worker-gateway@0.2.0-canary.1
```

A very simple example:

```javascript
import gateway from "cf-worker-gateway";

addEventListener('fetch', (event) => {
    const app = new Gateway(event);
    app.use(redirect{
        rules: [{
            source: '/test',
            destination: '/api/test'
        }]
    })
    const gatewayResult = app();
    event.respondWith(gatewayResult instanceof Response ? gatewayResult : handleRequest(gatewayResult); // handleRequest is your function to map assets, decided on which package you used.
})
```

## Middleware

When `cf-worker-gateway` was create, it contains a plenty of configure options and functions, which are not organized well. This is the reason why "middleware" design was applied since 0.2.0 (canary versions). Different middlewares for different usage, can be easily import from package. Or you can easily make your own middleware just follow the guide below.

A simple guide for create a new middleware:

```javascript
// your custom middleware
function customizedMiddleware(option) { // if you need pass some options, a wrapper is needed.
    return function(event, next) { // all middleware apply to 2 parameters, event, and next();
        // const someRule = ...
        // const otherRule = ...
        if(someRule) {
            return new Response(); // you can directly return a response when matched
        } else if(otherRule) {
            let modifiedEvent = new Event('fetch');
            next(modifiedEvent); // modify event, and pass to next, this modification will not lose
        } else {
            // all rules are not match, please call next() without any param
            next();
        }
    }
}
```

## Preset Middlewares

### middlewares

#### `redirect`

Full option,

```javascript
import redirect from "cf-worker-gateway/middlewares/redirect";

app.use(redirect({
    basePath: "",
    rules: [
        {
            source: "event request path",
            destination: "redirected url or path",
            permanent: true // HTTP Code 308 or 307
        }
    ]
}))
```

A `Response.redirect` will return when matched.

#### `rewrite`

Full option,

```javascript
import rewrite from "cf-worker-gateway/middlewares/rewrite";

app.use(rewrite({
    basePath: "",
    rules: [
        {
            source: "event request url or path",
            destination: "redirected url or path"
        }
    ]
}))
```

### helpers

#### allowOption

When received CORS request, you may need a middleware to handle all `OPTION` request.

Example is so simple,

```javascript
import allowOption from "cf-worker-gateway/helpers/allowOption";

app.use(allowOption())
```

#### robotsTxt

It's a middleware that receive all request ends with `robots.txt`, you can configure it with options below:

```javascript
import robotsTxt from "cf-worker-gateway/helpers/robotsTxt";

app.use(robotsTxt({
    rules: [
        {
            userAgent: "GoogleBot",
            allow: ["/"]
        },
        {
            userAgent: "Bingbot",
            disallow: ["/google-only"]
        }
    ],
    sitemapUrl: ["https://localhost/sitemap.xml"]
}))
```

### deprecated

> __Warning: These middlewares may effect your worker performance, please use CAREFULLY.__

#### faviconByBase64

You can config a `favicon.ico` by using this middleware, which uses `Buffer` from javascript, may cause a high CPU time when requests received, but it can solve your 500 code.

```javascript
import faviconByBase64 from "cf-worker-gateway/deprecated/faviconByBase64";

app.use(faviconByBase64("ignored" | "some-base64-text"));
```


# v0.1

__:warning: Attention: Current version is in canary, PLEASE always use the latest version!__

## Getting Start

Install via npm:

```bash
npm install cf-worker-gateway --save
```

Or via yarn:

```bash
yarn add cf-worker-gateway
```

## Package Usage

Redirect or rewrite your request, behave like a Gateway.

Configuration is designed referring to Next.js ["Redirect & Rewrite" RFC](https://github.com/vercel/next.js/discussions/9081).

## Example

```javascript
import { gateway } from "cf-worker-gateway";

addEventListener("fetch", event => {
  const gateWayResult = gateway(event, {
    redirects: [
      // {source: "/path-a", destination: "/path-b"}
    ],
    rewrites: []
  })
  // modified event usually, but it will be response if matched a redirect rule.
  event.respondWith(gateWayResult instanceof Response ? gateWayResult : handleRequest(gateWayResult.request));
})
```

## Docs

> Glob pattern supported by `glob-to-regexp`, check it's [docs](https://github.com/fitzgen/glob-to-regexp#readme) for pattern rules.

### `gateway(event: FetchEvent, options: GatewayOptions): ModifiedFetchEvent | FetchEvent | Response`

`gateway` is the default export function, you need to pass the origin event, if `redirects` rules matched, it will return a redirected response. Otherwise, it will return a modified (or the origin event if no rule was matched) event.

### GatewayOptions - `basePath`

if `basePath` is delivered, all rules (both `rewrites` and `redirects`) will be prefixed by using `basePath`

### GatewayOptions - `allowOptionRequest`

As a gateway, you can make CORS much more simple, just enable `allowOptionRequest`, set it `true`, and all `OPTIONS` request will have a `204` response.

> If you need `Access-Control-Allow-Headers`, you need to pay attention in ACTUAL response, such as a JSON `POST` response.

### GatewayOptions - `faviconBase64`

Using `Buffer` to return a `image/x-icon` ico image, allow you set a base64 image. 

> If you just want to skip all error request about `favicon.ico`, you can set `ignored`.

### GatewayOptions - `rewrites`

> `rewrite` rules have a higher priority than `redirects`.

There're 2 properties in one rule,

| Prop          | Type                                 | Allow Empty |
|---------------|--------------------------------------|:-----------:|
| `source`      | String (glob pattern)                |             |
| `destination` | String (Your router support pattern) |             |

Attention, `rewrites` will overwrite the origin request url, so if you want to visit the origin event, you can access `event.$$origin` in modified events (since v0.1.3).

### GatewayOptions - `redirects`

There're 3 properties in one rule, similar to `rewrites`,

| Prop          | Type                                 | Allow Empty |
|---------------|--------------------------------------|:-----------:|
| `source`      | String (glob pattern)                |             |
| `destination` | String (Your router support pattern) |             |
| `permant`     | Boolean                              |  √ (default `false`)  |
| `crossOrigin` | Boolean                              |  √ (default `false`)  |

> If `crossOrigin` was set, the global `basePath` will be ignored.

## Helpers

### `robotsHandler(event: FetchEvent, options: RobotConfig): Response | undefined`

Useful function that handle robots.txt requests, configuration is so simple.

```javascript
import { robotsHandler } from "cf-worker-gateway";

addEventListener("fetch", event => {
  const robotRes = robotsHandler(event, {
    rules: [
      {
        userAgent: "*",
        allow: ["/test", "/hello-world"],
        disallow: ["/"]
      }
    ],
    sitemapUrl: [""]
  });
  event.respondWith(robotRes || new Response("Test", {status: 200}));
  // it will response a robots.txt when request url is like `some-url.path.com/robots.txt`
})
```
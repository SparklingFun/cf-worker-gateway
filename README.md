# cf-worker-gateway

![Workflow](https://github.com/SparklingFun/cf-worker-gateway/workflows/Publish/badge.svg)

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
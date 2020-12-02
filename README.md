# cf-worker-gateway

Status: ![Publish & Test](https://github.com/SparklingFun/cf-worker-gateway/workflows/Publish/badge.svg)

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
import gateway from "cf-worker-gateway";

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

### `gateway(event: FetchEvent, options: GatewayOptions): FetchEvent | Response`

`gateway` is the default export function, you need to pass origin event, if `redirects` rules matched it will return a redirected response. Otherwise, it will return a modified (or origin event if no rule was matched) event.

> In order to fit a test environment ([@dollarshaveclub/cloudworker](https://github.com/dollarshaveclub/cloudworker#readme)), there is a solution to fit vm enviroment in node.js, by calling gateway like this,
> ```javascript
> gateway.call(this, event, options); // this or context should contains `Response` at least.
> ```

### GatewayOptions - `basePath`

if `basePath` is delivered, all rules (both `rewrites` and `redirects`) will be prefixed by using `basePath`

### GatewayOptions - `rewrites`

> `rewrite` rules have a higher priority than `redirects`.

There're 2 properties in one rule,

| Prop          | Type                                 | Allow Empty |
|---------------|--------------------------------------|:-----------:|
| `source`      | String (glob pattern)                |             |
| `destination` | String (Your router support pattern) |             |

### GatewayOptions - `redirects`

There're 3 properties in one rule, similar to `rewrites`,

| Prop          | Type                                 | Allow Empty |
|---------------|--------------------------------------|:-----------:|
| `source`      | String (glob pattern)                |             |
| `destination` | String (Your router support pattern) |             |
| `permant`     | Boolean                              |  √ (default `false`)  |
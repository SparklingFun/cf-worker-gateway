# cf-worker-gateway

Status: ![Publish & Test](https://github.com/SparklingFun/cf-worker-gateway/workflows/Publish/badge.svg)

## Getting Start

```bash
npm install cf-worker-gateway --save

# or 
# yarn add cf-worker-gateway
```

## Usage

Redirect or rewrite your request, behave like a Gateway.

Configuration is designed referring to Next.js ["Redirect & Rewrite" RFC](https://github.com/vercel/next.js/discussions/9081).

## Example

```javascript
import gateway from "cf-worker-gateway";

// some logic code
addEventListener("fetch", event => {
  const gateWayResult = gateway(event, {
    redirects: [
      // {source: "/path-a", destination: "/path-b"}
    ],
    rewrites: []
  })
  // There are two conditions, redirected response or modified event.
  event.respondWith(gateWayResult instanceof Response ? gateWayResult : handleRequest(gateWayResult.request));
})
```

## Docs

> Glob pattern supported by `glob-to-regexp`, check it's [docs](https://github.com/fitzgen/glob-to-regexp#readme) for pattern rules.

### `rewrites`

> `rewrite` rules have an higher priority than `redirects`.

There're three properties in one rule,

| Prop          | Type                                 | Allow Empty |
|---------------|--------------------------------------|:-----------:|
| `source`      | String (glob pattern)                |             |
| `destination` | String (Your router support pattern) |             |
| `basePath`    | String                               |      √      |

### `redirects`

There're 4 properties in one rule, similar to `rewrites`,

| Prop          | Type                                 | Allow Empty |
|---------------|--------------------------------------|:-----------:|
| `source`      | String (glob pattern)                |             |
| `destination` | String (Your router support pattern) |             |
| `basePath`    | String                               |      √      |
| `permant`     | Boolean                              |  √ (default `false`)  |
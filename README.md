# cf-worker-gateway

Status: ![Publish](https://github.com/SparklingFun/cf-worker-gateway/workflows/Publish/badge.svg)

## Getting Start

```
npm install cf-worker-gateway --save

# or yarn add cf-worker-gateway
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
      // Your rules here.
    ],
    rewrites: []
  })
  // There are two conditions, redirected response or modified event.
  event.respondWith(gateWayResult instanceof Response ? gateWayResult : handleRequest(gateWayResult.request));
})
```

## Docs

# cf-worker-gateway

![Workflow](https://github.com/SparklingFun/cf-worker-gateway/workflows/Publish/badge.svg)

> If you are using version below 0.2.0, please read README.old.md to see full reference.

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
            disallow: ["/"]
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
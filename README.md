# @arctome/worker-scaffold

![Workflow](https://github.com/arctome/worker-scaffold/workflows/Publish/badge.svg)
![Coverage](./coverage/badge-lines.svg)

> Package `cf-worker-gateway` is the temp name of this package, since v1.0.0, core function & middlewares has been refactored. If you are using `cf-worker-gateway` under v0.4.1-cananry2, please see [README.old.md](./README.old.md)

## How it works

![How it works](https://lucid.app/publicSegments/view/74a1b7f0-b008-430f-8f3b-25c6831ae2c9/image.jpeg)

## Quick Start

```bash
npm install @arctome/worker-scaffold --save
# yarn add @arctome/worker-scaffold
```

A very simple example:

```javascript
import gateway from "@arctome/worker-scaffold";
import redirect from "@arctome/worker-scaffold/lib/middlewares/redirect";

addEventListener('fetch', (event) => {
    const app = new WorkerScaffold(event);
    // call `app.use` with exact route, the handler will be pushed in quene.
    app.use('/test', redirect('/api/test'))
    // add your own handler at the last app.use(), such as `handleEvent` or `getAssestFromKV`.
    // if not `path` specified, handler will be inject in any route.
    app.use(event => {
      return new Response("Hello", {status: 200})
    })
    // if you need a handler when response is generated but not sent, you can pass a bundle of functions contains `default` & `callback`. `callback` funciton will be called at the end.
    app.use({
        default: function() {},
        callback: async function(event, response) {
            // Your jobs that need await...
            res.headers.set("Access-Control-Allow-Origin", "*");
            return res;
        }
    })

    // pass `app.run()` to `event.respondWith`, all things done.
    event.respondWith(app.run())
}
```

## Middleware

Inspired from express.js, I want to create an easy scaffold for routing and middleware interception, so `worker-scaffold` here !

A simple guide for creating a new middleware:

```javascript
// your custom middleware
function customizedMiddleware(option) { // if you need pass some options, a wrapper is needed.
    return async function(event) { // all middleware apply to 1 parameters, event;
        // const someRule = ...
        // const otherRule = ...
        if(someRule) {
            return new Response(); // you can directly return a response when matched
        } else if(otherRule) {
            let modifiedEvent = new Event('fetch');
            return modifiedEvent; // modify event, and pass to next, this modification will not lose
        } else {
            // all rules are not match, please call next() without any param
            return;
        }
    }
}
```

## Preset Middlewares

### middlewares

#### `redirect`

Full option,

```javascript
import redirect from "@arctome/worker-scaffold/middlewares/redirect";
// pass true in second params will make a HTTP code 308 redirect.
app.use("/test", redirect("/docs/test", true))
```

A `Response.redirect` will return when matched.

#### `rewrite`

Full option,

```javascript
import rewrite from "@arctome/worker-scaffold/middlewares/rewrite";

app.use("/test", rewrite("/docs/test"))
```

### helpers

#### cors

When received CORS request, you may need a middleware to handle all `OPTION` request.

Example is so simple, you can pass configurations as [express.js - cors](https://github.com/expressjs/cors)

```javascript
import cors from "@arctome/worker-scaffold/helpers/cors";
// Configurations see also {@link https://github.com/expressjs/cors}
app.use(cors())
```

#### robotsTxt

It's a middleware that receive all request ends with `robots.txt`, you can configure it with options below:

```javascript
import robotsTxt from "@arctome/worker-scaffold/helpers/robotsTxt";

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

#### basicAuth

Add HTTP Authentication to your specific path, you can use your user & password to login.

For example,

```javascript
import basicAuth from "@arctome/worker-scaffold/helpers/basicAuth";

app.use("/admin", basicAuth({
    USER_NAME: "YOUR_USER_NAME",
    USER_PASS: "YOUR_PASSWORD"
}))
```

### deprecated

> __Warning: These middlewares may effect your worker performance, obviously in async middleware mode, please use CAREFULLY.__

#### faviconByBase64

You can config a `favicon.ico` by using this middleware, which uses `Buffer` from javascript, may cause a high CPU time when requests received, but it can solve your 500 code.

```javascript
import faviconByBase64 from "@arctome/worker-scaffold/deprecated/faviconByBase64";

app.use(faviconByBase64("ignored" | "some-base64-text"));
```

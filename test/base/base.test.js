const bootstrap = require("../bootstrap");

describe("Testing WorkerScaffold's ", () => {
  test("sync middleware works well", () => {
    return bootstrap(
      "/base/sync",
      `
      app.use("/base/sync", event => {
        return new Response("Sync middleware works well")
      })
    `
    ).then(async (res) => {
      let body = await res.text();
      expect(body).toBe("Sync middleware works well");
    });
  });

  test("async middleware works well", () => {
    return bootstrap(
      "/base/async",
      `
      app.use("/base/async", async event => {
        const resp = await fetch("https://github.com");
        if(resp.ok) {
          return new Response("Async middleware works well");
        } else {
          return new Response("Async middleware meet some problem", {status: 500})
        }
      })
    `
    )
      .then((res) => res.text())
      .then((body) => expect(body).toBe("Async middleware works well"));
  });

  test("multi middlewares works well", () => {
    return bootstrap(
      "/base/multi",
      `
      app.use("/base/multi", event => {
        const testHeader = new Headers();
        testHeader.append("processor", "first");
        const newRequest = new Request(event.request.url, {
          ...event.request,
          headers: testHeader
        })
        event.request = newRequest;
        return event;
      })
      app.use("/base/multi", async event => {
        const testHeader = event.request.headers.get("processor");
        if(testHeader === "first") {
          return new Response("Response body is from processor Second.");
        } else {
          return new Response("Response body is Only from processor Second, which is not correct.", {status: 500})
        }
      })
    `
    ).then(async (res) => {
      const finalRes = await res.text();
      expect(finalRes).toBe("Response body is from processor Second.");
    });
  });

  test("tail process middlewares works well", () => {
    return bootstrap(
      "/base/tail-process",
      `
      app.use("/base/tail-process", {
        default: event => {},
        callback: (event, response) => {
          response.headers.set("Test-Header", "Success")
          return response;
        }
      })
    `
    ).then((res) => {
      expect(res.headers.get("Test-Header")).toBe("Success");
    });
  });
});

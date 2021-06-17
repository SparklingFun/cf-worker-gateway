// Using [cloudflare-worker-local](https://github.com/gja/cloudflare-worker-local/blob/master/examples/unit-test-a-worker/) for test

// ==== This is an example worker contains most conditions ====
// Q: Why take a judgement of `importScripts` ?
// A: Reference [Link](https://stackoverflow.com/questions/14500091/uncaught-referenceerror-importscripts-is-not-defined)
if ("function" === typeof importScripts) {
  importScripts("../dist/index.js");
  addEventListener("fetch", (event) => {
    const app = new WorkerScaffold(event);
    // == Test routes ==
    app.use("/redirect/a", redirect("/redirect/b"));
    app.use("/redirect/permant", redirect("/redirect/permant-target", true));
    app.use(
      "/redirect/use-code-instead",
      redirect("/redirect/use-code-instead-target", 200)
    );

    // Default handler
    app.use(async (event) => await fetchHandler(event.request));

    event.respondWith(app.run());
  });
  async function fetchHandler(request) {
    console.log(request.url);
    const response = await fetch(request);
    if (response.status !== 200) {
      return new Response(request.url, {
        status: 418,
      });
    }
    return response;
  }
}

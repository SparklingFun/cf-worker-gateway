/**
 * Middleware - Redirect
 * @param path Redirect to any url (will automically try relative or absolute url)
 * @param permanent If set `true`, using HTTP Code 308 instead of 307.
 * @returns Handler of redirect
 */
const redirect = function (path: string, permanent: boolean | number) {
  return function (event: FetchEvent) {
    // exceptions
    if (!path) {
      return;
    }
    // try to recognize relative url or absolute url
    let redirectedUrl;
    try {
      const tmp = new URL(path);
      redirectedUrl = tmp;
    } catch (e) {
      const reqUrl = new URL(event.request.url);
      const tmp = new URL(`${reqUrl.protocol}//${reqUrl.host}${path}`);
      redirectedUrl = tmp;
      // if not correct, throw error.
    }
    let status: number | boolean = false;
    if (typeof permanent === "number") status = permanent;
    if (typeof permanent === "boolean") {
      status = permanent ? 308 : 307;
    }
    // @ts-ignore
    return Response.redirect(redirectedUrl.href, status);
  };
};

export default redirect;

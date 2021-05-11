declare const redirect: (path: string, permanent: boolean | number) => (event: FetchEvent) => Response | undefined;
export default redirect;

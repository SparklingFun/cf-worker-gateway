declare const rewrite: (targetRegexp: string, topath: string) => (event: FetchEvent) => Event | undefined;
export default rewrite;

declare const rewrite: (path: string) => (event: FetchEvent) => Event | undefined;
export default rewrite;

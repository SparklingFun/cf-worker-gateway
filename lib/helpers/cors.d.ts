interface CORSOption {
    origin?: boolean | string | RegExp | Array<string | RegExp> | Function;
    methods?: string | Array<string>;
    allowedHeaders?: string | Array<string>;
    exposedHeaders?: string | Array<string>;
    credentials?: boolean;
    maxAge?: string | number;
    preflightContinue?: boolean;
    optionsSuccessStatus?: number;
}
declare const cors: (options?: boolean | CORSOption) => {
    default(event: FetchEvent): Response | undefined;
    callback(event: FetchEvent, response: Response): Response | undefined;
};
export default cors;

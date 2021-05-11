interface CORSOption {
    origin?: Boolean | String | RegExp | Array<String | RegExp> | Function;
    methods?: String | Array<String>;
    allowedHeaders?: String | Array<String>;
    exposedHeaders?: String | Array<String>;
    credentials?: boolean;
    maxAge?: string | number;
    preflightContinue?: boolean;
    optionsSuccessStatus?: number;
}
declare const cors: (options?: boolean | CORSOption) => {
    default: (event: FetchEvent) => Response | undefined;
    callback: (event: FetchEvent, response: Response) => Response | undefined;
};
export default cors;

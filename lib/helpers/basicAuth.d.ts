interface basicAuthOption {
    USER_NAME?: string;
    USER_PASS?: string;
    realm?: string;
}
export default function basicAuth(options: basicAuthOption): (event: FetchEvent) => Response | undefined;
export {};

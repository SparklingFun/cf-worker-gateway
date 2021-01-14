const Gateway = function(event: FetchEvent): Function {
    // middlewares quene
    const fns: Array<Function> = [];
    let seizeResp: Response | undefined = undefined;
    // PS: it's a quene model, first `use`, first execute, first return when matched.
    const app = async function(): Promise<Response | FetchEvent> {
        let i = 0;
        let modified = event;
        async function next(stdinEvent: FetchEvent) {
            if(stdinEvent !== event && stdinEvent) {
                modified = stdinEvent
            };
            let task = fns[i++];
            if (!task) {
                return;
            }
            let _t = task(stdinEvent || modified, next);
            if(_t && _t instanceof Response) seizeResp = _t;
        }
        await next(modified);
        if (seizeResp && seizeResp instanceof Response) {
            return seizeResp;
        }
        return modified;
    }
    app.use = function(handler: Function): void {
        fns.push(handler);
    }
    app.run = async function(): Promise<void> {
        fns.reduce(async (memo: any, e: Function) => {
            const stepRes = await e(await memo(event));
            return Promise.resolve(stepRes);
        }, Promise.resolve(event))
        Promise.resolve(new Response());
    }
    return app;
}
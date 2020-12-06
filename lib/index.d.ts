import { robotsHandler } from "./modules/robotsHandler";
import { CustomFetchEvent, GatewayOption } from "./types";
declare function gateway(event: CustomFetchEvent, options: GatewayOption): Response | CustomFetchEvent;
export { robotsHandler, gateway };

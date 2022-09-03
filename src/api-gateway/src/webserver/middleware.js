import { syncEntryPointLog, syncEndPointLog, syncErrorLog } from "./logger.js";
import handlerError from "./handleError.js";

export function beforeRouteMiddlewares(app) {
    app.use(syncEntryPointLog);
}

export function afterRouteMiddlewares(app) {
    app.use(syncEndPointLog);
    app.use(syncErrorLog);
    app.use(handlerError);
}
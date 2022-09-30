import { entryPointLog, endPointLog, errorLog } from "./web-api-logger.js";
import handlerError from "./handleError.js";

export function beforeRouteMiddlewares(app) {
    app.use(entryPointLog);
}

export function afterRouteMiddlewares(app) {
    app.use(endPointLog);
    app.use(errorLog);
    app.use(handlerError);
}
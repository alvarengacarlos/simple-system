import EventEmmiter from "events";

class Logger extends EventEmmiter {

    constructor() {
        super();
        this.addListener("async-info", (message) => {       
            const callback = (message) => {
                console.log(message);
            };

            setImmediate(callback, message);
        });

        this.addListener("async-error", (message) => {
            const callback = (message) => {
                console.error(message)
            };

            setImmediate(callback, message);            
        });

        this.addListener("sync-info", (message) => {
            console.log(message);            
        });

        this.addListener("sync-error", (message) => {            
            console.error(message);
        });
    }

    emitAsyncInfoLog(message) {
        this.emit("async-info", message)
    }

    emitAsyncErrorLog(message) {
        this.emit("async-error", message)
    }

    emitSyncInfoLog(message) {
        this.emit("sync-info", message)
    }

    emitSyncErrorLog(message) {
        this.emit("sync-error", message)
    }
    
}

//Singleton
const loggerInstance = new Logger();

//Sync logger functions
export function syncEntryPointLog(request, response, next) {
    const currentDate = Date.now();    
    loggerInstance.emitSyncInfoLog("Entry point: "+ currentDate);
    
    next(); 
}

export function syncEndPointLog(request, response, next) {
    const currentDate = Date.now();    
    loggerInstance.emitSyncInfoLog("End Point: "+ currentDate);
    
    next(); 
}

export function syncErrorLog(error, request, response, next) {    
    const currentDate = Date.now();
    loggerInstance.emitSyncErrorLog("Error: "+ currentDate);

    next(error);
}

//Async logger functions
export function asyncEntryPointLog(request, response, next) {
    const currentDate = Date.now();    
    loggerInstance.emitAsyncInfoLog("Entry Point: "+ currentDate);
    
    next();
}

export function asyncEndPointLog(request, response, next) {
    const currentDate = Date.now();    
    loggerInstance.emitAsyncInfoLog("End Point: "+ currentDate);
    
    next();
}

export function asyncErrorLog(error, request, response, next) {    
    const currentDate = Date.now();
    loggerInstance.emitAsyncErrorLog("Error: "+ currentDate);

    next(error);
}
import Logger from "../../util/Logger.js";

export function entryPointLog(request, response, next) {
    const currentDate = new Date().toLocaleString();      
    Logger.infoLog(`request from '${request.headers.host}' by '${request.headers['user-agent']}' using the '${request.method}' method for '${request.url}' url on '${currentDate}'`);
    
    next();
}

export function endPointLog(request, response, next) {
    const currentDate = new Date().toLocaleString();
    Logger.infoLog(`response on '${currentDate}' to '${request.headers.host}'  which was accessed by '${request.headers['user-agent']}' using the '${request.method}' method in the '${request.url}' url`);
    
    next();
}

export function errorLog(error, request, response, next) {    
    const currentDate = new Date().toLocaleString();
    Logger.errorLog(`error on '${currentDate}' to '${request.headers.host}'  which was accessed by '${request.headers['user-agent']}' using the '${request.method}' method in the '${request.url}' url`, error);

    //forward to handle error
    next(error);
}
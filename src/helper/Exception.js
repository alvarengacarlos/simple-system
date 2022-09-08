export default class Exception extends Error {

    constructor(message, code, httpStatusCode = 500) {
        super(JSON.stringify({
            code: code,
            message: message
        }));
        
        this._httpStatusCode = httpStatusCode;
    }

}
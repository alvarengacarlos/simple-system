export default class ValidationException extends Error {
    
    constructor(error) {
        const message = error.details.map((element) => element.message);
        
        super(JSON.stringify({message: message}));
        this._httpStatusCode = 400;
    }

}
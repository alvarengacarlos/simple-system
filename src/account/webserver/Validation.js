import Joi from "joi";

class ValidationException extends Error {
    
    constructor(error) {
        const messages = error.details.map((element) => element.message);
        
        super(JSON.stringify({messages: messages}));
        this.httpStatusCode = 400;
    }

}

export default class Validation {

    static createAccount(body) {
        const schema = Joi.object({
            email: Joi.string().email().required()
        });

        const {error} = schema.validate(body, {abortEarly: false});
        Validation.checkError(error);
    }

    static checkError(error) {
        if (error) {
            throw new ValidationException(error);
        }
    }

}
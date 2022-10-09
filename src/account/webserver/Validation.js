import Joi from "joi";

class ValidationException extends Error {
    
    constructor(error) {
        const messages = error.details.map((element) => element.message);
        
        super(JSON.stringify({messages: messages}));
        this._httpStatusCode = 400;
    }

}

export default class Validation {

    static createAccountValidation(payload) {
        const schema = Joi.object({
            email: Joi.string().trim().email().required()
        });

        const {value, error} = schema.validate(payload, {abortEarly: false});
        Validation.checkError(error);

        return value;
    }

    static checkError(error) {
        if (error) {
            throw new ValidationException(error);
        }
    }

    static confirmAccountCreationValidation(payload) {
        const schema = Joi.object({
            token: Joi.string().trim().required(),
            email: Joi.string().trim().email().required(),            
            password: Joi.string().trim().required()
        });

        const {value, error} = schema.validate(payload, {abortEarly: false});
        Validation.checkError(error);

        return value;
    }

    static deleteMyAccountValidation(payload) {
        const schema = Joi.object({
            email: Joi.string().trim().email().required(),
            password: Joi.string().trim().required(),
            token: Joi.string().trim().required()
        });

        const {value, error} = schema.validate(payload, {abortEarly: false});
        Validation.checkError(error);

        return value;
    }  
    
    static resetAccountPasswordValidation(payload) {
        const schema = Joi.object({
            email: Joi.string().trim().email().required()
        });

        const {value, error} = schema.validate(payload, {abortEarly: false});
        Validation.checkError(error);

        return value;
    }  

    static confirmResetAccountPasswordValidation(payload) {
        const schema = Joi.object({
            token: Joi.string().trim().required(),
            email: Joi.string().trim().email().required(),
            newPassword: Joi.string().trim().required()  
        });

        const {value, error} = schema.validate(payload, {abortEarly: false});
        Validation.checkError(error);

        return value;
    }

    static changeMyPassowrdValidation(payload) {
        const schema = Joi.object({
            token: Joi.string().trim().required(),
            email: Joi.string().trim().email().required(),
            oldPassword: Joi.string().trim().required(),
            newPassword: Joi.string().trim().required()  
        });

        const {value, error} = schema.validate(payload, {abortEarly: false});
        Validation.checkError(error);

        return value;
    }
    
    static loginValidation(payload) {
        const schema = Joi.object({
            email: Joi.string().trim().email().required(),
            password: Joi.string().trim().required()
        });

        const {value, error} = schema.validate(payload, {abortEarly: false});
        Validation.checkError(error);

        return value;
    }

    static logoutValidation(payload) {
        const schema = Joi.object({
            token: Joi.string().trim().required(),
            email: Joi.string().trim().email().required()
        });

        const {value, error} = schema.validate(payload, {abortEarly: false});
        Validation.checkError(error);

        return value;
    }

    
}
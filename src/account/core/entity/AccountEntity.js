import Entity from "../../../helper/Entity.js";

export default class AccountEntity extends Entity {
    
    constructor(email, password) {
        super();

        this._email = email;
        this._password = password;
    }

    getEmail() {
        return this._email;
    }

    setEmail(email) {
        this._email = email;
        
        return this;
    }

    getPassword() {
        return this._password;
    }

    setPassword(password) {
        this._password = password;
        
        return this;
    }

}
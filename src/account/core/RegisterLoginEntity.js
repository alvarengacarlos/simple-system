import Entity from "../../helper/Entity.js";

export default class RegisterLoginEntity extends Entity {

    constructor(email, token) {
        super();
        this._email = email;
        this._token = token;
    }

    getEmail() {
        return this._email;
    }

    getToken() {
        return this._token;
    }

}
import Entity from "../../../helper/Entity.js";

export default class LoginAndLogoutEntity extends Entity {

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

	setEmail(email) {
		this._email = email;
		return this;
	}

	setToken(token) {
		this._token = token;
		return this;
	}

}
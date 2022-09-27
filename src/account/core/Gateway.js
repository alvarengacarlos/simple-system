/**
 * Use this class to implement your calls such as cli, http or other.
 */
import AccountController from "./controller/AccountController.js";

export default class Gateway {

    constructor(accountController = new AccountController()) {
        this._accountController = accountController;
    }

    /**
     * 
     * @param {String} email
     */
    async firstStepToCreateAccount(email) {
        await this._accountController.firstStepToCreateAccount(email);
    }

    /**
     * 
     * @param {String} token 
     * @param {String} email 
     * @param {String} password 
     */
    async secondStepToCreateAnAccount(token, email, password) {
        await this._accountController.secondStepToCreateAnAccount(token, email, password)
    }

    /**
     * 
     * @param {String} token 
     * @param {String} email 
     * @param {String} password 
     */
    async deleteMyAccount(token, email, password) {
        await this._accountController.deleteMyAccount(token, email, password);
    }

    /**
     * 
     * @param {String} email
     */
    async firstStepToResetAccountPassword(email) {
        await this._accountController.firstStepToResetAccountPassword(email);        
    }

    /**
     * 
     * @param {String} token 
     * @param {String} email 
     * @param {String} newPassword 
     */
    async secondStepToResetAccountPassword(token, email, newPassword) {
        await this._accountController.secondStepToResetAccountPassword(token, email, newPassword);
    }

    /**
     * 
     * @param {String} token 
     * @param {String} email 
     * @param {String} oldPassword 
     * @param {String} newPassword 
     */
    async changeMyPassword(token, email, oldPassword, newPassword) {
        await this._accountController.changeMyPassword(token, email, oldPassword, newPassword);
    }

    /**
     * 
     * @param {String} email 
     * @param {String} password 
     * @returns String - the token
     */
    async login(email, password) {
        return await this._accountController.login(email, password);
    }

    /**
     * 
     * @param {String} token 
     * @param {String} email 
     */
    async logout(token, email) {
        await this._accountController.logout(token, email);
    }

}
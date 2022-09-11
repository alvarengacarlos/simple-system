import TokenService from "../../service/token/TokenService.js";
import EmailService from "../../service/email/EmailService.js";
import AccountModel from "./AccountModel.js";

export default class AccountController {

    constructor() {
        this._tokenService = new TokenService();
        this._emailService = new EmailService();
        this._accountModel = new AccountModel();
    }

    async firstStepToCreateAccount(email) {        
        const token = await this._tokenService.generateCreateAccountToken();
        this._accountModel.firstStepToCreateAccount(email, token);
                
        this._emailService.sendCreateAccountMail(email, token);
    }

    async twoStepToCreateAnAccount(token, email, password) {        
        await this._tokenService.checkCreateAccountToken(token);

        this._accountModel.twoStepToCreateAnAccount(email, password, token);
    }

    async deleteAccount(token, email, password) {
        await this._tokenService.checkLoginToken(token);
        
        this._accountModel.deleteAnAccount(email, password);
    }

    async firstStepToResetAccountPassword(email) {        
        const token = await this._tokenService.generateResetPasswordToken();
        
        this._accountModel.firstStepToResetAccountPassword(email, token);
        
        this._emailService.sendResetPasswordMail(email, token);
    }

    async secondStepToResetAccountPassword(token, email, newPassword) {
        await this._tokenService.checkResetPasswordToken(token);
        
        this._accountModel.secondStepToResetAccountPassword(email, newPassword, token);        
    }

    async changePassword(token, email, oldPassword, newPassword) {
        await this._tokenService.checkLoginToken(token);

        this._accountModel.changePassword(email, oldPassword, newPassword);
    }

    async login(email, password) {
        const token = await this._tokenService.generateLoginToken();
        
        this._accountModel.login(email, password, token);
    }

    async logout(token, email) {
        await this._tokenService.checkLoginToken(token);
        
        this._accountModel.logout(email);
    }

}
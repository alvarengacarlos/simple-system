import TokenService from "../../../service/token/TokenService.js";
import EmailService from "../../../service/email/EmailService.js";
import AccountModel from "../model/AccountModel.js";

export default class AccountController {

	constructor() {
		this._tokenService = new TokenService();
		this._emailService = new EmailService();
		this._accountModel = new AccountModel();
	}

	async firstStepToCreateAccount(email) {        
		const token = await this._tokenService.generateCreateAccountToken();
		await this._accountModel.firstStepToCreateAccount(email, token);
                
		await this._emailService.sendCreateAccountMail(email, token);
	}

	async secondStepToCreateAnAccount(token, email, password) {        
		await this._tokenService.checkCreateAccountToken(token);

		await this._accountModel.secondStepToCreateAnAccount(email, password, token);
	}

	async deleteMyAccount(token, email, password) {
		await this._tokenService.checkLoginToken(token);
        
		await this._accountModel.deleteMyAccount(email, password);
	}

	async firstStepToResetAccountPassword(email) {        
		const token = await this._tokenService.generateResetPasswordToken();
        
		await this._accountModel.firstStepToResetAccountPassword(email, token);
        
		await this._emailService.sendResetPasswordMail(email, token);
	}

	async secondStepToResetAccountPassword(token, email, newPassword) {
		await this._tokenService.checkResetPasswordToken(token);
        
		await this._accountModel.secondStepToResetAccountPassword(email, newPassword, token);        
	}

	async changeMyPassword(token, email, oldPassword, newPassword) {
		await this._tokenService.checkLoginToken(token);

		await this._accountModel.changeMyPassword(email, oldPassword, newPassword);
	}

	async login(email, password) {
		const token = await this._tokenService.generateLoginToken();
        
		await this._accountModel.login(email, password, token);

		return token;
	}

	async logout(token, email) {
		await this._tokenService.checkLoginToken(token);
        
		await this._accountModel.logout(email);
	}

}
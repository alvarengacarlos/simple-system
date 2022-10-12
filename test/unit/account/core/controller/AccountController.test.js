import { it, describe, before, beforeEach, afterEach } from "mocha";
import { expect } from "chai";
import chai from "chai";
import { faker } from "@faker-js/faker";
import sinon from "sinon";
import chaiAsPromised from "chai-as-promised";

chai.use(chaiAsPromised);

import AccountController from "../../../../../src/account/core/controller/AccountController.js";
import AccountModel from "../../../../../src/account/core/model/AccountModel.js";
import EmailService from "../../../../../src/service/email/EmailService.js";
import TokenService from "../../../../../src/service/token/TokenService.js";

describe("AccountController", () => {

	let email, password, newPassword, token;
	before(() => {
		email = faker.internet.email();
		password = faker.internet.password();
		newPassword = faker.internet.password();
		token = faker.datatype.uuid();        
	});

	let accountController;
	let emailServiceMock, tokenServiceMock, accountModelMock;    
	beforeEach(() => {
		const emailService = new EmailService();
		const tokenService = new TokenService();
		const accountModel = new AccountModel();

		accountController = new AccountController();
		accountController._emailService = emailService;
		accountController._tokenService = tokenService;
		accountController._accountModel = accountModel;

		emailServiceMock = sinon.mock(emailService);
		tokenServiceMock = sinon.mock(tokenService);
		accountModelMock = sinon.mock(accountModel);        
	});

	afterEach(() => {
		emailServiceMock.restore();
		tokenServiceMock.restore();
		accountModelMock.restore();
	});

	describe("firstStepToCreateAccount", () => {

		it(`given the new email
            when request to first step to create an account
            then it must generate create account token
            and execute the first step to create an account in the model
            and send email to email received`,
		async () => {            
			tokenServiceMock.expects("generateCreateAccountToken")
				.withArgs()
				.once()
				.returns(token);

			accountModelMock.expects("firstStepToCreateAccount")
				.withArgs(email, token)
				.once()
				.returns(null);

			emailServiceMock.expects("sendCreateAccountMail")
				.withArgs(email, token)
				.once()
				.returns(null);           
            
			await expect(
				accountController.firstStepToCreateAccount(email)
			).to.not.rejectedWith(Error);
            
			tokenServiceMock.verify();
			accountModelMock.verify();
			emailServiceMock.verify();
		});

	});

	describe("secondStepToCreateAnAccount", () => {

		it(`given the token, email registered in first step to create account and password
            when request to second step to create an account
            then it must check the create account token
            and execute the second step to create an account in the model`,
		async () => {            
			tokenServiceMock.expects("checkCreateAccountToken")
				.withArgs(token)
				.once()
				.returns(null);

			accountModelMock.expects("secondStepToCreateAnAccount")
				.withArgs(email, password, token)
				.once()
				.returns(null);

			await expect(
				accountController.secondStepToCreateAnAccount(token, email, password)
			).to.be.not.rejectedWith(Error);

			tokenServiceMock.verify();
			accountModelMock.verify();
		});

	});
    
	describe("deleteMyAccount", () => {

		it(`given the token, email registered and password
            when request to delete account
            then it must check the login token
            and execute the delete my account in the model`,
		async () => {            
			tokenServiceMock.expects("checkLoginToken")
				.withArgs(token)
				.once()
				.returns(null);

			accountModelMock.expects("deleteMyAccount")
				.withArgs(email, password)
				.once()
				.returns(null);

			await expect(
				accountController.deleteMyAccount(token, email, password)
			).to.be.not.rejectedWith(Error);

			tokenServiceMock.verify();
			accountModelMock.verify();
		});

	});


	describe("firstStepToResetAccountPassword", () => {

		it(`given email registered
            when request to first step to reset account password
            then it must generate reset password token
            and execute the first step to reset account password in the model
            and send reset password email`,
		async () => {            
			tokenServiceMock.expects("generateResetPasswordToken")
				.withArgs()
				.once()
				.returns(token);

			accountModelMock.expects("firstStepToResetAccountPassword")
				.withArgs(email, token)
				.once()
				.returns(null);

			emailServiceMock.expects("sendResetPasswordMail")
				.withArgs(email, token)
				.once()
				.returns(null);

			await expect(
				accountController.firstStepToResetAccountPassword(email)
			).to.not.rejectedWith(Error);
            
			tokenServiceMock.verify();
			accountModelMock.verify();
			emailServiceMock.verify();
		});

	});

	describe("secondStepToResetAccountPassword", () => {

		it(`given the token received in the first step to reset accout password, email and new password
            when request to second step to reset account password
            then it must check the reset password token received
            and execute the second step to reset account password in the model`,
		async () => {            
			tokenServiceMock.expects("checkResetPasswordToken")
				.withArgs(token)
				.once()
				.returns(null);

			accountModelMock.expects("secondStepToResetAccountPassword")
				.withArgs(email, newPassword, token)
				.once()
				.returns(null);

			await expect(
				accountController.secondStepToResetAccountPassword(token, email, newPassword)
			).to.be.not.rejectedWith(Error);

			tokenServiceMock.verify();
			accountModelMock.verify();            
		});

	});

	describe("changeMyPassword", () => {

		it(`given the loged token, email, old password and new password
            when request to change my password
            then it must check the loged token
            and execute the change my password in the model`,
		async () => {            
			tokenServiceMock.expects("checkLoginToken")
				.withArgs(token)
				.once()
				.returns(null);

			accountModelMock.expects("changeMyPassword")
				.withArgs(email, password, newPassword)
				.once()
				.returns(null);

			await expect(
				accountController.changeMyPassword(token, email, password, newPassword)
			).to.be.not.rejectedWith(Error);

			tokenServiceMock.verify();
			accountModelMock.verify();            
		});

	});

	describe("login", () => {

		it(`given the email and password
            when request to login
            then it must generate the token
            and execute the login in the model`,
		async () => {            
			tokenServiceMock.expects("generateLoginToken")
				.withArgs()
				.once()
				.returns(token);

			accountModelMock.expects("login")
				.withArgs(email, password, token)
				.once()
				.returns(null);

			const result = await accountController.login(email, password);
            
			expect(result).to.eql(token);
			tokenServiceMock.verify();
			accountModelMock.verify();            
		});

	});

	describe("logout", () => {

		it(`given the token received in the login and email
            when request to logout
            then it must generate the token
            and execute the logout in the model`,
		async () => {
			tokenServiceMock.expects("checkLoginToken")
				.withArgs(token)
				.once()
				.returns(token);

			accountModelMock.expects("logout")
				.withArgs(email)
				.once()
				.returns(null);

			await expect(
				accountController.logout(token, email)
			).to.be.not.rejectedWith(Error);

			tokenServiceMock.verify();
			accountModelMock.verify();            
		});

	});

});
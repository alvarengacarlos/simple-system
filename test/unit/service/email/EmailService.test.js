import { describe, it, before, beforeEach, afterEach } from "mocha";
import sinon from "sinon";
import chai, { expect } from "chai";
import { faker } from "@faker-js/faker";
import chaiAsPromised from "chai-as-promised";

import process from "process";

chai.use(chaiAsPromised);

import EmailService from "../../../../src/service/email/EmailService.js";

describe("EmailService", () => {

	let receiver, token;
	before(() => {
		receiver = faker.internet.email();
		token = faker.datatype.uuid();        
	});

	let emailService;
	let emailServiceMock;
	beforeEach(() => {
		emailService = new EmailService();

		emailServiceMock = sinon.mock(emailService);
		emailServiceMock.expects("_sendMail")            
			.once()
			.returns({messageId: "<b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>"});
	});

	afterEach(() => {
		emailServiceMock.restore();
	});

	describe("_fixDomainName", () => {

		it("it must add a slash in the end of string", () => {
			process.env.APPLICATION_DOMAIN_NAME="http://localhost:3000";
			const emailService = new EmailService();

			const domainName = emailService._fixDomainName();

			expect(domainName.endsWith("/")).to.be.true;
		});

		it("it must not add a slash in the end of string", () => {
			process.env.APPLICATION_DOMAIN_NAME="http://localhost:3000/";
			const emailService = new EmailService();

			const domainName = emailService._fixDomainName();

			expect(domainName.endsWith("/")).to.be.true;
			expect(domainName[domainName.length - 2]).to.eql("0");
		});

	});

	describe("sendCreateAccountMail", () => {

		it("it must sucessfully to send email", async () => {
			await expect(emailService.sendCreateAccountMail(receiver, token)).to.not.be.rejectedWith(Error);
			emailServiceMock.verify();
		});
        
		it("it must throw an error because the receiver is undefined", async () => {
			await expect(emailService.sendCreateAccountMail()).to.be.rejectedWith(Error);
		});

		it("it must throw an error because the token is undefined", async () => {            
			await expect(emailService.sendCreateAccountMail(receiver)).to.be.rejectedWith(Error);
		});

	});

	describe("sendResetPasswordMail", () => {

		it("it must sucessfully to send email", async () => {
			await expect(emailService.sendResetPasswordMail(receiver, token)).to.not.be.rejectedWith(Error);
			emailServiceMock.verify();
		});
        
		it("it must throw an error because the receiver is undefined", async () => {
			await expect(emailService.sendResetPasswordMail()).to.be.rejectedWith(Error);
		});

		it("it must throw an error because the token is undefined", async () => {            
			await expect(emailService.sendResetPasswordMail(receiver)).to.be.rejectedWith(Error);
		});

	});

});
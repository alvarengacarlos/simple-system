import { it, describe, before, after, beforeEach, afterEach } from "mocha";
import { expect } from "chai";
import sinon from "sinon";
import { faker } from "@faker-js/faker";

import Gateway from "../../../../src/account/core/Gateway.js";
import ConnectionMongoDb from "../../../../src/infrasctructure/database/ConnectionMongoDb.js";
import AccountController from "../../../../src/account/core/controller/AccountController.js";
import EmailService from "../../../../src/service/email/EmailService.js";

describe("Gateway", () => {

    const TIMEOUT = 10000;
    async function retrieveAnEntityHelper(collection, filter) {
        const entity = await connection.collection(collection)
            .findOne(filter);        

        if (!entity) {
            return null
        }
        
        return entity;
    }


    let connection;
    before(async () => {
        connection = await ConnectionMongoDb.getConnection();
    });

    let gateway;    
    let emailServiceMock;
    let email, password, newPassword;
    beforeEach(() => {        
        const emailService = new EmailService();
        emailServiceMock = sinon.mock(emailService);

        const accountController = new AccountController();
        accountController._emailService = emailService;

        gateway = new Gateway(accountController);

        email = faker.internet.email();
        password = faker.internet.password();
        newPassword = faker.internet.password();
    });

    afterEach(() => {
        emailServiceMock.restore();
    });

    describe("firstStepToCreateAccount and secondStepToCreateAnAccount", () => {

        it(`it must execute the first step to create an account with successfully
            and execute the second step to create an account`,
        async () => {
            emailServiceMock.expects("sendCreateAccountMail")
                .once()
                .returns();

            await gateway.firstStepToCreateAccount(email);

            const retrievedTemporaryAccountEntity1 = await retrieveAnEntityHelper("temporaryAccount", {_email: email});

            emailServiceMock.verify();
            expect(retrievedTemporaryAccountEntity1).to.be.not.null;            
            expect(retrievedTemporaryAccountEntity1._token).to.be.not.undefined;
            expect(retrievedTemporaryAccountEntity1._email).to.be.not.undefined;
            expect(retrievedTemporaryAccountEntity1._id).to.be.not.undefined;
            expect(retrievedTemporaryAccountEntity1._createdAt).to.be.not.undefined;
            expect(retrievedTemporaryAccountEntity1._updatedAt).to.be.not.undefined;
                        
            const token = retrievedTemporaryAccountEntity1._token;
            await gateway.secondStepToCreateAnAccount(token, email, password);

            const retrievedTemporaryAccountEntity2 = await retrieveAnEntityHelper("temporaryAccount", {_email: email});
            const retrievedAccount = await retrieveAnEntityHelper("account", {_email: email});

            expect(retrievedTemporaryAccountEntity2).to.null;
            expect(retrievedAccount).to.be.not.null;
            expect(retrievedAccount._email).to.be.not.undefined;
            expect(retrievedAccount._password).to.be.not.undefined;
            expect(retrievedAccount._id).to.be.not.undefined;
            expect(retrievedAccount._createdAt).to.be.not.undefined;
            expect(retrievedAccount._updatedAt).to.be.not.undefined;
        }).timeout(TIMEOUT);

    })

    describe("login and logout", () => {

        it("it must do login", async () => {
            await gateway.firstStepToCreateAccount(email);
            const retrievedTemporaryAccountEntity1 = await retrieveAnEntityHelper("temporaryAccount", {_email: email});
            await gateway.secondStepToCreateAnAccount(retrievedTemporaryAccountEntity1._token, email, password);

            const token = await gateway.login(email, password);

            const retrievedAccount1 = await retrieveAnEntityHelper("loginAndLogout", {_email: email});

            expect(token).to.be.not.undefined;
            expect(retrievedAccount1._email).to.be.not.null;
            expect(retrievedAccount1._token).to.be.not.undefined;
            expect(retrievedAccount1._updatedAt).to.be.not.undefined;
            expect(retrievedAccount1._createdAt).to.be.not.undefined;
            expect(retrievedAccount1._id).to.be.not.undefined;

            await gateway.logout(token, email);

            const retrievedAccount2 = await retrieveAnEntityHelper("loginAndLogout", {_email: email});
            expect(retrievedAccount2).to.be.null;
        }).timeout(TIMEOUT);

    });

    describe("deleteMyAccount", () => {

        it("it must delete the account", async () => {
            await gateway.firstStepToCreateAccount(email);
            const retrievedTemporaryAccountEntity1 = await retrieveAnEntityHelper("temporaryAccount", {_email: email});
            await gateway.secondStepToCreateAnAccount(retrievedTemporaryAccountEntity1._token, email, password);
            
            const token = await gateway.login(email, password);
            await gateway.deleteMyAccount(token, email, password);

            const retrievedAccount1 = await retrieveAnEntityHelper("account", {_email: email});
            const retrievedAccount2 = await retrieveAnEntityHelper("loginAndLogout", {_email: email});
            
            expect(retrievedAccount1).to.be.null;
            expect(retrievedAccount2).to.be.null;
        }).timeout(TIMEOUT);

    });
    
    describe("firstStepToResetAccountPassword and secondStepToResetAccountPassword", () => {

        it("it must reset the account password", async () => {
            emailServiceMock.expects("sendResetPasswordMail")
                .once()
                .returns();

            await gateway.firstStepToCreateAccount(email);
            const retrievedTemporaryAccountEntity1 = await retrieveAnEntityHelper("temporaryAccount", {_email: email});
            await gateway.secondStepToCreateAnAccount(retrievedTemporaryAccountEntity1._token, email, password);

            await gateway.firstStepToResetAccountPassword(email);
            const retrievedTemporaryAccountEntity2 = await retrieveAnEntityHelper("temporaryAccount", {_email: email});
            await gateway.secondStepToResetAccountPassword(retrievedTemporaryAccountEntity2._token, email, newPassword);

            const retrievedAccount = await retrieveAnEntityHelper("account", {_email: email});
            const retrievedTemporaryAccountEntity3 = await retrieveAnEntityHelper("temporaryAccount", {_email: email});
            
            emailServiceMock.verify();
            expect(retrievedAccount).to.be.not.null;
            expect(retrievedAccount._email).to.be.not.undefined;
            expect(retrievedAccount._password).to.be.not.undefined;
            expect(retrievedAccount._id).to.be.not.undefined;
            expect(retrievedAccount._createdAt).to.be.not.undefined;
            expect(retrievedAccount._updatedAt).to.be.not.undefined;
            expect(retrievedTemporaryAccountEntity3).to.be.null;

            const token = await gateway.login(email, newPassword);

            expect(token).to.be.not.null;
        }).timeout(TIMEOUT);
        
    });

    describe("changeMyPassword", () => {

        it("it must change the password", async () => {
            await gateway.firstStepToCreateAccount(email);
            const retrievedTemporaryAccountEntity1 = await retrieveAnEntityHelper("temporaryAccount", {_email: email});
            await gateway.secondStepToCreateAnAccount(retrievedTemporaryAccountEntity1._token, email, password);

            const token1 = await gateway.login(email, password);
            await gateway.changeMyPassword(token1, email, password, newPassword);

            const retrievedAccount = await retrieveAnEntityHelper("account", {_email: email});

            expect(retrievedAccount).to.be.not.null;
            expect(retrievedAccount._email).to.be.not.undefined;
            expect(retrievedAccount._password).to.be.not.undefined;
            expect(retrievedAccount._id).to.be.not.undefined;
            expect(retrievedAccount._createdAt).to.be.not.undefined;
            expect(retrievedAccount._updatedAt).to.be.not.undefined;

            await gateway.logout(token1, email);
            const token2 = await gateway.login(email, newPassword);

            expect(token2).to.be.not.null;
        }).timeout(TIMEOUT);

    });

});
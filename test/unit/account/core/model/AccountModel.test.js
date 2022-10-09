import { it, describe, before, beforeEach, afterEach } from "mocha";
import { expect } from "chai";
import chai from "chai";
import { faker } from "@faker-js/faker";
import sinon from "sinon";
import chaiAsPromised from "chai-as-promised";

chai.use(chaiAsPromised);

import AccountModel from "../../../../../src/account/core/model/AccountModel.js";
import AccountRepository from "../../../../../src/account/core/repository/AccountRepository.js";
import TemporaryAccountRepository from "../../../../../src/account/core/repository/TemporaryAccountRepository.js";
import LoginAndLogoutRepository from "../../../../../src/account/core/repository/LoginAndLogoutRepository.js";
import Exception from "../../../../../src/helper/Exception.js";

describe("AccountModel.js", () => {

    let email, password, token;
    before(() => {
        email = faker.internet.email();
        password = faker.internet.password();
        token = `${faker.datatype.uuid()}.${faker.datatype.uuid()}.${faker.datatype.uuid()}`;
    });

    let accountModel;
    let accountRepositoryMock, temporaryAccountRepositoryMock, loginAndLogoutRepositoryMock;
    beforeEach(() => {                
        const accountRepository = new AccountRepository();
        const temporaryAccountRepository = new TemporaryAccountRepository();
        const loginAndLogoutRepository = new LoginAndLogoutRepository(); 

        accountModel = new AccountModel();                
        accountModel._accountRepository = accountRepository;
        accountModel._temporaryAccountRepository = temporaryAccountRepository;
        accountModel._loginAndLogoutRepository = loginAndLogoutRepository;

        accountRepositoryMock = sinon.mock(accountRepository);
        temporaryAccountRepositoryMock = sinon.mock(temporaryAccountRepository);
        loginAndLogoutRepositoryMock = sinon.mock(loginAndLogoutRepository);
    });

    afterEach(() => {
        accountRepositoryMock.restore();
        temporaryAccountRepositoryMock.restore();
    });
    
    describe("firstStepToCreateAccount", () => {

        it(`given an email belonging to an account             
            when requested to execute the first step to create an account
            then it must throw the email already belongs to an account exception`,
        async () => {
            accountRepositoryMock.expects("retrieveAnAccountEntityByEmail")
                .withArgs(email)
                .once()
                .returns("ACCOUNT");

            await expect(
                accountModel.firstStepToCreateAccount(email, token)
            ).to.be.rejectedWith(Exception);

            accountRepositoryMock.verify();            
            temporaryAccountRepositoryMock.verify();
        });       
        
        it(`given an email not belonging to an account 
            but belonging a temporary account            
            when requested to execute the first step to create an account
            then it must throw the email already in the registration process exception`,
        async () => {
            accountRepositoryMock.expects("retrieveAnAccountEntityByEmail")
                .withArgs(email)
                .once()
                .returns(null);

            temporaryAccountRepositoryMock.expects("retrieveAnTemporaryAccountEntityByEmail")
                .withArgs(email)
                .once()
                .returns("TEMPORARY_ACCOUNT");

            await expect(
                accountModel.firstStepToCreateAccount(email, token)
            ).to.be.rejectedWith(Exception);

            accountRepositoryMock.verify();            
            temporaryAccountRepositoryMock.verify();            
        });

        it(`given an email not belonging to an account 
            and a temporary account            
            when requested to execute the first step to create an account
            then it must create a temporary account
            and create a timer to clear the temporary account 
            in case of do not execute the second step of account creation`,
        async () => {
            accountRepositoryMock.expects("retrieveAnAccountEntityByEmail")
                .withArgs(email)
                .once()
                .returns(null);

            temporaryAccountRepositoryMock.expects("retrieveAnTemporaryAccountEntityByEmail")
                .withArgs(email)
                .once()
                .returns(null);

            temporaryAccountRepositoryMock.expects("saveEntity")
                .once()                
                .returns();

            await expect(
                accountModel.firstStepToCreateAccount(email, token)
            ).to.be.not.rejectedWith(Exception);

            accountRepositoryMock.verify();
            temporaryAccountRepositoryMock.verify();                      
        });

    });

    describe("secondStepToCreateAnAccount", () => {

        it(`given email not belonging an temporary account
            when requested to execute the second step to create an account
            then it must throw the email is not in the registration process exception`,
        async () => {
            temporaryAccountRepositoryMock.expects("retrieveAnTemporaryAccountEntityByEmailAndToken")
                .withArgs(email, token)
                .once()
                .returns(null);

            await expect(
                accountModel.secondStepToCreateAnAccount(email, password, token)
            ).to.be.rejectedWith(Exception);

            temporaryAccountRepositoryMock.verify();            
        });

        it(`given email belonging an temporary account
            when requested to execute the second step to create an account
            then it must encrypt the password received
            and create an account
            and delete the temporary account`,
        async () => {
            temporaryAccountRepositoryMock.expects("retrieveAnTemporaryAccountEntityByEmailAndToken")
                .withArgs(email, token)
                .once()
                .returns("TEMPORARY_ACCOUNT");
            
            temporaryAccountRepositoryMock.expects("deleteAnTemporaryAccountEntityByEmail")
                .withArgs(email)
                .once()
                .returns();

            accountRepositoryMock.expects("saveEntity")
                .once()
                .returns();

            await expect(
                accountModel.secondStepToCreateAnAccount(email, password, token)
            ).to.be.not.rejectedWith(Exception);
            temporaryAccountRepositoryMock.verify();

            accountRepositoryMock.verify();
        })

    });

    describe("deleteMyAccount", () => {
        
        it(`given a registered account
            when requested to delete it
            then it must encrypt the received password
            and retrieve the account
            and not found the account
            and throw the password is incorrect exception`,
        async () => {
            accountRepositoryMock.expects("retrieveAnAccountEntityByEmailAndPassword")                
                .once()
                .returns(null);
                
            await expect(
                accountModel.deleteMyAccount(email, password)
            ).to.be.rejectedWith(Exception);

            accountRepositoryMock.verify();
        });
        
        it(`given a registered account
            when requested to delete it
            then it must encrypt the received password
            and retrieve the account
            and found the account
            and delete it`,
        async () => {
            accountRepositoryMock.expects("retrieveAnAccountEntityByEmailAndPassword")                
                .once()
                .returns({
                    getId: sinon.stub(),
                    getEmail: sinon.stub(),
                    getPassword: sinon.stub()
                });
                
            accountRepositoryMock.expects("deleteAnAccountEntityByIdEmailAndPassword")
                .once()
                .returns(null);

            loginAndLogoutRepositoryMock.expects("deleteAnLoginAndLogoutEntityByEmail")
                .once()
                .returns(null);

            await expect(
                accountModel.deleteMyAccount(email, password)
            ).to.be.not.rejectedWith(Exception);

            accountRepositoryMock.verify();
            loginAndLogoutRepositoryMock.verify();
        });

    });

    describe("firstStepToResetAccountPassword", () => {

        it(`given a registered account
            when requested to execute the first step to reset acount password
            then it must retrieve the account
            and not found the account
            and throw the email does not belong to an account exception`,
        async () => {            
            accountRepositoryMock.expects("retrieveAnAccountEntityByEmail")
                .withArgs(email)
                .once()
                .returns(null);

            await expect(
                accountModel.firstStepToResetAccountPassword(email, token)
            ).to.be.rejectedWith(Exception);

            accountRepositoryMock.verify();
        });

        it(`given a registered account
            when requested to execute the first step to reset acount password
            then it must retrieve the account
            and found the account
            and create a request to reset password
            and create a timer to clear the temporary account`,
        async () => {            
            accountRepositoryMock.expects("retrieveAnAccountEntityByEmail")
                .withArgs(email)
                .once()
                .returns("ACCOUNT");

            temporaryAccountRepositoryMock.expects("saveEntity")
                .once()                
                .returns();

            await expect(
                accountModel.firstStepToResetAccountPassword(email, token)
            ).to.be.not.rejectedWith(Exception);

            accountRepositoryMock.verify();
            temporaryAccountRepositoryMock.verify();
        });

    });

    describe("secondStepToResetAccountPassword", () => {

        it(`given a registered account 
            and a registered temporary account
            when requested to execute the second step to reset account password
            then it must retrieve the temporary account
            and not found the temporary account
            and throw the email is not in the reset password process exception`,
        async () => {
            temporaryAccountRepositoryMock.expects("retrieveAnTemporaryAccountEntityByEmailAndToken")
                .withArgs(email, token)
                .once()
                .returns(null);

            await expect(
                accountModel.secondStepToResetAccountPassword(email, password, token)
            ).to.be.rejectedWith(Exception);

            temporaryAccountRepositoryMock.verify();
        });
        
        it(`given a registered account 
            and a registered temporary account
            when requested to execute the second step to reset account password
            then it must retrieve the temporary account
            and found the temporary account
            and encrypt the received password
            and retrieve the account            
            and update the account password
            and delete the temporary account`,
        async () => {
            temporaryAccountRepositoryMock.expects("retrieveAnTemporaryAccountEntityByEmailAndToken")
                .withArgs(email, token)
                .once()
                .returns("TEMPORARY_ACCOUNT");

            temporaryAccountRepositoryMock.expects("deleteAnTemporaryAccountEntityByEmail")
                .withArgs(email)
                .once()
                .returns();

            accountRepositoryMock.expects("retrieveAnAccountEntityByEmail")
                .withArgs(email)
                .once()
                .returns({
                    getId: sinon.stub()
                });

            accountRepositoryMock.expects("updateAnAccountEntityPasswordById")                
                .once()
                .returns({
                    getId: sinon.stub()
                });

            await expect(
                accountModel.secondStepToResetAccountPassword(email, password, token)
            ).to.be.not.rejectedWith(Exception);
            
            temporaryAccountRepositoryMock.verify();
            accountRepositoryMock.verify();
        });

    });

    describe("changeMyPassword", () => {

        it(`given a registered account
            when requested to execute the change my password
            then it must encrypt the received password
            and retrieve the account
            and not found the account
            and throw the password is incorrect exception`,
        async () => {
            accountRepositoryMock.expects("retrieveAnAccountEntityByEmailAndPassword")
                .once()
                .returns(null);

            const newPassword = faker.internet.password();
            await expect(           
                accountModel.changeMyPassword(email, password, newPassword)
            ).to.be.rejectedWith(Exception);

            accountRepositoryMock.verify();
        });

        it(`given a registered account
            when requested to execute the change my password
            it must encrypt the received password
            and retrieve the account
            and found the account
            and encrypt the new password
            and update the account password`,
        async () => {
            accountRepositoryMock.expects("retrieveAnAccountEntityByEmailAndPassword")
                .once()
                .returns({
                    getId: sinon.stub()
                });

            accountRepositoryMock.expects("updateAnAccountEntityPasswordById")
                .once()
                .returns();

            const newPassword = faker.internet.password();
            await expect(
                accountModel.changeMyPassword(email, password, newPassword)
            ).to.be.not.rejectedWith(Exception);

            accountRepositoryMock.verify();
        });

    });

    describe("login", () => {

        it(`given a registered account
            when requested to execute the login
            then it must encrypt the received password
            and retrieve the account
            and not found the account            
            and throw the email or password are incorrect exception`,
        async () => {
            accountRepositoryMock.expects("retrieveAnAccountEntityByEmailAndPassword")
                .once()
                .returns(null);

            await expect(
                accountModel.login(email, password, token)
            ).to.be.rejectedWith(Exception);

            accountRepositoryMock.verify();
            loginAndLogoutRepositoryMock.verify();
        });

        it(`given a registered account
            when requested to execute the login
            then it must encrypt the received password
            and retrieve the account
            and found the account
            and retrieve the login
            and found the login
            and throw you are already logged in exception`,
        async () => {
            accountRepositoryMock.expects("retrieveAnAccountEntityByEmailAndPassword")
                .once()
                .returns("ACCOUNT");

            loginAndLogoutRepositoryMock.expects("retriveAnLoginAndLogoutEntityByEmail")
                .withArgs(email)
                .once()
                .returns("LOGIN_REGISTER");

            await expect(
                accountModel.login(email, password, token)
            ).to.be.rejectedWith(Exception);

            accountRepositoryMock.verify();
            loginAndLogoutRepositoryMock.verify();
        });

        it(`given a registered account
            when requested to execute the login
            then it must encrypt the received password
            and retrieve the account
            and found the account
            and retrieve the login
            and not found the login
            and create the login`,
        async () => {
            accountRepositoryMock.expects("retrieveAnAccountEntityByEmailAndPassword")
                .once()
                .returns("ACCOUNT");

            loginAndLogoutRepositoryMock.expects("retriveAnLoginAndLogoutEntityByEmail")
                .withArgs(email)
                .once()
                .returns(null);
            
            loginAndLogoutRepositoryMock.expects("saveEntity")
                .once()
                .returns();

            await expect(
                accountModel.login(email, password, token)
            ).to.be.not.rejectedWith(Exception);

            accountRepositoryMock.verify();
            loginAndLogoutRepositoryMock.verify();
        });

    });

    describe("logout", () => {

        it(`given a registered account
            when requested to execute the logout
            then it must retrieve the login register
            and not found the login register
            and throw the account is not logged exception`,
        async () => {
            loginAndLogoutRepositoryMock.expects("retriveAnLoginAndLogoutEntityByEmail")
                .withArgs(email)
                .once()
                .returns(null);

            await expect(
                accountModel.logout(email)
            ).to.be.rejectedWith(Exception);  

            loginAndLogoutRepositoryMock.verify();
        });

        it(`given a registered account
            when requested to execute the logout
            then it must retrieve the login register
            and found the login register
            and delete the login register`,
        async () => {
            loginAndLogoutRepositoryMock.expects("retriveAnLoginAndLogoutEntityByEmail")
                .withArgs(email)
                .once()
                .returns("LOGIN_REGISTER");

            loginAndLogoutRepositoryMock.expects("deleteAnLoginAndLogoutEntityByEmail")
                .withArgs(email)
                .once()
                .returns();

            await expect(
                accountModel.logout(email)
            ).to.be.not.rejectedWith(Exception);

            loginAndLogoutRepositoryMock.verify();
        });

    });

});
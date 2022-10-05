import { it, describe, before, beforeEach, afterEach } from "mocha";
import { expect } from "chai";
import { faker } from "@faker-js/faker";
import sinon from "sinon";

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
        () => {
            accountRepositoryMock.expects("retrieveAnAccountByEmail")
                .withArgs(email)
                .once()
                .returns("ACCOUNT");

            expect(() => 
                accountModel.firstStepToCreateAccount(email, token)
            ).to.throw(Exception);
            accountRepositoryMock.verify();            
            temporaryAccountRepositoryMock.verify();
        });       
        
        it(`given an email not belonging to an account 
            but belonging a temporary account            
            when requested to execute the first step to create an account
            then it must throw the email already in the registration process exception`,
        () => {
            accountRepositoryMock.expects("retrieveAnAccountByEmail")
                .withArgs(email)
                .once()
                .returns(null);

            temporaryAccountRepositoryMock.expects("retrieveAnTemporaryAccountEntityByEmail")
                .withArgs(email)
                .once()
                .returns("TEMPORARY_ACCOUNT");

            expect(() => 
                accountModel.firstStepToCreateAccount(email, token)
            ).to.throw(Exception);
            accountRepositoryMock.verify();            
            temporaryAccountRepositoryMock.verify();            
        });

        it(`given an email not belonging to an account 
            and a temporary account            
            when requested to execute the first step to create an account
            then it must create a temporary account
            and create a timer to clear the temporary account 
            in case of do not execute the second step of account creation`,
        () => {
            accountRepositoryMock.expects("retrieveAnAccountByEmail")
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

            expect(() => 
                accountModel.firstStepToCreateAccount(email, token)
            ).to.not.throw(Exception);

            accountRepositoryMock.verify();
            temporaryAccountRepositoryMock.verify();                      
        });

    });

    describe("secondStepToCreateAnAccount", () => {

        it(`given email not belonging an temporary account
            when requested to execute the second step to create an account
            then it must throw the email is not in the registration process exception`,
        () => {
            temporaryAccountRepositoryMock.expects("retrieveAnTemporaryAccountEntityByEmailAndToken")
                .withArgs(email, token)
                .once()
                .returns(null);

            expect(() => {
                accountModel.secondStepToCreateAnAccount(email, password, token);
            }).to.throw(Exception);
            temporaryAccountRepositoryMock.verify();            
        });

        it(`given email belonging an temporary account
            when requested to execute the second step to create an account
            then it must encrypt the password received
            and create an account
            and delete the temporary account`,
        () => {
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

            expect(() => {
                accountModel.secondStepToCreateAnAccount(email, password, token);
            }).to.not.throw(Exception);
            temporaryAccountRepositoryMock.verify();
            accountRepositoryMock.verify();
        })

    });

    describe("deleteAnAccount", () => {
        
        it(`given a registered account
            when requested to delete it
            then it must encrypt the received password
            and retrieve the account
            and not found the account
            and throw the password is incorrect exception`,
        () => {
            accountRepositoryMock.expects("retrieveAnAccountByEmailAndPassword")                
                .once()
                .returns(null);
                
            expect(() => {
                accountModel.deleteMyAccount(email, password);
            }).to.throw(Exception);
            accountRepositoryMock.verify();
        });
        
        it(`given a registered account
            when requested to delete it
            then it must encrypt the received password
            and retrieve the account
            and found the account
            and delete it`,
        () => {
            accountRepositoryMock.expects("retrieveAnAccountByEmailAndPassword")                
                .once()
                .returns({
                    getId: sinon.stub(),
                    getEmail: sinon.stub(),
                    getPassword: sinon.stub()
                });
                
            accountRepositoryMock.expects("deleteAnAccountByIdEmailAndPassword")
                .once()
                .returns(null);

            expect(() => {
                accountModel.deleteMyAccount(email, password);
            }).to.not.throw(Exception);
            accountRepositoryMock.verify();
        });

    });

    describe("firstStepToResetAccountPassword", () => {

        it(`given a registered account
            when requested to execute the first step to reset acount password
            then it must retrieve the account
            and not found the account
            and throw the email does not belong to an account exception`,
        () => {            
            accountRepositoryMock.expects("retrieveAnAccountByEmail")
                .withArgs(email)
                .once()
                .returns(null);

            expect(() => 
                accountModel.firstStepToResetAccountPassword(email, token)
            ).to.throw(Exception);

            accountRepositoryMock.verify();
        });

        it(`given a registered account
            when requested to execute the first step to reset acount password
            then it must retrieve the account
            and found the account
            and create a request to reset password
            and create a timer to clear the temporary account`,
        () => {            
            accountRepositoryMock.expects("retrieveAnAccountByEmail")
                .withArgs(email)
                .once()
                .returns("ACCOUNT");

            temporaryAccountRepositoryMock.expects("saveEntity")
                .once()                
                .returns();

            expect(() => 
                accountModel.firstStepToResetAccountPassword(email, token)
            ).to.not.throw(Exception);

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
        () => {
            temporaryAccountRepositoryMock.expects("retrieveAnTemporaryAccountEntityByEmailAndToken")
                .withArgs(email, token)
                .once()
                .returns(null);

            expect(() => {
                accountModel.secondStepToResetAccountPassword(email, password, token);
            }).to.throw(Exception);
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
        () => {
            temporaryAccountRepositoryMock.expects("retrieveAnTemporaryAccountEntityByEmailAndToken")
                .withArgs(email, token)
                .once()
                .returns("TEMPORARY_ACCOUNT");

            temporaryAccountRepositoryMock.expects("deleteAnTemporaryAccountEntityByEmail")
                .withArgs(email)
                .once()
                .returns();

            accountRepositoryMock.expects("retrieveAnAccountByEmail")
                .withArgs(email)
                .once()
                .returns({
                    getId: sinon.stub()
                });

            expect(() => {
                accountModel.secondStepToResetAccountPassword(email, password, token);
            }).to.not.throw(Exception);
            
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
        () => {
            accountRepositoryMock.expects("retrieveAnAccountByEmailAndPassword")
                .once()
                .returns(null);

            expect(() => {
                const newPassword = faker.internet.password();
                accountModel.changeMyPassword(email, password, newPassword);
            }).to.throw(Exception);
            accountRepositoryMock.verify();
        });

        it(`given a registered account
            when requested to execute the change my password
            it must encrypt the received password
            and retrieve the account
            and found the account
            and encrypt the new password
            and update the account password`,
        () => {
            accountRepositoryMock.expects("retrieveAnAccountByEmailAndPassword")
                .once()
                .returns({
                    getId: sinon.stub()
                });

            accountRepositoryMock.expects("updateAnAccountPasswordById")
                .once()
                .returns();

            expect(() => {
                const newPassword = faker.internet.password();
                accountModel.changeMyPassword(email, password, newPassword);
            }).to.not.throw(Exception);
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
        () => {
            accountRepositoryMock.expects("retrieveAnAccountByEmailAndPassword")
                .once()
                .returns(null);

            expect(() => {
                accountModel.login(email, password, token);
            }).to.throw(Exception);
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
        () => {
            accountRepositoryMock.expects("retrieveAnAccountByEmailAndPassword")
                .once()
                .returns("ACCOUNT");

            loginAndLogoutRepositoryMock.expects("retriveAnLoginAndLogoutEntityByEmail")
                .withArgs(email)
                .once()
                .returns("LOGIN_REGISTER");

            expect(() => {
                accountModel.login(email, password, token);
            }).to.throw(Exception);
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
        () => {
            accountRepositoryMock.expects("retrieveAnAccountByEmailAndPassword")
                .once()
                .returns("ACCOUNT");

            loginAndLogoutRepositoryMock.expects("retriveAnLoginAndLogoutEntityByEmail")
                .withArgs(email)
                .once()
                .returns(null);
            
            loginAndLogoutRepositoryMock.expects("saveEntity")
                .once()
                .returns();

            expect(() => {
                accountModel.login(email, password, token);
            }).to.not.throw(Exception);
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
        () => {
            loginAndLogoutRepositoryMock.expects("retriveAnLoginAndLogoutEntityByEmail")
                .withArgs(email)
                .once()
                .returns(null);

            expect(() => {
                accountModel.logout(email);
            }).to.throw(Exception);            
            loginAndLogoutRepositoryMock.verify();
        });

        it(`given a registered account
            when requested to execute the logout
            then it must retrieve the login register
            and found the login register
            and delete the login register`,
        () => {
            loginAndLogoutRepositoryMock.expects("retriveAnLoginAndLogoutEntityByEmail")
                .withArgs(email)
                .once()
                .returns("LOGIN_REGISTER");

            loginAndLogoutRepositoryMock.expects("deleteAnLoginAndLogoutEntityByEmail")
                .withArgs(email)
                .once()
                .returns();

            expect(() => {
                accountModel.logout(email);
            }).to.not.throw(Exception);            
            loginAndLogoutRepositoryMock.verify();
        });

    });

});
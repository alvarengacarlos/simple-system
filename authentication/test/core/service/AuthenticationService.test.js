import { it, describe, beforeEach, afterEach, before } from "mocha";
import { expect } from "chai";
import sinon from "sinon";
import { faker } from "@faker-js/faker";

import AuthenticationService from "../../../src/core/service/AuthenticationService.js";
import AuthenticationRepository from "../../../src/core/repository/AuthenticationRepository.js";
import LoggedAccountsRepository from "../../../src/core/repository/LoggedAccountsRepository.js";
import JwtTokenService from "../../../src/core/service/JwtTokenService.js";
import PasswordUtil from "../../../src/core/util/PasswordUtil.js";
import Exception from "../../../src/core/exception/Exception.js";

describe("AuthenticationService.js", () => {

    describe("login", () => {

        let authenticationRepository, loggedAccountsRepository, jwtTokenService, authenticationService;
        let email, password;
        before(() => {
            authenticationRepository = new AuthenticationRepository();
            loggedAccountsRepository = new LoggedAccountsRepository();
            jwtTokenService = new JwtTokenService();            
            
            email = faker.internet.email();
            password = faker.internet.password();
        });

        let authenticationRepositoryMock, loggedAccountsRepositoryMock, jwtTokenServiceMock;
        beforeEach(() => {
            authenticationRepositoryMock = sinon.mock(authenticationRepository);
            loggedAccountsRepositoryMock = sinon.mock(loggedAccountsRepository);
            jwtTokenServiceMock = sinon.mock(jwtTokenService);

            PasswordUtil.encryptPassword = sinon.stub().withArgs(password).returns(password);

            authenticationService = new AuthenticationService(authenticationRepository, loggedAccountsRepository, jwtTokenService, PasswordUtil)
        });

        afterEach(() => {
            authenticationRepositoryMock.restore();
            jwtTokenServiceMock.restore();
            loggedAccountsRepositoryMock.restore();
        })

        it(`given email and password sent by an already registered account
            when the login operation is executed
            then it must encrypted the password
            and comparing email and password in the database
            and insert the account in the database
            and return a token`,
		() => {            
            authenticationRepositoryMock.expects("searchAccountByEmailAndPassword")
				.withArgs(email, password)
				.once()
				.returns({
					_id: faker.database.mongodbObjectId(),
					email: email
				});

            const token = faker.datatype.uuid()
            jwtTokenServiceMock.expects("generateJwtToken")
                .withArgs()
                .once()
                .returns(token);

            const receivedToken = authenticationService.login(email, password);

            expect(receivedToken).to.deep.equal(token);
			authenticationRepositoryMock.verify();
            jwtTokenServiceMock.verify();
		});

        it(`given email and password sent by an unregistered account
            when the login operation is executed
            then it must encrypted the password 
            and comparing email and password in the database
            and throw the email or password are incorrect`,
		() => {
            authenticationRepositoryMock.expects("searchAccountByEmailAndPassword")
				.withArgs(email, password)
				.once()
				.returns(null);

            expect(() => {
                authenticationService.login(email, password);

            }).to.throw(Exception);
            authenticationRepositoryMock.verify();
		});

    });

    describe("logout", () => {
        
        let loggedAccountsRepository, authenticationService;
        let email, token;
        before(() => {
            loggedAccountsRepository = new LoggedAccountsRepository();        
            
            email = faker.internet.email();
            token = faker.datatype.uuid();
        });

        let loggedAccountsRepositoryMock;
        beforeEach(() => {            
            loggedAccountsRepositoryMock = sinon.mock(loggedAccountsRepository);            

            authenticationService = new AuthenticationService(null, loggedAccountsRepository);
        });

        afterEach(() => {
            loggedAccountsRepositoryMock.restore();
        });

        it(`given an email belongs to an account registered in the database and logged into the system
            when the logout operation is executed
            then it must search for the email in the database
            and found the account belongs to the email 
            and remove it from database`, 
        () => {            
            loggedAccountsRepositoryMock.expects("searchLoggedAccountByEmail")                
                .withArgs(email)
                .once()
                .returns({email, token});

            loggedAccountsRepositoryMock.expects("removeLoggedAccount")
                .withArgs(email)
                .once()
                .returns();

                expect(() => {
                    authenticationService.logout(email);
                }).to.not.throw(Exception)

            loggedAccountsRepositoryMock.verify();
        });

        it(`given an email belongs to an account registered in the database and unlogged into the system
            when the logout operation is executed
            then it must search for the email in the database
            and not found the account belongs to the email 
            and throw the account is not logged exception`, 
        () => {            
            loggedAccountsRepositoryMock.expects("searchLoggedAccountByEmail")                
                .withArgs(email)
                .once()
                .returns(null);

            expect(() => {
                authenticationService.logout(email);
            }).to.throw(Exception)

            loggedAccountsRepositoryMock.verify();
        });

    })

});
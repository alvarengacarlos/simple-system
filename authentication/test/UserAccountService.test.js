import { it, describe, beforeEach, afterEach, before } from "mocha";
import chai from "chai";
import sinon from "sinon";
import { faker } from "@faker-js/faker";

import UserAccountService from "../src/UserAccountService.js";
import UserAccountRepository from "../src/UserAccountRepository.js";
import TokenProvider from "../src/TokenProvider.js";
import Exception from "../src/Exception.js";

const expect = chai.expect;

describe("UserAccountService.js", () => {

	let _id = null;
	let email = null;
	let password = null;
    let token = null;
	let userAccountRepository = null;    
    let tokenProvider = null;
	before(() => {
		_id = faker.database.mongodbObjectId();
		email = faker.internet.email();
		password = faker.internet.password();
        token = faker.datatype.uuid()

		userAccountRepository = new UserAccountRepository();        
        tokenProvider = new TokenProvider();
	});

	let userAccountRepositoryMock = null;
    let userAccountServiceMock = null;
    let tokenProviderMock = null;
    let userAccountService = null;
	beforeEach(() => {        
		userAccountService = new UserAccountService(userAccountRepository, tokenProvider);

        userAccountRepositoryMock = sinon.mock(userAccountRepository);
        userAccountServiceMock = sinon.mock(userAccountService);
        tokenProviderMock = sinon.mock(tokenProvider);
	});

	afterEach(() => {
		userAccountRepositoryMock.restore();
        userAccountServiceMock.restore();
        tokenProviderMock.restore();
	});

	describe("login", () => {

		it(`given email and password sent by an already registered user
            when encrypted the password and comparing email and password in the database
            then it must return a token`,
		() => {
			userAccountServiceMock.expects("_encryptPassword")
                .withArgs(password)
                .once()
                .returns(password);

            userAccountRepositoryMock.expects("searchUserAccountByEmailAndPassword")
				.withArgs(email, password)
				.once()
				.returns({
					_id: _id,
					email: email
				});

            tokenProviderMock.expects("generateToken")
                .withArgs()
                .once()
                .returns(token);

            const receivedToken = userAccountService.login(email, password);

            expect(receivedToken).to.deep.equal(token);
			userAccountRepositoryMock.verify();
            userAccountServiceMock.verify();            
		});

        it(`given email and password sent by an unregistered user
            when encrypted the password and comparing email and password in the database
            then it must throw an email or password are incorrect`,
		() => {
			userAccountServiceMock.expects("_encryptPassword")
                .withArgs(password)
                .once()
                .returns(password);

            userAccountRepositoryMock.expects("searchUserAccountByEmailAndPassword")
				.withArgs(email, password)
				.once()
				.returns(null);

            expect(() => {
                userAccountService.login(email, password);

            }).to.throw(Exception);
            userAccountRepositoryMock.verify();
            userAccountServiceMock.verify();
		});

	});

});
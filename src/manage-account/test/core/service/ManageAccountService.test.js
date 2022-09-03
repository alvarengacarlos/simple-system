import { it, describe, beforeEach } from "mocha";
import { expect } from "chai";
import sinon from "sinon";
import { faker } from "@faker-js/faker";

import ManageAccountService from "../../../src/core/service/ManageAccountService.js";
import ManageAccountRepository from "../../../src/core/repository/ManageAccountRepository.js";
import Exception from "../../../../util/src/exception/Exception.js";

describe("ManageAccountService", () => {

    let manageAccountRepository;
    let email, password, newPassword, databaseId;
    before(() => {
        manageAccountRepository = new ManageAccountRepository();

        email = faker.internet.email();
        password = faker.internet.password();
        newPassword = faker.internet.password()
        databaseId = faker.database.mongodbObjectId();
    });

    let manageAccountRepositoryMock;
    let manageAccountService;
    let PasswordUtil = {}
    beforeEach(() => {
        manageAccountRepositoryMock = sinon.mock(manageAccountRepository);

        PasswordUtil.encryptPassword = (password) => password;

        manageAccountService = new ManageAccountService(manageAccountRepository, PasswordUtil);
    });

    afterEach(() => {
        manageAccountRepositoryMock.restore();
    });

    describe("deleteAccount", () => {

        it(`given an account registered and logged into the system
            when request to delete the account entering the correct email and password
            then it must encrypt the password
            and search for the account by email and password in the database
            and found the account
            and delete the account from the database successfully`,
        () => {
            manageAccountRepositoryMock.expects("searchAccountByEmailAndPassword")
                .withArgs(email, password)
                .once()
                .returns({
                    _id: databaseId,
                    email: email
                });

            manageAccountRepositoryMock.expects("deleteAccountByEmail")
                .withArgs(email)
                .once()
                .returns();

            expect(() => {
                manageAccountService.deleteAccount(email, password);
            }).to.not.throw(Exception)

            manageAccountRepositoryMock.verify();
        })

        it(`given an account registered and logged into the system
            when request to delete the account entering the correct email but incorrect password
            then it must encrypt the password
            and search for the account by email and password in the database
            and not founds the account
            and throw the password is incorrect exception`,
        () => {
            manageAccountRepositoryMock.expects("searchAccountByEmailAndPassword")
                .withArgs(email, password)
                .once()
                .returns();

            expect(() => {
                manageAccountService.deleteAccount(email, password);
            }).to.throw(Exception)

            manageAccountRepositoryMock.verify();
        })

    });

    describe("changePassword", () => {

        it(`given an registered account and logged into the system
            when request to change the password entering the correct current password and new password
            then it must encrypt the current password
            and search by email and current password in the database
            and found the account
            and encrypt the new password            
            and change the password`,
        () => {
            manageAccountRepositoryMock.expects("searchAccountByEmailAndPassword")
                .withArgs(email, password)
                .once()
                .returns({
                    _id: databaseId,
                    email: email
                });
            
            manageAccountRepositoryMock.expects("alterAccountPasswordByEmail")
                .withArgs(email, newPassword)
                .once()
                .returns();

            expect(() => {
                manageAccountService.changePassword(email, newPassword, password);
            }).to.not.throw(Exception);

            manageAccountRepositoryMock.verify();
        });

        it(`given an registered account and logged into the system
            when request to change the password entering the correct current password and new password
            then it must encrypt the current password
            and search by email and current password in the database
            and not found the account
            and throw password is incorrect exception`,
        () => {
            manageAccountRepositoryMock.expects("searchAccountByEmailAndPassword")
                .withArgs(email, password)
                .once()
                .returns();

            expect(() => {
                manageAccountService.changePassword(email, newPassword, password);
            }).to.throw(Exception);

            manageAccountRepositoryMock.verify();
        });

    });

    describe("resetAccountPassword", () => {

        it(`given an existent account and not logged into system 
            when request to change reset password because any reason
            then it must search account by email in the database
            and found the account
            and sent email to email address received`,
        () => {})

    });

});
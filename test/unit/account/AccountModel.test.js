import { it, describe, before, beforeEach } from "mocha";
import { expect } from "chai";
import { faker } from "@faker-js/faker";

import AccountModel from "../../../src/account/core/AccountModel.js";

describe("AccountModel.js", () => {

    describe("encryptPassword", () => {

        let password;        
        before(() => {
            password = faker.internet.password();
        });

        let accountModel;
        beforeEach(() => {
            accountModel = new AccountModel();
        });

        it("it must encrypt the password", () => {            
            const encryptedPassword = accountModel.encryptPassword(password);

            expect(encryptedPassword).to.not.eql(password);
            expect(encryptedPassword).to.length(64);            
        });

    });

});
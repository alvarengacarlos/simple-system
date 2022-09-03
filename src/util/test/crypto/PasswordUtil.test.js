import { it, describe, before } from "mocha";
import { expect } from "chai";
import { faker } from "@faker-js/faker";

import PasswordUtil from "../../src/crypto/PasswordUtil.js";

describe("PasswordUtil.js", () => {

    describe("encryptPassword", () => {

        let password;
        before(() => {
            password = faker.internet.password();
        })

        it("it must encrypt the password", () => {            
            const encryptedPassword = PasswordUtil.encryptPassword(password);

            expect(encryptedPassword).to.not.eql(password);
            expect(encryptedPassword).to.length(64);            
        });

    });

});
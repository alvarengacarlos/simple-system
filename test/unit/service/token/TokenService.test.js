import { it, describe, beforeEach, before } from "mocha";
import { expect } from "chai";
import chai from "chai";
import chaiAsPromised from "chai-as-promised";
import { faker } from "@faker-js/faker";

chai.use(chaiAsPromised);

import TokenService from "../../../../src/service/token/TokenService.js";
import Exception from "../../../../src/helper/Exception.js";

describe("TokenService.js", () => {

    let tokenService = null
    beforeEach(() => {  
        tokenService = new TokenService();
    })

    describe("generateCreateAccountToken", () => {

        it(`it must generate a create account token`, async () => {
            const token = await tokenService.generateCreateAccountToken();

            expect(token.split(".")).to.length(3);
        });

    });

    describe(`checkCreateAccountToken`, () => {

        it(`it must be success on validate token`, async () => {
            const token = await tokenService.generateCreateAccountToken();
            
            await expect(tokenService.checkCreateAccountToken(token)).to.be.not.rejectedWith(Exception);
        });

        it(`it must throw the invalid token exception`, async () => {
            const token = `${faker.datatype.uuid()}.${faker.datatype.uuid()}.${faker.datatype.uuid()}`;
            
            await expect(tokenService.checkCreateAccountToken(token)).to.be.rejectedWith(Exception);
        });       

    });

    describe(`generateLoginToken`, () => {

        it(`it must generate a login token`, async () => {
            const token = await tokenService.generateLoginToken();

            expect(token.split(".")).to.length(3);
        });

    });

    describe(`checkLoginToken`, () => {

        it(`it must be success on validate token`, async () => {
            const token = await tokenService.generateLoginToken();

            await expect(tokenService.checkLoginToken(token)).to.be.not.rejectedWith(Exception);
        });

        it(`it must throw the invalid token exception`, async () => {
            const token = `${faker.datatype.uuid()}.${faker.datatype.uuid()}.${faker.datatype.uuid()}`;
            
            await expect(tokenService.checkLoginToken(token)).to.be.rejectedWith(Exception);
        });       

    });

    describe(`generateResetPasswordToken`, () => {

        it(`it must generate a reset password token`, async () => {
            const token = await tokenService.generateResetPasswordToken();

            expect(token.split(".")).to.length(3);
        });

    });

    describe(`checkResetPasswordToken`, () => {

        it(`it must be success on validate token`, async () => {
            const token = await tokenService.generateResetPasswordToken();

            await expect(tokenService.checkResetPasswordToken(token)).to.be.not.rejectedWith(Exception);
        });

        it(`it must throw the invalid token exception`, async () => {
            const token = `${faker.datatype.uuid()}.${faker.datatype.uuid()}.${faker.datatype.uuid()}`;
            
            await expect(tokenService.checkResetPasswordToken(token)).to.be.rejectedWith(Exception);
        });       

    });

});
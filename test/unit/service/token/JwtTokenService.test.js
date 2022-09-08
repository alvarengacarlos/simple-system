import { it, describe, beforeEach } from "mocha";
import { expect } from "chai";
import chai from "chai";
import chaiAsPromised from "chai-as-promised";
import { faker } from "@faker-js/faker";

chai.use(chaiAsPromised);

import JwtTokenService from "../../../src/core/service/JwtTokenService.js";
import Exception from "../../../../util/src/exception/Exception.js";

describe("JwtTokenService.js", () => {

    let jwtTokenService = null
    beforeEach(() => {
        jwtTokenService = new JwtTokenService();
    })

    describe("generateJwtToken", () => {

        it(`it must generate a jwt token`, async () => {
            const jwtToken = await jwtTokenService.generateJwtToken();

            expect(jwtToken.split(".")).to.length(3);
        });

        it(`it must throw the invalid token exception`, async () => {
            const jwtToken = `${faker.datatype.uuid()}.${faker.datatype.uuid()}.${faker.datatype.uuid()}`;
            
            await expect(jwtTokenService.verifyJwtToken(jwtToken)).to.be.rejectedWith(Exception);
        });

        it(`it must be success on validate token`, async () => {
            const jwtToken = await jwtTokenService.generateJwtToken();

            await expect(jwtTokenService.verifyJwtToken(jwtToken)).to.be.not.rejectedWith(Exception);
        });

    });

});
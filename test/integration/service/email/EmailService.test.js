import { describe, it, before, beforeEach } from "mocha";
import chai, { expect } from "chai";
import { faker } from "@faker-js/faker";
import chaiAsPromised from "chai-as-promised";
import process from "process";

chai.use(chaiAsPromised);
const TIMEOUT = 6000;

import EmailService from "../../../../src/service/email/EmailService.js";
import Exception from "../../../../src/helper/Exception.js";

describe("EmailService", () => {

    let receiver, token;
    before(() => {
        receiver = process.env.TEST_RECEIVER_EMAIL;
        token = faker.datatype.uuid();
    })

    let emailService;
    beforeEach(() => {
        emailService = new EmailService();
    });

    describe("sendCreateAccountMail", () => {

        it("it must send an email with successfully", async () => {
            await expect(emailService.sendCreateAccountMail(receiver, token)).to.be.not.rejectedWith(Exception);
        }).timeout(TIMEOUT);

        it("it must send an email with successfully", async () => {
            await expect(emailService.sendResetPasswordMail(receiver, token)).to.be.not.rejectedWith(Exception);
        }).timeout(TIMEOUT);

    });

});
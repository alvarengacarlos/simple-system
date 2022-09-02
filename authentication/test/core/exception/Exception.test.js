import { it, describe } from "mocha";
import { expect } from "chai";
import { faker } from "@faker-js/faker";

import Exception from "../../../src/core/exception/Exception.js";

describe("Exception", () => {

    describe("constructor", () => {

        it("It must instanciate an exception", () => {
            const message1 = faker.lorem.sentence();
            const exception1 = new Exception(message1, 1, 400);
            
            const message2 = faker.lorem.sentence();
            const exception2 = new Exception(message2, 1, 500);

            expect(exception1).to.have.property("message", JSON.stringify({
                code: 1,
                message: message1
            }));
            expect(exception1).to.have.property("_httpStatusCode", 400);

            expect(exception2).to.have.property("message", JSON.stringify({
                code: 1,
                message: message2    
            }));
            expect(exception2).to.have.property("_httpStatusCode", 500);
        })

    })

})
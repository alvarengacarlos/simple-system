import { it, describe, before, afterEach } from "mocha";
import { expect } from "chai";
import { faker } from "@faker-js/faker";

import LoginAndLogoutRepository from "../../../../../src/account/core/repository/LoginAndLogoutRepository.js";
import LoginAndLogoutEntity from "../../../../../src/account/core/entity/LoginAndLogoutEntity.js";

describe("LoginAndLogoutRepository", () => {

    function generateLoginAndLogoutEntityHelper() {
        return new LoginAndLogoutEntity(
            faker.internet.email(),
            faker.datatype.uuid()
        );
    }

    async function saveOneLoginAndLogoutEntityInDatabaseHelper(loginAndLogoutEntity) {        
        const connection = await loginAndLogoutRepository.getConnection();
        await connection.collection(loginAndLogoutRepository.getCollectionName())
            .insertOne(loginAndLogoutEntity);
    }

    async function retrieveOneLoginAndLogoutEntityByIdInDatabaseHelper(id) {
        const connection = await loginAndLogoutRepository.getConnection();
        
        const retrievedLoginAndLogout = await connection.collection(loginAndLogoutRepository.getCollectionName())
            .findOne({_id: id});        

        if (retrievedLoginAndLogout) {
            return new LoginAndLogoutEntity(retrievedLoginAndLogout._email, retrievedLoginAndLogout._token)
                .setId(retrievedLoginAndLogout._id)
                .setCreatedAt(retrievedLoginAndLogout._createdAt)
                .setUpdatedAt(retrievedLoginAndLogout._updatedAt);
        }

        return null;
    }

    let loginAndLogoutRepository;
    before(() => {
        loginAndLogoutRepository = new LoginAndLogoutRepository();
        loginAndLogoutRepository.getConnection()
            .then((connection) => {
                connection.dropCollection(loginAndLogoutRepository.getCollectionName());
            });        
    });

    afterEach(() => {
        loginAndLogoutRepository.getConnection()
            .then((connection) => {
                connection.dropCollection(loginAndLogoutRepository.getCollectionName());
            });
    });

    describe("retrieveLoginAndLogoutEntityById", () => {

        it("it must save one login and logout entity and retrieved it", async () => {
            const loginAndLogoutEntity = generateLoginAndLogoutEntityHelper();
            await saveOneLoginAndLogoutEntityInDatabaseHelper(loginAndLogoutEntity);
        
            const receivedLoginAndLogoutEntity = await loginAndLogoutRepository.retrieveLoginAndLogoutEntityById(loginAndLogoutEntity.getId());
        
            expect(receivedLoginAndLogoutEntity).to.eql(loginAndLogoutEntity);
        });
        
    });

    describe("retrieveAllLoginAndLogoutEntities", () => {

        it("it must save two login and logout entity and retrieve all them", async () => {
            const loginAndLogoutEntity1 = generateLoginAndLogoutEntityHelper();
            const loginAndLogoutEntity2 = generateLoginAndLogoutEntityHelper();

            await saveOneLoginAndLogoutEntityInDatabaseHelper(loginAndLogoutEntity1);
            await saveOneLoginAndLogoutEntityInDatabaseHelper(loginAndLogoutEntity2);

            const receivedLoginAndLogoutEntities = await loginAndLogoutRepository.retrieveAllLoginAndLogoutEntities();

            expect(receivedLoginAndLogoutEntities[0]).to.eql(loginAndLogoutEntity1);
            expect(receivedLoginAndLogoutEntities[1]).to.eql(loginAndLogoutEntity2);
        });
        
    });

    describe("retriveAnLoginAndLogoutEntityByEmail", () => {

        it("it must save one login and logout entity and retrieve it by email", async () => {
            const loginAndLogoutEntity = generateLoginAndLogoutEntityHelper();
            await saveOneLoginAndLogoutEntityInDatabaseHelper(loginAndLogoutEntity);

            const receivedLoginAndLogoutEntity = await loginAndLogoutRepository.retriveAnLoginAndLogoutEntityByEmail(loginAndLogoutEntity.getEmail());

            expect(receivedLoginAndLogoutEntity).to.eql(loginAndLogoutEntity);
        });
        
    });

    describe("deleteAnLoginAndLogoutEntityByEmail", () => {

        it("it must save one login and logout entity and delete it by email", async () => {
            const loginAndLogoutEntity = generateLoginAndLogoutEntityHelper();
            await saveOneLoginAndLogoutEntityInDatabaseHelper(loginAndLogoutEntity);

            await loginAndLogoutRepository.deleteAnLoginAndLogoutEntityByEmail();

            const receivedLoginAndLogoutEntity = await retrieveOneLoginAndLogoutEntityByIdInDatabaseHelper(loginAndLogoutEntity);

            expect(receivedLoginAndLogoutEntity).to.eql(null);
        });
        
    });

});
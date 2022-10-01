import { it, describe, before, afterEach } from "mocha";
import { expect } from "chai";
import { faker } from "@faker-js/faker";

import TemporaryAccountEntity from "../../../../../src/account/core/entity/TemporaryAccountEntity.js";
import TemporaryAccountRepository from "../../../../../src/account/core/repository/TemporaryAccountRepository.js";

describe("AccountRepository", () => {

    function generateTemporaryAccountEntityHelper() {
        return new TemporaryAccountEntity(
            faker.internet.email(),
            faker.datatype.uuid()
        );
    }

    async function saveOneTemporaryAccountEntityInDatabaseHelper(temporaryAccountEntity) {        
        const connection = await temporaryAccountRepository.getConnection();
        await connection.collection(temporaryAccountRepository.getCollectionName())
            .insertOne(temporaryAccountEntity);
    }

    async function retrieveOneTemporaryAccountEntityByIdInDatabaseHelper(id) {
        const connection = await temporaryAccountRepository.getConnection();
        
        const temporaryAccountEntity = await connection.collection(temporaryAccountRepository.getCollectionName())
            .findOne({_id: id});        

        if (temporaryAccountEntity) {
            return new TemporaryAccount(temporaryAccountEntity._email, temporaryAccountEntity._password)
                .setId(temporaryAccountEntity._id)
                .setCreatedAt(temporaryAccountEntity._createdAt)
                .setUpdatedAt(temporaryAccountEntity._updatedAt);
        }

        return null;
    }

    let temporaryAccountRepository;
    before(() => {
        temporaryAccountRepository = new TemporaryAccountRepository();
        temporaryAccountRepository.getConnection()
            .then((connection) => {
                connection.dropCollection(temporaryAccountRepository.getCollectionName());
            });        
    });

    afterEach(() => {
        temporaryAccountRepository.getConnection()
            .then((connection) => {
                connection.dropCollection(temporaryAccountRepository.getCollectionName());
            });
    });

    describe("retrieveAnTemporaryAccountEntityById", () => {

        it("it must save one temporary account and retrieve it by id", async () => {
            const temporaryAccount = generateTemporaryAccountEntityHelper();
            await saveOneTemporaryAccountEntityInDatabaseHelper(temporaryAccount);

            const retrievedTemporaryAccount = await temporaryAccountRepository.retrieveAnTemporaryAccountEntityById(temporaryAccount.getId());

            expect(retrievedTemporaryAccount).to.eql(temporaryAccount);
        })

    });

    describe("retrieveAllTemporaryAccountEntities", () => {

        it("it must save two temporary account and retrieve them", async () => {
            const temporaryAccount1 = generateTemporaryAccountEntityHelper();
            const temporaryAccount2 = generateTemporaryAccountEntityHelper();
            await saveOneTemporaryAccountEntityInDatabaseHelper(temporaryAccount1);
            await saveOneTemporaryAccountEntityInDatabaseHelper(temporaryAccount2);

            const retrievedTemporaryAccounts = await temporaryAccountRepository.retrieveAllTemporaryAccountEntities();

            expect(retrievedTemporaryAccounts[0]).to.eql(temporaryAccount1);
            expect(retrievedTemporaryAccounts[1]).to.eql(temporaryAccount2);
        });

    })

    describe("retrieveAnTemporaryAccountByEmail", () => {
        
        it("it must save one temporary account and retrieve it by email", async () => {
            const temporaryAccount = generateTemporaryAccountEntityHelper();
            await saveOneTemporaryAccountEntityInDatabaseHelper(temporaryAccount);

            const retrievedTemporaryAccount = await temporaryAccountRepository.retrieveAnTemporaryAccountByEmail(temporaryAccount.getEmail());

            expect(retrievedTemporaryAccount).to.eql(temporaryAccount);
        });

    });

    describe("retrieveAnTemporaryAccountByEmailAndToken", () => {
        
        it("it must save one temporary account and retrieve it by email and token", async () => {
            const temporaryAccount = generateTemporaryAccountEntityHelper();
            await saveOneTemporaryAccountEntityInDatabaseHelper(temporaryAccount);

            const retrievedTemporaryAccount = await temporaryAccountRepository.retrieveAnTemporaryAccountByEmailAndToken(
                temporaryAccount.getEmail(),
                temporaryAccount.getToken()
            );

            expect(retrievedTemporaryAccount).to.eql(temporaryAccount);
        });

    })

    describe("deleteAnTemporaryAccountByEmail", () => {

        it("it must save one temporary account and delete it by email", async () => {
            const temporaryAccount = generateTemporaryAccountEntityHelper();
            await saveOneTemporaryAccountEntityInDatabaseHelper(temporaryAccount);

            await temporaryAccountRepository.deleteAnTemporaryAccountByEmail(temporaryAccount.getEmail());

            const retrievedTemporaryAccount = await retrieveOneTemporaryAccountEntityByIdInDatabaseHelper(temporaryAccount.getId());

            expect(retrievedTemporaryAccount).to.eql(null);
        });

    });

});
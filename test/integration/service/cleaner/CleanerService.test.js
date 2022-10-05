import { it, describe, beforeEach, before, afterEach } from "mocha";
import { expect } from "chai";
import chai from "chai";
import chaiAsPromised from "chai-as-promised";
import { faker } from "@faker-js/faker";

chai.use(chaiAsPromised);

import CleanerService from "../../../../src/service/cleaner/CleanerService.js";
import TemporaryAccountRepository from "../../../../src/account/core/repository/TemporaryAccountRepository.js";
import LoginAndLogoutRepository from "../../../../src/account/core/repository/LoginAndLogoutRepository.js";
import TemporaryAccountEntity from "../../../../src/account/core/entity/TemporaryAccountEntity.js";
import LoginAndLogoutEntity from "../../../../src/account/core/entity/LoginAndLogoutEntity.js";

describe("CleanerService.js", () => {

    let temporaryAccountRepository, loginAndLogoutRepository;
    let cleanerService;    
    before(() => {
        cleanerService = new CleanerService();        
        temporaryAccountRepository = new TemporaryAccountRepository();
        loginAndLogoutRepository = new LoginAndLogoutRepository();
    })

    describe("_returnDifferenceBetweenNowAndCreatedAt", () => {

        it("it must return the difference between now and entity's createAt", () => {
            const now = new Date();
            const date = now
            date.setMilliseconds(new Date().getMilliseconds() - 1);
            const entity = {
                getCreatedAt: () => date
            }

            const difference = cleanerService._returnDifferenceBetweenNowAndCreatedAt(entity);

            expect(difference).to.eql(1);
        });

    });

    describe("TemporaryAccount", () => {

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
    
        async function retrieveAllTemporaryAccountEntitiesByIdInDatabaseHelper() {
            const connection = await temporaryAccountRepository.getConnection();
            
            const cursor = await connection.collection(temporaryAccountRepository.getCollectionName()).find();        
            
            let retrievedTemporaryAccounts = [];
            for await (let retrievedTemporaryAccount of cursor) {
                if (retrievedTemporaryAccount) {
                    const temporaryAccountEntity = new TemporaryAccountEntity(retrievedTemporaryAccount._email, retrievedTemporaryAccount._token)
                        .setId(retrievedTemporaryAccount._id)
                        .setCreatedAt(retrievedTemporaryAccount._createdAt)
                        .setUpdatedAt(retrievedTemporaryAccount._updatedAt);
                
                    retrievedTemporaryAccounts.push(temporaryAccountEntity);
                }            
            }
    
            return retrievedTemporaryAccounts;        
        }

        beforeEach(() => {        
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
    
        describe("_getAllTemporaryAccountEntities", () => {
    
            it(`it must retrieve the temporary account entities`, async () => {
                const temporaryAccountEntity = generateTemporaryAccountEntityHelper();
                await saveOneTemporaryAccountEntityInDatabaseHelper(temporaryAccountEntity);
    
                const temporaryAccountEntities = await cleanerService._getAllTemporaryAccountEntities();
    
                expect(temporaryAccountEntities).to.be.length(1);
            });
            
        });

        describe("_removeTemporaryAccoountEntites", () => {
        
            it(`it must remove the temporary account entities where _createdAt is greater than the expiration time`, async () => {
                const temporaryAccountEntity = generateTemporaryAccountEntityHelper();
                
                const date = new Date();
                date.setMilliseconds(date.getMilliseconds() - cleanerService._expirationTime);            
                temporaryAccountEntity.setCreatedAt(date);
        
                await saveOneTemporaryAccountEntityInDatabaseHelper(temporaryAccountEntity);
                const allTemporaryAccountEntities = await retrieveAllTemporaryAccountEntitiesByIdInDatabaseHelper();
        
                await cleanerService._removeTemporaryAccoountEntites(allTemporaryAccountEntities);
        
                const allTemporaryAccountEntitiesAfterDelete = await retrieveAllTemporaryAccountEntitiesByIdInDatabaseHelper();
                
                expect(allTemporaryAccountEntitiesAfterDelete).to.be.length(0);
            });
    
        });
    });

    describe("LoginAndLogout", () => {

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
    
        async function retrieveAllLoginAndLogoutEntitiesByIdInDatabaseHelper() {
            const connection = await loginAndLogoutRepository.getConnection();
            
            const cursor = await connection.collection(loginAndLogoutRepository.getCollectionName()).find();        
            
            let retrievedLoginAndLogoutEntities = [];
            for await (let retrievedLoginAndLogoutEntity of cursor) {
                if (retrievedLoginAndLogoutEntity) {
                    const loginAndLogoutEntity = new LoginAndLogoutEntity(retrievedLoginAndLogoutEntity._email, retrievedLoginAndLogoutEntity._token)
                        .setId(retrievedLoginAndLogoutEntity._id)
                        .setCreatedAt(retrievedLoginAndLogoutEntity._createdAt)
                        .setUpdatedAt(retrievedLoginAndLogoutEntity._updatedAt);
                
                    retrievedLoginAndLogoutEntities.push(loginAndLogoutEntity);
                }            
            }
    
            return retrievedLoginAndLogoutEntities;        
        }

        beforeEach(() => {        
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
    
        describe("_getAllLoginAndLogoutEntities", () => {
    
            it(`it must retrieve the login and logout entities`, async () => {
                const loginAndLogoutEntity = generateLoginAndLogoutEntityHelper();
                await saveOneLoginAndLogoutEntityInDatabaseHelper(loginAndLogoutEntity);
    
                const loginAndLogoutEntities = await cleanerService._getAllLoginAndLogoutEntities();

                expect(loginAndLogoutEntities).to.be.length(1);
            });
            
        });

        describe("_removeLoginAndLogoutEntities", () => {
        
            it(`it must remove the login and logout entities where _createdAt is greater than the expiration time`, async () => {
                const loginAndLogoutEntity = generateLoginAndLogoutEntityHelper();
                
                const date = new Date();
                date.setMilliseconds(date.getMilliseconds() - cleanerService._expirationTime);            
                loginAndLogoutEntity.setCreatedAt(date);
        
                await saveOneLoginAndLogoutEntityInDatabaseHelper(loginAndLogoutEntity);
                const allTemporaryAccountEntities = await retrieveAllLoginAndLogoutEntitiesByIdInDatabaseHelper();
        
                await cleanerService._removeLoginAndLogoutEntities(allTemporaryAccountEntities);
        
                const allTemporaryAccountEntitiesAfterDelete = await retrieveAllLoginAndLogoutEntitiesByIdInDatabaseHelper();
                
                expect(allTemporaryAccountEntitiesAfterDelete).to.be.length(0);
            });
    
        });
        
    });  

});
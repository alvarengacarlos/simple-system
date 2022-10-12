import { it, describe, before, afterEach } from "mocha";
import { expect } from "chai";

import MongoDbRepository from "../../../src/helper/MongoDbRepository.js";
import Entity from "../../../src/helper/Entity.js";

describe("MongoDbRepository", () => {

	function generateMyEntityHelper() {
		return new Entity();
	}

	async function saveEntityInDatabaseHelper(entity) {        
		const connection = await repository.getConnection();
		await connection.collection(repository.getCollectionName())
			.insertOne(entity);
	}

	async function retrieveOneEntityByIdInDatabaseHelper(id) {
		const connection = await repository.getConnection();
        
		const retrievedEntity = await connection.collection(repository.getCollectionName())
			.findOne({_id: id});        

		if (retrievedEntity) {
			return new Entity()
				.setId(retrievedEntity._id)
				.setCreatedAt(retrievedEntity._createdAt)
				.setUpdatedAt(retrievedEntity._updatedAt);
		}

		return null;
	}

	let repository;
	before(() => {
		repository = new MongoDbRepository("repository");
		repository.getConnection()
			.then((connection) => {
				connection.dropCollection(repository.getCollectionName());
			});        
	});

	afterEach(() => {
		repository.getConnection()
			.then((connection) => {
				connection.dropCollection(repository.getCollectionName());
			});
	});

	describe("saveEntity", () => {

		it("it must save one account entity", async () => { 
			const entity = generateMyEntityHelper();
			const result = await repository.saveEntity(entity);

			expect(result).to.be.string;
			expect(result).to.be.length(36);            
		});

		it("it must save two account entity", async () => { 
			const entity1 = generateMyEntityHelper();
			const entity2 = generateMyEntityHelper();
            
			const result1 = await repository.saveEntity(entity1);
			const result2 = await repository.saveEntity(entity2);

			expect(result1).to.be.string;                       
			expect(result2).to.be.string;
			expect(result1).to.be.length(36); 
			expect(result2).to.be.length(36);            
		});

		it("it must save three account entity", async () => { 
			const entity1 = generateMyEntityHelper();
			const entity2 = generateMyEntityHelper();
			const entity3 = generateMyEntityHelper();
            
			const result1 = await repository.saveEntity(entity1);
			const result2 = await repository.saveEntity(entity2);
			const result3 = await repository.saveEntity(entity3);

			expect(result1).to.be.string;            
			expect(result2).to.be.string;
			expect(result3).to.be.string;

			expect(result1).to.be.length(36);            
			expect(result2).to.be.length(36);               
			expect(result3).to.be.length(36);
		});

	});

	describe("updateEntityById", () => {
        
		it("it must save one account and update it", async () => {
			const entity = generateMyEntityHelper();
			await saveEntityInDatabaseHelper(entity);

			entity.setUpdatedAt(new Date());

			await repository.updateEntityById(entity.getId(), entity);

			const retrievedEntity = await retrieveOneEntityByIdInDatabaseHelper(entity.getId());

			expect(retrievedEntity).to.eql(entity);
		});

	});

	describe("deleteEntityById", () => {

		it("it must save one account entity and delete it by id", async () => {
			const entity = generateMyEntityHelper();
			await saveEntityInDatabaseHelper(entity);

			await repository.deleteEntityById(entity.getId());

			const retrievedEntity = await retrieveOneEntityByIdInDatabaseHelper(entity.getId());

			expect(retrievedEntity).to.eql(null);
		});

	});

});
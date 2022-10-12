import { it, describe, before, afterEach } from "mocha";
import { expect } from "chai";
import { faker } from "@faker-js/faker";

import AccountRepository from "../../../../../src/account/core/repository/AccountRepository.js";
import AccountEntity from "../../../../../src/account/core/entity/AccountEntity.js";

describe("AccountRepository", () => {

	function generateAccountEntityHelper() {
		return new AccountEntity(
			faker.internet.email(),
			faker.internet.password()
		);
	}

	async function saveOneAccountEntityInDatabaseHelper(accountEntity) {        
		const connection = await accountRepository.getConnection();
		await connection.collection(accountRepository.getCollectionName())
			.insertOne(accountEntity);
	}

	async function retrieveOneAccountByIdInDatabaseHelper(id) {
		const connection = await accountRepository.getConnection();
        
		const retrievedAccount = await connection.collection(accountRepository.getCollectionName())
			.findOne({_id: id});        

		if (retrievedAccount) {
			return new AccountEntity(retrievedAccount._email, retrievedAccount._password)
				.setId(retrievedAccount._id)
				.setCreatedAt(retrievedAccount._createdAt)
				.setUpdatedAt(retrievedAccount._updatedAt);
		}

		return null;
	}

	let accountRepository;
	before(() => {
		accountRepository = new AccountRepository();
		accountRepository.getConnection()
			.then((connection) => {
				connection.dropCollection(accountRepository.getCollectionName());
			});        
	});

	afterEach(() => {
		accountRepository.getConnection()
			.then((connection) => {
				connection.dropCollection(accountRepository.getCollectionName());
			});
	});

	describe("retrieveAccountEntityById", () => {

		it("it must save one account entity and retrieve it", async () => {
			const accountEntity = generateAccountEntityHelper();
			await saveOneAccountEntityInDatabaseHelper(accountEntity);

			const retrievedAccountEntity = await accountRepository.retrieveAccountEntityById(accountEntity.getId());

			expect(retrievedAccountEntity).to.eql(accountEntity);
		});
        
	});

	describe("retrieveAllAccountEntities", () => {
        
		it("it must save two accounts entity and retrieve them", async () => {
			const accountEntity1 = generateAccountEntityHelper();
			await saveOneAccountEntityInDatabaseHelper(accountEntity1);

			const accountEntity2 = generateAccountEntityHelper();
			await saveOneAccountEntityInDatabaseHelper(accountEntity2);

			const allAccounts = await accountRepository.retrieveAllAccountEntities();

			expect(allAccounts[0]).to.eql(accountEntity1);
			expect(allAccounts[1]).to.eql(accountEntity2);
		});

	});

	describe("retrieveAnAccountByEmailAndPassword", () => {

		it("it must save one account entity and retrieve it by email and password", async () => {
			const accountEntity = generateAccountEntityHelper();
			await saveOneAccountEntityInDatabaseHelper(accountEntity);

			const retrievedAccount = await accountRepository.retrieveAnAccountEntityByEmailAndPassword(
				accountEntity.getEmail(),
				accountEntity.getPassword()
			);            

			expect(retrievedAccount).to.eql(accountEntity);
		});

	});

	describe("retrieveAnAccountByEmail", () => {

		it("it must save one account entity and retrieve it by email", async () => {
			const accountEntity = generateAccountEntityHelper();
			await saveOneAccountEntityInDatabaseHelper(accountEntity);

			const retrievedAccount = await accountRepository.retrieveAnAccountEntityByEmail(
				accountEntity.getEmail()
			);            

			expect(retrievedAccount).to.eql(accountEntity);
		});

	});

	describe("updateAnAccountPasswordById", () => {

		it("it must save one account entity and update it password by id", async () => {
			const accountEntity = generateAccountEntityHelper();
			await saveOneAccountEntityInDatabaseHelper(accountEntity);

			const newPassword = faker.internet.password();            

			await accountRepository.updateAnAccountEntityPasswordById(
				accountEntity.getId(),
				newPassword
			);

			const retrievedAccount = await retrieveOneAccountByIdInDatabaseHelper(accountEntity.getId());

			expect(retrievedAccount.getPassword()).to.eql(newPassword);
		});

	});

	describe("deleteAnAccountByIdEmailAndPassword", () => {

		it("it must save one account entity and delete it by id, email, and password", async () => {
			const accountEntity = generateAccountEntityHelper();
			await saveOneAccountEntityInDatabaseHelper(accountEntity);

			await accountRepository.deleteAnAccountEntityByIdEmailAndPassword(
				accountEntity.getId(),
				accountEntity.getEmail(),
				accountEntity.getPassword()
			);

			const retrievedAccount = await retrieveOneAccountByIdInDatabaseHelper(accountEntity.getId());

			expect(retrievedAccount).to.eql(null);
		});

	});

});
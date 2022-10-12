/**
 * This class must not instanciate. It must be extend.
 */
import ConnectionMongoDb from "../infrasctructure/database/ConnectionMongoDb.js";

export default class MongoDbRepository {

	constructor(collectionName) {
		this._collectionName = collectionName;
	}

	getCollectionName() {
		return this._collectionName;
	}

	async getConnection() {
		return await ConnectionMongoDb.getConnection();
	}

	async saveEntity(entity) {
		const connection = await ConnectionMongoDb.getConnection();

		const result = await connection.collection(this._collectionName).insertOne(entity);

		if (result) {
			return result.insertedId;
		}

		return null;
	}

	async updateEntityById(id, entity) {
		const connection = await ConnectionMongoDb.getConnection();

		await connection.collection(this._collectionName).updateOne({ _id: id }, { $set: entity});
	}

	async deleteEntityById(id) {
		const connection = await ConnectionMongoDb.getConnection();

		await connection.collection(this._collectionName).deleteOne({ _id: id });
	}

}
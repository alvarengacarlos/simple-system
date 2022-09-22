/**
 * This class must not instanciate. It must be extend.
 */
import ConnectionDatabase from "../infrasctructure/database/ConnectionDatabase.js";

export default class Repository {

    constructor(collectionName) {
        this._collectionName = collectionName;
    }

    getCollectionName() {
        return this._collectionName;
    }

    async saveEntity(entity) {
        const connection = await ConnectionDatabase.getConnection();

        const result = await connection.collection(this._collectionName).insertOne(entity);

        if (result) {
            return result.insertedId;
        }

        return null;
    }

    async updateEntityById(id, entity) {
        const connection = await ConnectionDatabase.getConnection();

        await connection.collection(this._collectionName).updateOne({ _id: id }, { $set: entity});
    }

    async deleteEntityById(id) {
        const connection = await ConnectionDatabase.getConnection();

        await connection.collection(this._collectionName).deleteOne({ _id: id });
    }

}
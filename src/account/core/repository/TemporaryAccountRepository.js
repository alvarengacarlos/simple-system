import TemporaryAccountEntity from "../entity/TemporaryAccountEntity.js";
import MongoDbRepository from "../../../helper/MongoDbRepository.js";

export default class TemporaryAccountRepository extends MongoDbRepository {

    constructor() {
        super("temporaryAccount");
    }

    async retrieveAnTemporaryAccountEntityById(id) {
        const connection = await this.getConnection();

        const retrievedTemporaryAccount = await connection.collection(this._collectionName).findOne({ _id: id });

        if (retrievedTemporaryAccount) {
            return new TemporaryAccountEntity(retrievedTemporaryAccount._email, retrievedTemporaryAccount._token)
                .setId(retrievedTemporaryAccount._id)
                .setCreatedAt(retrievedTemporaryAccount._createdAt)
                .setUpdatedAt(retrievedTemporaryAccount._updatedAt);
        }        

        return null;
    }

    async retrieveAllTemporaryAccountEntities() {
        const connection = await this.getConnection();
        const cursor = await connection.collection(this._collectionName).find();
        
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


    async retrieveAnTemporaryAccountEntityByEmail(email) {
        const connection = await this.getConnection();

        const retrievedTemporaryAccount = await connection.collection(this._collectionName).findOne({ _email: email });

        if (retrievedTemporaryAccount) {
            return new TemporaryAccountEntity(retrievedTemporaryAccount._email, retrievedTemporaryAccount._token)
                .setId(retrievedTemporaryAccount._id)
                .setCreatedAt(retrievedTemporaryAccount._createdAt)
                .setUpdatedAt(retrievedTemporaryAccount._updatedAt);
        }        

        return null;
    }

    async retrieveAnTemporaryAccountEntityByEmailAndToken(email, token) {
        const connection = await this.getConnection();

        const retrievedTemporaryAccount = await connection.collection(this._collectionName).findOne({ _email: email, _token: token });

        if (retrievedTemporaryAccount) {
            return new TemporaryAccountEntity(retrievedTemporaryAccount._email, retrievedTemporaryAccount._token)
                .setId(retrievedTemporaryAccount._id)
                .setCreatedAt(retrievedTemporaryAccount._createdAt)
                .setUpdatedAt(retrievedTemporaryAccount._updatedAt);
        }        

        return null;
    }

    async deleteAnTemporaryAccountEntityByEmail(email) {
        const connection = await this.getConnection();

        await connection.collection(this._collectionName).deleteOne({ _email: email });
    }

}
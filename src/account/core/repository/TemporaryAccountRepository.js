import Repository from "../../../helper/Repository.js";
import TemporaryAccountEntity from "../entity/TemporaryAccountEntity.js";
import ConnectionDatabase from "../../../infrasctructure/database/ConnectionDatabase.js";

export default class TemporaryAccountRepository extends Repository {

    constructor() {
        super("temporaryAccount");
    }

    async retrieveAnTemporaryAccountEntityById(id) {
        const connection = await ConnectionDatabase.getConnection();

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
        const connection = await ConnectionDatabase.getConnection();
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


    async retrieveAnTemporaryAccountByEmail(email) {
        const connection = await ConnectionDatabase.getConnection();

        const retrievedTemporaryAccount = await connection.collection(this._collectionName).findOne({ _email: email });

        if (retrievedTemporaryAccount) {
            return new TemporaryAccountEntity(retrievedTemporaryAccount._email, retrievedTemporaryAccount._token)
                .setId(retrievedTemporaryAccount._id)
                .setCreatedAt(retrievedTemporaryAccount._createdAt)
                .setUpdatedAt(retrievedTemporaryAccount._updatedAt);
        }        

        return null;
    }

    async retrieveAnTemporaryAccountByEmailAndToken(email, token) {
        const connection = await ConnectionDatabase.getConnection();

        const retrievedTemporaryAccount = await connection.collection(this._collectionName).findOne({ _email: email, _token: token });

        if (retrievedTemporaryAccount) {
            return new TemporaryAccountEntity(retrievedTemporaryAccount._email, retrievedTemporaryAccount._token)
                .setId(retrievedTemporaryAccount._id)
                .setCreatedAt(retrievedTemporaryAccount._createdAt)
                .setUpdatedAt(retrievedTemporaryAccount._updatedAt);
        }        

        return null;
    }

    async deleteAnTemporaryAccountByEmail(email) {
        const connection = await ConnectionDatabase.getConnection();

        await connection.collection(this._collectionName).deleteOne({ _email: email });
    }

}
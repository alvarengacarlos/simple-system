import AccountEntity from "../entity/AccountEntity.js";
import MongoDbRepository from "../../../helper/MongoDbRepository.js"

export default class AccountRepository extends MongoDbRepository {
    
    constructor() {        
        super("account");
    }

    async retrieveAccountEntityById(id) {
        const connection = await this.getConnection();

        const retrievedAccount = await connection.collection(this._collectionName).findOne({ _id: id });

        if (retrievedAccount) {
            return new AccountEntity(retrievedAccount._email, retrievedAccount._password)
                .setId(retrievedAccount._id)
                .setCreatedAt(retrievedAccount._createdAt)
                .setUpdatedAt(retrievedAccount._updatedAt);
        }        

        return null;
    }

    async retrieveAllAccountEntities() {
        const connection = await this.getConnection();
        const cursor = await connection.collection(this._collectionName).find();
        
        let retrievedAccounts = [];
        for await (let retrievedAccount of cursor) {
            if (retrievedAccount) {
                const accountEntity = new AccountEntity(retrievedAccount._email, retrievedAccount._password)
                    .setId(retrievedAccount._id)
                    .setCreatedAt(retrievedAccount._createdAt)
                    .setUpdatedAt(retrievedAccount._updatedAt);
            
                retrievedAccounts.push(accountEntity);
            }            
        }

        return retrievedAccounts;
    }

    async retrieveAnAccountByEmailAndPassword(email, password) {
        const connection = await this.getConnection();

        const retrievedAccount = await connection.collection(this._collectionName).findOne({ _email: email, _password: password});
        
        if (retrievedAccount) {
            return new AccountEntity(retrievedAccount._email, retrievedAccount._password)
                .setId(retrievedAccount._id)
                .setPassword(retrievedAccount._password)
                .setCreatedAt(retrievedAccount._createdAt)
                .setUpdatedAt(retrievedAccount._updatedAt);
        }
        
        return null;
    }

    async retrieveAnAccountByEmail(email) {        
        const connection = await this.getConnection();

        const retrievedAccount = await connection.collection(this._collectionName).findOne({ _email: email });
        
        if (retrievedAccount) {
            return new AccountEntity(retrievedAccount._email, retrievedAccount._password)
                .setId(retrievedAccount._id)
                .setPassword(retrievedAccount._password)
                .setCreatedAt(retrievedAccount._createdAt)
                .setUpdatedAt(retrievedAccount._updatedAt);
        }
        
        return null; 
    }

    async updateAnAccountPasswordById(id, password) {        
        const connection = await this.getConnection();

        await connection.collection(this._collectionName).updateOne({ _id: id }, { $set: {_password: password, _updatedAt: new Date()}});
    }

    async deleteAnAccountByIdEmailAndPassword(id, email, password) {
        const connection = await this.getConnection();

        await connection.collection(this._collectionName).deleteOne({ _id: id, _email: email, _password: password});
    }

}
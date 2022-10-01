import LoginAndLogoutEntity from "../entity/LoginAndLogoutEntity.js";
import MongoDbRepository from "../../../helper/MongoDbRepository.js";

export default class LoginAndLogoutRepository extends MongoDbRepository {

    constructor() {
        super("loginAndLogout");
    }

    async retrieveLoginAndLogoutEntityById(id) {
        const connection = await this.getConnection();

        const retrievedLoginAndLogout = await connection.collection(this._collectionName).findOne({ _id: id });

        if (retrievedLoginAndLogout) {
            return new LoginAndLogoutEntity(retrievedLoginAndLogout._email, retrievedLoginAndLogout._token)
                .setId(retrievedLoginAndLogout._id)
                .setCreatedAt(retrievedLoginAndLogout._createdAt)
                .setUpdatedAt(retrievedLoginAndLogout._updatedAt);
        }        

        return null;
    }

    async retrieveAllLoginAndLogoutEntities() {
        const connection = await this.getConnection();
        const cursor = await connection.collection(this._collectionName).find();
        
        let retrievedLoginAndLogouts = [];
        for await (let retrievedLoginAndLogout of cursor) {
            if (retrievedLoginAndLogout) {
                const loginAndLogoutEntity = new LoginAndLogoutEntity(retrievedLoginAndLogout._email, retrievedLoginAndLogout._token)
                    .setId(retrievedLoginAndLogout._id)
                    .setCreatedAt(retrievedLoginAndLogout._createdAt)
                    .setUpdatedAt(retrievedLoginAndLogout._updatedAt);
            
                retrievedLoginAndLogouts.push(loginAndLogoutEntity);
            }            
        }

        return retrievedLoginAndLogouts;
    }

    async retriveAnLoginAndLogoutEntityByEmail(email) {
        const connection = await this.getConnection();

        const retrievedLoginAndLogout = await connection.collection(this._collectionName).findOne({ _email: email });

        if (retrievedLoginAndLogout) {
            return new LoginAndLogoutEntity(retrievedLoginAndLogout._email, retrievedLoginAndLogout._token)
                .setId(retrievedLoginAndLogout._id)
                .setCreatedAt(retrievedLoginAndLogout._createdAt)
                .setUpdatedAt(retrievedLoginAndLogout._updatedAt);
        }        

        return null;          
    }

    async deleteAnLoginAndLogoutEntityByEmail(email) {
        const connection = await this.getConnection();

        await connection.collection(this._collectionName).deleteOne({ _email: email });
    }
}
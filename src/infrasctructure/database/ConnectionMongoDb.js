import { MongoClient } from "mongodb";
import process from "process";

import Logger from "../../util/Logger.js";
import Exception from "../../helper/Exception.js";

export default class ConnectionMongoDb {

    static _uri = `mongodb://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_USER_PASSWORD}@${process.env.MONGODB_HOST}:${process.env.MONGODB_PORT}/?maxPoolSize=1&w=majority`;
    static _connection = null;
    
    static async _connect() {
        const client = new MongoClient(ConnectionMongoDb._uri);
        try {                        
            await client.connect();
            await client.db(process.env.DB_NAME).command({ping: 1});
            Logger.infoLog("Successfully connected to the database");
            return client.db(process.env.DB_NAME);

        } catch(error) {
            Logger.errorLog("Fail to connect to mongo database", error);
            throw new Exception("Sorry, internal error", 11, 500);
        }
    }

    static async getConnection() {
        if (ConnectionMongoDb._connection) {
            return ConnectionMongoDb._connection;
        }
        ConnectionMongoDb._connection = await ConnectionMongoDb._connect();
        return ConnectionMongoDb._connection;
    }

}
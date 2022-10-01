import { MongoClient } from "mongodb";
import process from "process";

import Logger from "../../util/Logger.js";
import Exception from "../../helper/Exception.js";

export default class ConnectionMongoDb {

    static _uri = `mongodb://${process.env.DB_USERNAME}:${process.env.DB_USER_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/?maxPoolSize=1&w=majority`;
    static _connection = null;
    
    static async _connect() {
        const client = new MongoClient(ConnectionMongoDb._uri);
        try {                        
            await client.connect();
            await client.db(process.env.DB_NAME).command({ping: 1});
            Logger.infoLog("successfully connected to the database");
            return client.db(process.env.DB_NAME);

        } catch(error) {
            Logger.errorLog("fail to connect to database", error);
            throw new Exception("sorry, internal error", 11, 500);
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
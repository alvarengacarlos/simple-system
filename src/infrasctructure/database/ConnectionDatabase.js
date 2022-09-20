import { MongoClient } from "mongodb";
import process from "process";

import Logger from "../../util/Logger.js";

export default class ConnectionDatabase {

    static _uri = `mongodb://${process.env.DB_USERNAME}:${process.env.DB_USER_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/?maxPoolSize=1&w=majority`;
    static _connection = null;
    
    static async _connect() {
        const client = new MongoClient(ConnectionDatabase._uri);
        try {                        
            await client.connect();
            await client.db(process.env.DB_NAME).command({ping: 1});
            Logger.infoLog("successfully connected to the database");
            return client.db(process.env.DB_NAME);

        } catch(error) {
            Logger.errorLog("fail to connect to database", error);
        }
    }

    static async getConnection() {
        if (ConnectionDatabase._connection) {
            return ConnectionDatabase._connection;
        }
        ConnectionDatabase._connection = await ConnectionDatabase._connect();
        return ConnectionDatabase._connection;
    }

}
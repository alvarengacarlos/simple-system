import CleanerService from "./service/cleaner/CleanerService.js";
import apiGateway from "./api-gateway/index.js";
import ConnectionMongoDb from "./infrasctructure/database/ConnectionMongoDb.js";
import Logger from "./util/Logger.js";

export default function initBootStrap() {    
    ConnectionMongoDb.getConnection()
    .then(() => {
        apiGateway();    

        const cleanerService = new CleanerService();
        cleanerService.initCleanerForTemporaryAccount().initCleanerForLoginAndLogout();
    })
    .catch((exception) => {
        Logger.errorLog("Sorry, the appliation can't start", exception);
    })
    
}

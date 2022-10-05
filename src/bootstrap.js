import CleanerService from "./service/cleaner/CleanerService.js";
import apiGateway from "./api-gateway/index.js";

export default function initBootStrap() {    
    apiGateway();

    const cleanerService = new CleanerService();
    cleanerService.initCleanerForTemporaryAccount().initCleanerForLoginAndLogout();
}

import TemporaryAccountRepository from "../../account/core/repository/TemporaryAccountRepository.js";
import LoginAndLogoutRepository from "../../account/core/repository/LoginAndLogoutRepository.js";
import Logger from "../../util/Logger.js";

export default class CleanerService {

    static ONE_MINUTE = 60000;

    constructor() {
        this._temporaryAccountRepository = new TemporaryAccountRepository();
        this._loginAndLogoutRepository = new LoginAndLogoutRepository();
        this._expirationTime = process.env.EXPIRATION_TIME_IN_MILLISECONDS;
    }

    initCleanerForTemporaryAccount() {
        Logger.infoLog("Starting CleanerForTemporaryAccount Service");

        setInterval(async () => {
            const allTemporaryAccountEntities = await this._getAllTemporaryAccountEntities();
            await this._removeTemporaryAccountEntites(allTemporaryAccountEntities);
        }, CleanerService.ONE_MINUTE);

        return this;
    }

    async _getAllTemporaryAccountEntities() {
        return await this._temporaryAccountRepository.retrieveAllTemporaryAccountEntities();
    }

    async _removeTemporaryAccountEntites(allTemporaryAccountEntities) {
        Logger.infoLog("Checking if there are TemporaryAccounts to remove");

        allTemporaryAccountEntities.forEach(async (temporaryAccountEntity) => {
            Logger.infoLog(`Removing the ${temporaryAccountEntity.getEmail()} temporary account`);
            
            const difference = this._returnDifferenceBetweenNowAndCreatedAt(temporaryAccountEntity);
            if (difference >= this._expirationTime) {                
                await this._temporaryAccountRepository.deleteEntityById(temporaryAccountEntity.getId());   
            }
        });                
    }

    _returnDifferenceBetweenNowAndCreatedAt(entity) {
        const now = new Date();
        const nowTime = now.getTime();

        const createdAt = entity.getCreatedAt();
        const createdAtDate = new Date(createdAt);
        const createAtTime = createdAtDate.getTime();

        return nowTime - createAtTime;
    }

    initCleanerForLoginAndLogout() {
        Logger.infoLog("Starting CleanerForLoginAndLogoutAccount Service");

        setInterval(async () => {
            const allLoginAndLogoutEntities = await this._getAllLoginAndLogoutEntities();
            await this._removeLoginAndLogoutEntities(allLoginAndLogoutEntities);
        }, CleanerService.ONE_MINUTE);

        return this;
    }

    async _getAllLoginAndLogoutEntities() {
        return await this._loginAndLogoutRepository.retrieveAllLoginAndLogoutEntities();
    }

    async _removeLoginAndLogoutEntities(allLoginAndLogoutEntities) {
        Logger.infoLog("Checking if there are LoginAndLogouts to remove");

        allLoginAndLogoutEntities.forEach(async (loggedAndLogoutEntity) => {
            Logger.infoLog(`Loggin off ${loggedAndLogoutEntity.getEmail()} account`);

            const difference = this._returnDifferenceBetweenNowAndCreatedAt(loggedAndLogoutEntity);
            if (difference >= this._expirationTime) {
                await this._loginAndLogoutRepository.deleteEntityById(loggedAndLogoutEntity.getId());
            }            
        });        
    }

}
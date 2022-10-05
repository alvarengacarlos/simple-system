import TemporaryAccountRepository from "../../account/core/repository/TemporaryAccountRepository.js";
import LoginAndLogoutRepository from "../../account/core/repository/LoginAndLogoutRepository.js";

export default class CleanerService {

    static ONE_MINUTE = 60000;

    constructor() {
        this._temporaryAccountRepository = new TemporaryAccountRepository();
        this._loginAndLogoutRepository = new LoginAndLogoutRepository();
        this._expirationTime = process.env.EXPIRATION_TIME_IN_MILLISECONDS;
    }

    initCleanerForTemporaryAccount() {
        setInterval(async () => {
            const allTemporaryAccountEntities = await this._getAllTemporaryAccountEntities();
            await this._removeTemporaryAccoountEntities(allTemporaryAccountEntities);
        }, ONE_MINUTE);

        return this;
    }

    async _getAllTemporaryAccountEntities() {
        return await this._temporaryAccountRepository.retrieveAllTemporaryAccountEntities();
    }

    async _removeTemporaryAccoountEntites(allTemporaryAccountEntities) {
        allTemporaryAccountEntities.forEach(async (temporaryAccountEntity) => {
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
        setInterval(async () => {
            const allLoginAndLogoutEntities = await this._getAllLoginAndLogoutEntities();
            await this._removeLoginAndLogoutEntities(allLoginAndLogoutEntities);
        }, ONE_MINUTE);

        return this;
    }

    async _getAllLoginAndLogoutEntities() {
        return await this._loginAndLogoutRepository.retrieveAllLoginAndLogoutEntities();
    }

    async _removeLoginAndLogoutEntities(allLoginAndLogoutEntities) {
        allLoginAndLogoutEntities.forEach(async (loggedAndLogoutEntity) => {
            const difference = this._returnDifferenceBetweenNowAndCreatedAt(loggedAndLogoutEntity);
            if (difference >= this._expirationTime) {
                await this._loginAndLogoutRepository.deleteEntityById(loggedAndLogoutEntity.getId());
            }            
        });        
    }

}
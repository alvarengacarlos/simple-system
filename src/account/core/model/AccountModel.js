import crypto from "crypto";

import AccountEntity from "../entity/AccountEntity.js";
import TemporaryAccountEntity from "../entity/TemporaryAccountEntity.js";
import LoginAndLogoutEntity from "../entity/LoginAndLogoutEntity.js";
import AccountRepository from "../repository/AccountRepository.js";
import TemporaryAccountRepository from "../repository/TemporaryAccountRepository.js";
import LoginAndLogoutRepository from "../repository/LoginAndLogoutRepository.js";
import Exception from "../../../helper/Exception.js";

export default class AccountModel {

    constructor() {
        this._accountRepository = new AccountRepository();
        this._temporaryAccountRepository = new TemporaryAccountRepository();
        this._loginAndLogoutRepository = new LoginAndLogoutRepository();
    }

    async firstStepToCreateAccount(email, token) {
        const accountEntity = await this._accountRepository.retrieveAnAccountEntityByEmail(email);        
        if (accountEntity) {
            throw new Exception("the email already belongs to an account", 2, 409);
        }
        
        const temporaryAccountEntity = await this._temporaryAccountRepository.retrieveAnTemporaryAccountEntityByEmail(email);
        if (temporaryAccountEntity) {
            throw new Exception("the email already in the registration process", 8, 409);
        }

        const newTemporaryAccountEntity = new TemporaryAccountEntity(email, token);
        await this._temporaryAccountRepository.saveEntity(newTemporaryAccountEntity);
    }

    async secondStepToCreateAnAccount(email, password, token) {
        const temporaryAccountEntity = await this._temporaryAccountRepository.retrieveAnTemporaryAccountEntityByEmailAndToken(email, token);
        if (!temporaryAccountEntity) {
            throw new Exception("the email is not in the registration process", 9, 400);
        }
        
        const encryptedPassword = this._encryptPassword(password);
        const newAccount = new AccountEntity(email, encryptedPassword);        
        
        this._accountRepository.saveEntity(newAccount);        
                
        this._temporaryAccountRepository.deleteAnTemporaryAccountEntityByEmail(email);
    }

    _encryptPassword(password) {
        const hash = crypto.createHash('sha256');
        hash.update(password);        
        return hash.digest('hex');
    }
    
    async deleteMyAccount(email, password) {
        const encryptPassword = this._encryptPassword(password);
        const accountEntity = await this._accountRepository.retrieveAnAccountEntityByEmailAndPassword(email, encryptPassword);

        if (!accountEntity) {
            throw new Exception("the password is incorrect", 5, 400);
        }

        await this._accountRepository.deleteAnAccountEntityByIdEmailAndPassword(
            accountEntity.getId(),
            accountEntity.getEmail(),
            accountEntity.getPassword()
        );

        await this._loginAndLogoutRepository.deleteAnLoginAndLogoutEntityByEmail(email);
    }

    async firstStepToResetAccountPassword(email, token) {
        const accountEntity = await this._accountRepository.retrieveAnAccountEntityByEmail(email);

        if (!accountEntity) {
            throw new Exception("the email does not belong to an account", 7, 400);
        }

        const temporaryAccountEntity = new TemporaryAccountEntity(email, token);        
        await this._temporaryAccountRepository.saveEntity(temporaryAccountEntity);
    }

    async secondStepToResetAccountPassword(email, newPassword, token) {
        const temporaryAccountEntity = await this._temporaryAccountRepository.retrieveAnTemporaryAccountEntityByEmailAndToken(email, token);
        if (!temporaryAccountEntity) {
            throw new Exception("the email is not in the reset password process", 9, 400);
        }

        const encryptNewPassword = this._encryptPassword(newPassword);

        const accountEntity = await this._accountRepository.retrieveAnAccountEntityByEmail(email);        
        await this._accountRepository.updateAnAccountEntityPasswordById(
            accountEntity.getId(),
            encryptNewPassword
        );

        await this._temporaryAccountRepository.deleteAnTemporaryAccountEntityByEmail(email);
    }

    async changeMyPassword(email, oldPassword, newPassword) {
        const encryptOldPassword = this._encryptPassword(oldPassword);
        
        const accountEntity = await this._accountRepository.retrieveAnAccountEntityByEmailAndPassword(email, encryptOldPassword);
        if (!accountEntity) {
            throw new Exception("the password is incorrect", 5, 400);
        }

        const encryptNewPassword = this._encryptPassword(newPassword);
        await this._accountRepository.updateAnAccountEntityPasswordById(
            accountEntity.getId(),
            encryptNewPassword
        );
    }

    async login(email, password, token) {
        const encryptPassword = this._encryptPassword(password);
        
        const accountEntity = await this._accountRepository.retrieveAnAccountEntityByEmailAndPassword(email, encryptPassword);
        if (!accountEntity) {
            throw new Exception("the email or password are incorrect", 1, 400);
        }

        const loginAndLogoutEntity = await this._loginAndLogoutRepository.retriveAnLoginAndLogoutEntityByEmail(email);
        if (loginAndLogoutEntity) {
            throw new Exception("you are already logged in", 6, 409);
        }

        const newRegisterLoginEntity = new LoginAndLogoutEntity(email, token);
        await this._loginAndLogoutRepository.saveEntity(newRegisterLoginEntity);
    }

    async logout(email) {
        const registerLoginEntity = await this._loginAndLogoutRepository.retriveAnLoginAndLogoutEntityByEmail(email);        
        if (!registerLoginEntity) {
            throw new Exception("the account is not logged", 4, 403);
        }

        await this._loginAndLogoutRepository.deleteAnLoginAndLogoutEntityByEmail(email);
    }

}
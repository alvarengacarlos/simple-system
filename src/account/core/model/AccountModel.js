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

    firstStepToCreateAccount(email, token) {
        const accountEntity = this._accountRepository.retrieveAnAccountByEmail(email);
        if (accountEntity) {
            throw new Exception("the email already belongs to an account", 2, 409);
        }

        const temporaryAccountEntity = this._temporaryAccountRepository.retrieveAnTemporaryAccountByEmail(email);
        if (temporaryAccountEntity) {
            throw new Exception("the email already in the registration process", 8, 409);
        }

        const newTemporaryAccountEntity = new TemporaryAccountEntity(email, token);
        this._temporaryAccountRepository.saveEntity(newTemporaryAccountEntity);

        this._createCleanerForTemporaryAccount(email);
    }

    _createCleanerForTemporaryAccount(email) {
        const timeInMilliseconds = process.env.TIME_IN_MILLISECONDS_TO_REMOVE_THE_TEMPORARY_ACCOUNT;
        
        setTimeout(function (email, temporaryAccountRepository) {
            temporaryAccountRepository.deleteAnTemporaryAccountByEmail(email);
        }, timeInMilliseconds, email, this._temporaryAccountRepository);
    }

    secondStepToCreateAnAccount(email, password, token) {
        const temporaryAccountEntity = this._temporaryAccountRepository.retrieveAnTemporaryAccountByEmailAndToken(email, token);
        if (!temporaryAccountEntity) {
            throw new Exception("the email is not in the registration process", 9, 400);
        }
        
        const encryptedPassword = this._encryptPassword(password);
        const newAccount = new AccountEntity(email, encryptedPassword);        
        
        this._accountRepository.saveEntity(newAccount);        
                
        this._temporaryAccountRepository.deleteAnTemporaryAccountByEmail(email);
    }

    _encryptPassword(password) {
        const hash = crypto.createHash('sha256');
        hash.update(password);        
        return hash.digest('hex');
    }
    
    deleteMyAccount(email, password) {
        const encryptPassword = this._encryptPassword(password);
        const accountEntity = this._accountRepository.retrieveAnAccountByEmailAndPassword(email, encryptPassword);

        if (!accountEntity) {
            throw new Exception("the password is incorrect", 5, 400);
        }

        this._accountRepository.deleteAnAccountByIdEmailAndPassword(
            accountEntity.getId(),
            accountEntity.getEmail(),
            accountEntity.getPassword()
        );
    }

    firstStepToResetAccountPassword(email, token) {
        const accountEntity = this._accountRepository.retrieveAnAccountByEmail(email);

        if (!accountEntity) {
            throw new Exception("the email does not belong to an account", 7, 400);
        }

        const temporaryAccountEntity = new TemporaryAccountEntity(email, token);        
        this._temporaryAccountRepository.saveEntity(temporaryAccountEntity);

        this._createCleanerForTemporaryAccount(email);
    }

    secondStepToResetAccountPassword(email, newPassword, token) {
        const temporaryAccountEntity = this._temporaryAccountRepository.retrieveAnTemporaryAccountByEmailAndToken(email, token);
        if (!temporaryAccountEntity) {
            throw new Exception("the email is not in the reset password process", 9, 400);
        }

        const encryptNewPassword = this._encryptPassword(newPassword);

        const accountEntity = this._accountRepository.retrieveAnAccountByEmail(email);        
        this._accountRepository.updateAnAccountPasswordById(
            accountEntity.getId(),
            encryptNewPassword
        );

        this._temporaryAccountRepository.deleteAnTemporaryAccountByEmail(email);
    }

    changeMyPassword(email, oldPassword, newPassword) {
        const encryptOldPassword = this._encryptPassword(oldPassword);
        
        const accountEntity = this._accountRepository.retrieveAnAccountByEmailAndPassword(email, encryptOldPassword);
        if (!accountEntity) {
            throw new Exception("the password is incorrect", 5, 400);
        }

        const encryptNewPassword = this._encryptPassword(newPassword);
        this._accountRepository.updateAnAccountPasswordById(
            accountEntity.getId(),
            encryptNewPassword
        );
    }

    login(email, password, token) {
        const encryptPassword = this._encryptPassword(password);
        
        const accountEntity = this._accountRepository.retrieveAnAccountByEmailAndPassword(email, encryptPassword);
        if (!accountEntity) {
            throw new Exception("the email or password are incorrect", 1, 400);
        }
        
        const loginAndLogoutEntity = this._loginAndLogoutRepository.retriveAnRegisterLoginByEmail(email);
        if (loginAndLogoutEntity) {
            throw new Exception("you are already logged in", 6, 409);
        }

        const newRegisterLoginEntity = new LoginAndLogoutEntity(email, token);
        this._loginAndLogoutRepository.saveEntity(newRegisterLoginEntity);
    }

    logout(email) {
        const registerLoginEntity = this._loginAndLogoutRepository.retriveAnRegisterLoginByEmail(email);        
        if (!registerLoginEntity) {
            throw new Exception("the account is not logged", 4, 403);
        }

        this._loginAndLogoutRepository.deleteLoginByEmail(email);
    }

}
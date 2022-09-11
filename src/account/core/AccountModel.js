import AccountEntity from "./AccountEntity.js";
import TemporaryAccountEntity from "./TemporaryAccountEntity.js";
import RegisterLoginEntity from "./RegisterLoginEntity.js";
import Exception from "../../helper/Exception.js";

import AccountRepository from "./AccountRepository.js";

export default class AccountModel {

    constructor() {
        this._accountRepository = new AccountRepository();
        this._accountModel = new AccountModel();
    }

    firstStepToCreateAccount(email, token) {
        const accountEntity = this._accountRepository.retrieveAnAccountByEmail(email);
        if (accountEntity) {
            throw new Exception("the email already belongs to an account", 2, 409);
        }

        const temporaryAccountEntity = this._accountRepository.retrieveAnTemporaryAccountByEmail(email);
        if (temporaryAccountEntity) {
            throw new Exception("the email already in the registration process", 8, 409);
        }

        const newTemporaryAccountEntity = new TemporaryAccountEntity(email, token);
        this._accountRepository.saveAnTemporaryAccount(newTemporaryAccountEntity);

        this._createCleanerForTemporaryAccount(email);
    }

    _createCleanerForTemporaryAccount(email) {
        const timeInMilliseconds = process.env.TIME_IN_MILLISECONDS_TO_REMOVE_THE_TEMPORARY_ACCOUNT;
        
        setTimeout(function (email, accountRepository) {
            accountRepository.deleteAnTemporaryAccountByEmail(email);
        }, timeInMilliseconds, email, this._accountRepository);
    }

    twoStepToCreateAnAccount(email, password, token) {
        const temporaryAccountEntity = this._accountRepository.retrieveAnTemporaryAccountByEmailAndToken(email, token);
        if (!temporaryAccountEntity) {
            throw new Exception("the email is not in the registration process", 9, 400);
        }
        
        const encryptedPassword = this._encryptPassword(password)
        const newAccount = new AccountEntity(email, encryptedPassword);
        
        this._accountRepository.saveAnAccount(newAccount);
        
        this._accountRepository.deleteAnTemporaryAccountByEmail(email);
    }

    _encryptPassword(password) {
        const hash = crypto.createHash('sha256');
        hash.update(password);
        return hash.digest('hex');
    }
    
    deleteAnAccount(email, password) {
        const encryptPassword = this._accountModel.encryptPassword(password);
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
        this._accountRepository.saveResetPasswordRequest(temporaryAccountEntity);

        this._createCleanerForTemporaryAccount(email);
    }

    secondStepToResetAccountPassword(email, newPassword, token) {
        const temporaryAccountEntity = this._accountRepository.retrieveAnTemporaryAccountByEmailAndToken(email, token);
        if (!temporaryAccountEntity) {
            throw new Exception("the email is not in the reset password process", 9, 400);
        }

        const encryptNewPassword = this._accountModel._encryptPassword(newPassword);

        const accountEntity = this._accountRepository.retrieveAnAccountByEmail(email);        
        this._accountRepository.updateAnAccountPasswordById(
            accountEntity.getId(),
            encryptNewPassword
        );

        this._accountRepository.deleteAnTemporaryAccountByEmail(email);
    }

    changePassword(email, oldPassword, newPassword) {
        const encryptOldPassword = this._accountModel._encryptPassword(oldPassword);
        
        const accountEntity = this._accountRepository.retrieveAnAccountByEmailAndPassword(email, encryptOldPassword);
        if (!accountEntity) {
            throw new Exception("the password is incorrect", 5, 400);
        }

        const encryptNewPassword = this._accountModel._encryptPassword(newPassword);
        this._accountRepository.updateAnAccountPasswordById(
            accountEntity.getId(),
            encryptNewPassword
        );
    }

    login(email, password, token) {
        const encryptPassword = this._accountModel.encryptPassword(password);
        
        const accountEntity = this._accountRepository.retrieveAnAccountByEmailAndPassword(email, encryptPassword);
        if (!accountEntity) {
            throw new Exception("the email or password are incorrect", 1, 400);
        }
        
        const registerLoginEntity = this._accountRepository.retriveAnRegisterLoginByEmail(email);
        if (registerLoginEntity) {
            throw new Exception("you are already logged in", 6, 409);
        }

        const newRegisterLoginEntity = new RegisterLoginEntity(email, token);
        this._accountRepository.registerLogin(newRegisterLoginEntity);
    }

    logout(email) {
        const registerLoginEntity = this._accountRepository.retriveAnRegisterLoginByEmail(email);        
        if (!registerLoginEntity) {
            throw new Exception("the account is not logged", 4, 403);
        }

        this._accountRepository.unregisterLogin(email);
    }

}
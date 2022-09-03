import ManageAccountRepository from "../repository/ManageAccountRepository.js";
import PasswordUtil from "../../../../util/src/crypto/PasswordUtil.js";
import Exception  from "../../../../util/src/exception/Exception.js";

export default class ManageAccountService {

    constructor(
        manageAccountRepository = new ManageAccountRepository(),
        passwordUtil = PasswordUtil
    ) {
        this._manageAccountRepository = manageAccountRepository;
        this._passwordUtil = passwordUtil
    }

    deleteAccount(email, password) {
        const encryptedPassword = this._passwordUtil.encryptPassword(password);
        
        const account = this._manageAccountRepository.searchAccountByEmailAndPassword(email, encryptedPassword);
        if(!account) {
            throw new Exception("password is incorrect", 5, 500);
        }

        this._manageAccountRepository.deleteAccountByEmail(email);
    }

    changePassword(email, newPassword, currentPassword) {
        const encryptedCurrentPassword = this._passwordUtil.encryptPassword(currentPassword);

        const account = this._manageAccountRepository.searchAccountByEmailAndPassword(email, encryptedCurrentPassword);
        if(!account) {
            throw new Exception("password is incorrect", 5, 500);
        }

        const encryptedNewPassword = this._passwordUtil.encryptPassword(newPassword);

        this._manageAccountRepository.alterAccountPasswordByEmail(email, encryptedNewPassword);
    }

}
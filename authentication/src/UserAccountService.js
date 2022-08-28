import TokenProvider from "./TokenProvider.js";
import UserAccountRepository from "./UserAccountRepository.js";
import Exception from "./Exception.js"
import crypto from "crypto";

export default class UserAccountService {

    constructor(userAccountRepository = new UserAccountRepository(), tokenProvider = new TokenProvider()) {
        this._userAccountRepository = userAccountRepository;
        this._tokenProvider = tokenProvider;
    }

    login(email, password) {
        const encryptedPassword = this._encryptPassword(password);
  
        const userAccount = this._userAccountRepository.searchUserAccountByEmailAndPassword(email, encryptedPassword);

        if (!userAccount) {
            throw new Exception(200, 1, "email or password are incorrect");
        }

        return this._tokenProvider.generateToken();        
    }

    logout(email) {}
    createAccount(email, password) {}
    deleteAccount(email, password) {}
    resetAccountPassword(email) {}
    
    _encryptPassword(password) {
        const hash = crypto.createHash('sha256');
        hash.update(password);
        return hash.digest('hex');
    }
}
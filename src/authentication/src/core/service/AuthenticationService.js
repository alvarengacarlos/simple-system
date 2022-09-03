import JwtTokenService from "./JwtTokenService.js";
import AuthenticationRepository from "../repository/AuthenticationRepository.js";
import PasswordUtil from "../../../../util/src/crypto/PasswordUtil.js";
import LoggedAccountsRepository from "../repository/LoggedAccountsRepository.js";
import Exception from "../../../../util/src/exception/Exception.js";

export default class AuthenticationService {

    constructor(
        authenticationRepository = new AuthenticationRepository(), 
        loggedAccountsRepository = new LoggedAccountsRepository(),
        jwtTokenProvider = new JwtTokenService(),        
        passwordUtil = PasswordUtil
    ) {
        this._authenticationRepository = authenticationRepository;
        this._loggedAccountsRepository = loggedAccountsRepository;
        this._jwtTokenProvider = jwtTokenProvider;
        this._passwordUtil = passwordUtil
    }

    login(email, password) {
        const encryptedPassword = this._passwordUtil.encryptPassword(password);
  
        const account = this._authenticationRepository.searchAccountByEmailAndPassword(email, encryptedPassword);

        if (!account) {
            throw new Exception("email or password are incorrect", 1, 400);
        }

        const token = this._jwtTokenProvider.generateJwtToken();
        
        this._loggedAccountsRepository.insertLoggedAccount(email, token);

        return token;
    }

    logout(email) {
        const account = this._loggedAccountsRepository.searchLoggedAccountByEmail(email);
        if (!account) {
            throw new Exception("the account is not logged", 4, 500);
        }

        this._loggedAccountsRepository.removeLoggedAccount(email);
    }
}
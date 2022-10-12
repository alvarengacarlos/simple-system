import * as jose from "jose";
import process from "process";

import Exception from "../../../src/helper/Exception.js";
import Logger from "../../util/Logger.js";

export default class TokenService {
    
    static tokenTypes = {
        RESET_PASSWORD: "reset-password",
        LOGIN: "login",
        CREATE_ACCOUNT: "create-account"
    };

    constructor() {
        this._issuer = process.env.ISSUER;        
        this._expirationTime = this._createExpirationTime();
        this._privateKey = process.env.PRIVATE_KEY;
        this._publicKey = process.env.PUBLIC_KEY;
    }    

    _createExpirationTime() {
        const dateNow = new Date();
        const expirationTime = new Date();
        expirationTime.setMilliseconds(
            dateNow.getMilliseconds() + Number(process.env.EXPIRATION_TIME_IN_MILLISECONDS)
        );

        return this._convertDateToUnixTimestamp(expirationTime);
    }   

    _convertDateToUnixTimestamp(date) {        
        return Math.floor(date / 1000);
    }

    async generateCreateAccountToken() {
        Logger.infoLog("Generating the CreateAccountToken token");

        const token = this._generateJwtToken(TokenService.tokenTypes.CREATE_ACCOUNT);
        return token;
    }

    async _generateJwtToken(type) {
        if (!type) {
            throw new Error("the type field is required");
        }

        const privateKey = await jose.importPKCS8(this._privateKey);

        const jwtToken = await new jose.SignJWT({"type": type})
            .setProtectedHeader({ alg: 'PS256' })
            .setIssuedAt()
            .setIssuer(this._issuer)
            .setExpirationTime(this._expirationTime)
            .sign(privateKey);

        return jwtToken;
    }

    async checkCreateAccountToken(token) {
        Logger.infoLog("Checking the CreateAccountToken token");

        const claim = await this._checkJwtToken(token);        
        if (claim.payload.type != TokenService.tokenTypes.CREATE_ACCOUNT) {
            Logger.warningLog("The token is invalid");

            throw new Exception("the token is invalid", 3, 401);
        }
    }

    async _checkJwtToken(token) {
        try {
            const publickey = await jose.importX509(this._publicKey);
            const claims = await jose.jwtVerify(token, publickey);
            return claims;
        
        } catch (error) {     
            if(error?.code == "ERR_JWT_EXPIRED") {
                Logger.warningLog("The token is expired");

                throw new Exception("the token is expired", 13, 400);

            } else {
                Logger.warningLog("The token is invalid");

                throw new Exception("the token is invalid", 3, 401);
            }
                
        }        
    }

    async generateLoginToken() {
        Logger.infoLog("Generating the LoginToken token");

        const token = await this._generateJwtToken(TokenService.tokenTypes.LOGIN);
        return token;
    }

    async checkLoginToken(token) {
        Logger.infoLog("Checking the LoginToken token");

        const claim = await this._checkJwtToken(token);
        if (claim.payload.type != TokenService.tokenTypes.LOGIN) {
            Logger.warningLog("The token is invalid");

            throw new Exception("the token is invalid", 3, 401);
        }
    }

    async generateResetPasswordToken() {
        Logger.infoLog("Generating the ResetPasswordToken token");
        
        const token = this._generateJwtToken(TokenService.tokenTypes.RESET_PASSWORD);
        return token;
    }    

    async checkResetPasswordToken(token) {
        Logger.infoLog("Checking the ResetPasswordToken token");

        const claim = await this._checkJwtToken(token);
        if (claim.payload.type != TokenService.tokenTypes.RESET_PASSWORD) {
            Logger.warningLog("The token is invalid");
            
            throw new Exception("the token is invalid", 3, 401);
        }
    }
    
}
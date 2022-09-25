import * as jose from "jose";
import process from "process";

import Exception from "../../../src/helper/Exception.js";

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
        const claim = await this._checkJwtToken(token);        
        if (claim.payload.type != TokenService.tokenTypes.CREATE_ACCOUNT) {
            throw new Exception("the token is invalid", 3, 401);
        }
    }

    async _checkJwtToken(token) {
        try {
            const publickey = await jose.importX509(this._publicKey);
            const claims = await jose.jwtVerify(token, publickey);
            return claims;
        
        } catch (error) {            
            throw new Exception("the token is invalid", 3, 401);
        }        
    }

    async generateLoginToken() {    
        const token = await this._generateJwtToken(TokenService.tokenTypes.LOGIN);
        return token;
    }

    async checkLoginToken(token) {
        const claim = await this._checkJwtToken(token);
        if (claim.payload.type != TokenService.tokenTypes.LOGIN) {
            throw new Exception("the token is invalid", 3, 401);
        }
    }

    async generateResetPasswordToken() {        
        const token = this._generateJwtToken(TokenService.tokenTypes.RESET_PASSWORD);
        return token;
    }    

    async checkResetPasswordToken(token) {
        const claim = await this._checkJwtToken(token);
        if (claim.payload.type != TokenService.tokenTypes.RESET_PASSWORD) {
            throw new Exception("the token is invalid", 3, 401);
        }
    }
    
}
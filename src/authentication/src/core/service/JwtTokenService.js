import * as jose from "jose";
import process from "process";

import Exception from "../../../../util/src/exception/Exception.js";

export default class JwtTokenService {

    constructor() {
        this._issuer = process.env.ISSUER;
        this._expirationTime = process.env.EXPIRATION_TIME;
        this._privateKey = process.env.PRIVATE_KEY;
        this._publicKey = process.env.PUBLIC_KEY;
    }

    async generateJwtToken() {
        const privateKey = await jose.importPKCS8(this._privateKey);

        const jwtToken = await new jose.SignJWT({})
            .setProtectedHeader({ alg: 'PS256' })
            .setIssuedAt()
            .setIssuer(this._issuer)
            .setExpirationTime(this._expirationTime)
            .sign(privateKey);

        return jwtToken;
    }

    async verifyJwtToken(jwtToken) {
        try {
            const publickey = await jose.importX509(this._publicKey);
            await jose.jwtVerify(jwtToken, publickey);
        
        } catch (error) {            
            throw new Exception("invalid token", 3, 500);
        }
        
    }

}
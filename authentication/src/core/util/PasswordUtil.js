import crypto from "crypto";

export default class PasswordUtil {

    static encryptPassword(password) {
        const hash = crypto.createHash('sha256');
        hash.update(password);
        return hash.digest('hex');
    }

}
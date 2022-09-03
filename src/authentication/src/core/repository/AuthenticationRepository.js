export default class AuthenticationRepository {
    
    constructor(databaseConnection) {
        this._databaseConnection = databaseConnection;
    }

    searchAccountByEmailAndPassword(email, password) {}
    
}
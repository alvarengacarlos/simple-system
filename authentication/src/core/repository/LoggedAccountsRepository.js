export default class LoggedAccountsRepository {

    constructor(databaseConnection) {
        this._databaseConnection = databaseConnection;
    }

    insertLoggedAccount(email, token) {}
    removeLoggedAccount(email) {}
    searchLoggedAccountByEmail(email) {}

}
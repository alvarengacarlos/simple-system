import AccountEntity from "./AccountEntity.js";
import RegisterLoginEntity from "./RegisterLoginEntity.js";
import TemporaryAccount from "./TemporaryAccountEntity.js";

export default class AccountRepository {

    //Temporary Account
    saveAnTemporaryAccount(temporaryAccountEntity) {
        //Salva no banco
    }

    retrieveAnTemporaryAccountByEmail(email) {
        const retrivedTemporaryAccount = {
            id: "",
            createAt: "",
            updateAt: "",
            email: "",
            token: ""
        }

        return new TemporaryAccount(retrivedTemporaryAccount.email, retrivedTemporaryAccount.token)
            .setId(retrivedTemporaryAccount.id)
            .setCreateAt(retrivedTemporaryAccount.createAt)
            .setUpdateAt(retrivedTemporaryAccount.updateAt);
    }

    retrieveAnTemporaryAccountByEmailAndToken(email, token) {
        const retrivedTemporaryAccount = {
            id: "",
            createAt: "",
            updateAt: "",
            email: "",
            token: ""
        }

        return new TemporaryAccount(retrivedTemporaryAccount.email, retrivedTemporaryAccount.token)
            .setId(retrivedTemporaryAccount.id)
            .setCreateAt(retrivedTemporaryAccount.createAt)
            .setUpdateAt(retrivedTemporaryAccount.updateAt);
    }

    deleteAnTemporaryAccountByEmail(email) {
        //delete do banco
    }
    
    //Reset Password
    saveResetPasswordRequest(temporaryAccountEntity) {
        //salva a requisição
    }

    //Accout
    saveAnAccount(accountEntity) {
        //Salva no banco        
    }

    retrieveAnAccountByEmailAndPassword(email, password) {        
        //Busca no banco
        const retrivedAccount = {
            id: "",
            createAt: "",
            updateAt: "",
            email: "",
            password: ""
        }        
        return new AccountEntity(email, password)
            .setId(retrivedAccount.id)
            .setCreateAt(retrivedAccount.createAt)
            .setUpdateAt(retrivedAccount.updateAt);
    }

    retrieveAnAccountByEmail(email) {        
        //Busca no banco
        const retrivedAccount = {
            id: "",
            createAt: "",
            updateAt: "",
            email: "",
            password: ""
        }        

        if (!retrivedAccount) {
            return null;
        }
        
        return new AccountEntity(email, password)
            .setId(retrivedAccount.id)
            .setCreateAt(retrivedAccount.createAt)
            .setUpdateAt(retrivedAccount.updateAt);        
    }

    updateAnAccountPasswordById(id, password) {        
        //Atualiza no banco
    }

    deleteAnAccountByIdEmailAndPassword(id, email, password) {
        //Deleta no banco
    }

    //Register Login
    registerLogin(registerLogin) {
        //Salvar em uma coleção separada
    }

    unregisterLogin(email) {
        //Remover na mesma coleção
    }

    retriveAnRegisterLoginByEmail(email) {        
        //Busca no banco
        const retrivedRegisterLogin = {
            id: "",
            createAt: "",
            updateAt: "",
            email: "",
            password: ""
        }  
        new RegisterLoginEntity(email, token)
            .setId(retrivedRegisterLogin.id)
            .setCreateAt(retrivedRegisterLogin.createAt)
            .setUpdateAt(retrivedRegisterLogin.updateAt);            
    }
    
}
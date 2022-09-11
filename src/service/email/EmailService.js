export default class EmailService {

    constructor() {
        this._subject = null;
        this._body = null;
    }

    setSubject(subject) {
        this._subject = subject;
    }

    setBody(body) {
        this._body = body;
    }

    sendCreateAccountMail(receiver, token) {
        if (!receiver) {
            throw new Error("the receiver is not defined");
        }
        const subject = "New account";        
        const body = `
            Hello, this is your link. 
            Click or copy it to finalize your register.
            <a href="https://?email=${receiver}&token=${token}" target="_blank">Click Here</a>
        `;


        //Send email
    }

    sendResetPasswordMail(receiver, token) {
        if (!receiver) {
            throw new Error("the receiver is not defined");
        }
        const subject = "New account";        
        const body = `
            Hello, this is your link. 
            Click or copy it to finalize your reset account password.
            <a href="https://?email=${receiver}&token=${token}" target="_blank">Click Here</a>
        `;

        //Send email
    }

}
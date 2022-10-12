import nodemailer from "nodemailer";
import process from "process";

import Exception from "../../helper/Exception.js";
import Logger from "../../util/Logger.js";

export default class EmailService {

    constructor() {
        this._sender = process.env.EMAIL_SENDER;
        this._smtpHost = process.env.EMAIL_SMTP_HOST;
        this._smtpUserEmail = process.env.EMAIL_SMTP_USERNAME;
        this._smtpUserPassword = process.env.EMAIL_SMTP_USER_PASSWORD;
        this._smtpPort = process.env.EMAIL_SMTP_PORT;         
        this._applicationDomainName = this._fixDomainName();
        this._configuration = this._makeConfiguration();        
        this._subject = null;
        this._body = null;
    }

    _fixDomainName() {
        const domainName = String(process.env.APPLICATION_DOMAIN_NAME);
        if (!domainName.endsWith("/")) {
            return domainName.concat("/");
        }

        return domainName;
    }

    _makeConfiguration() {
        return {
            host: this._smtpHost,
            port: this._smtpPort,
            secure: false,
            auth: {
                user: this._smtpUserEmail,
                pass: this._smtpUserPassword
            }
        };
    }

    setSubject(subject) {
        this._subject = subject;
    }

    setBody(body) {
        this._body = body;
    }

    async sendCreateAccountMail(receiver, token) {
        Logger.infoLog(`Sending CreateAccountEmail to ${receiver}`);

        if (!receiver || !token) {
            throw new Error("the receiver or token is not defined");
        }
        const subject = "Register your new account";        
        const body = `
            Hello, this is your link.
            Click or copy it to finalize your register.
            <a href="${this._applicationDomainName}view/account/confirm-account-creation-view.html?email=${receiver}&token=${token}" target="_blank">Click Here</a>.

            Not reply it.
        `;

        return await this._sendMail(receiver, subject, body);
    }

    async _sendMail(receiver, subject, body) {
        const transporter = nodemailer.createTransport(this._configuration);
        try {
            return await transporter.sendMail({
                from: this._sender,
                to: receiver,
                subject: subject,
                html: body
            });
        
        } catch(error) {
            Logger.errorLog("it is not possible to send the email", error);
            throw new Exception("it is not possible to send the email", 12, 500);
        }
    }

    async sendResetPasswordMail(receiver, token) {
        Logger.infoLog(`Sending ResetPasswordEmail to ${receiver}`);

        if (!receiver || !token) {
            throw new Error("the receiver or token is not defined");
        }
        const subject = "Reset your account password";        
        const body = `
            Hello, this is your link. 
            Click or copy it to finalize your reset account password.
            <a href="${this._applicationDomainName}view/account/confirm-reset-account-password-view.html?email=${receiver}&token=${token}" target="_blank">Click Here</a>.

            Not reply it.
        `;

        return await this._sendMail(receiver, subject, body);
    }

}
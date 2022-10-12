import express from "express";

import Validation from "./Validation.js";
import Gateway from "../core/Gateway.js";

const app = express();

app.get("/test", (request, response, next) => {
	try {
		next();
		return response.status(200).json({message: "Account subapp - It test is successfully"});    

	} catch (error) {
		error.message = "Test error";
		error.httpStatusCode = 500;
		next(error);
	}    
});

app.post("/create-account", async (request, response, next) => {
	try {
		const result = Validation.createAccountValidation(request?.body);        
        
		const gateway = new Gateway();
		await gateway.firstStepToCreateAccount(result.email);
        
		next();
		return response.status(200).json();

	} catch (exception) {            
		next(exception);
	}        
});

app.post("/confirm-account-creation", async (request, response, next) => {
	try {
		const result = Validation.confirmAccountCreationValidation(request?.body);
        
		const gateway = new Gateway();
		await gateway.secondStepToCreateAnAccount(result.token, result.email, result.password);
        
		next();
		return response.status(200).json();

	} catch (exception) {            
		next(exception);
	}        
});

app.delete("/delete-my-account", async (request, response, next) => {
	try {
		const result = Validation.deleteMyAccountValidation(request?.body);
        
		const gateway = new Gateway();
		await gateway.deleteMyAccount(result.token, result.email, result.password);
        
		next();
		return response.status(200).json();

	} catch (exception) {            
		next(exception);
	}        
});
   
app.post("/reset-account-password", async (request, response, next) => {
	try {
		const result = Validation.resetAccountPasswordValidation(request?.body);
        
		const gateway = new Gateway();
		await gateway.firstStepToResetAccountPassword(result.email);
        
		next();
		return response.status(200).json();

	} catch (exception) {            
		next(exception);
	}        
});

app.patch("/confirm-reset-account-password", async (request, response, next) => {
	try {
		const result = Validation.confirmResetAccountPasswordValidation(request?.body);
        
		const gateway = new Gateway();
		await gateway.secondStepToResetAccountPassword(result.token, result.email, result.newPassword);
        
		next();
		return response.status(200).json();

	} catch (exception) {            
		next(exception);
	}        
});

app.patch("/change-my-password", async (request, response, next) => {
	try {
		const result = Validation.changeMyPassowrdValidation(request?.body);
        
		const gateway = new Gateway();
		await gateway.changeMyPassword(result.token, result.email, result.oldPassword, result.newPassword);
        
		next();
		return response.status(200).json();

	} catch (exception) {            
		next(exception);
	}        
});

app.post("/login", async (request, response, next) => {
	try {
		const result = Validation.loginValidation(request?.body);
        
		const gateway = new Gateway();
		const token = await gateway.login(result.email, result.password);
        
		next();
		return response.status(200).json({token: token});

	} catch (exception) {            
		next(exception);
	}        
});

app.post("/logout", async (request, response, next) => {
	try {
		const result = Validation.logoutValidation(request?.body);
        
		const gateway = new Gateway();
		await gateway.logout(result.token, result.email);
        
		next();
		return response.status(200).json();

	} catch (exception) {            
		next(exception);
	}        
});

export default app;
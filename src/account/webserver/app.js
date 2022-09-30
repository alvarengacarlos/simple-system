import express from "express";

import Validation from "./Validation.js"
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

app.get("/create-account", async (request, response, next) => {
    try {
        Validation.createAccount(request.body);
        const email = request.body.email;
        const gateway = new Gateway();
        await gateway.firstStepToCreateAccount(email);
        
        next();
        return response.status(200).json();

    } catch (exception) {            
        next(exception);
    }        
});
    
export default app;
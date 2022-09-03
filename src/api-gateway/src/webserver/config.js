import process from "process";
import express from "express";

export default function config(app) {
    app.use(express.json());
    defineEnviromentType(app);
}

function defineEnviromentType(app) {
    const isDebug = process.env.API_GATEWAY_DEBUG;

    if (isDebug == "true") {        
        app.set("env", "development");        

    } else {
        app.set("env", "production");
    }
}
import process from "process";
import express from "express";
import path from "path";

export default function config(app) {
	app.use(express.json());
	defineStaticFiles(app);
	defineEnviromentType(app);
}

function defineStaticFiles(app) {
	if (!process.env.APPLICATION_ROOT_DIR) {
		throw new Error("The APPLICATION_ROOT_DIR environment variable is not defined");
	}

	const p = path.resolve(process.env.APPLICATION_ROOT_DIR, "src", "public");
	app.use(express.static(p));
}

function defineEnviromentType(app) {
	const isDebug = process.env.API_GATEWAY_DEBUG;

	if (isDebug == "true") {        
		app.set("env", "development");        

	} else {
		app.set("env", "production");
	}
}
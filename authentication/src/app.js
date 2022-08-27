import express from "express";

import config from "./config.js";
import router from "./router.js";

const app = express();

export default function main() {
    config(app);
    router(app);

    return app;
}
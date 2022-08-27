import express from "express";

import config from "./config.js";
import server from "./server.js";
import router from "./router.js";
import { beforeRouteMiddlewares, afterRouteMiddlewares } from "./middleware.js";

const app = express();

export default function main() {
    config(app);
    beforeRouteMiddlewares(app);
    router(app);
    afterRouteMiddlewares(app);
    server(app);
}
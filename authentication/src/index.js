import express from "express";

import config from "./config.js";
import server from "./server.js";
import router from "./router.js";

const app = express();

config(app);
router(app);
server(app);
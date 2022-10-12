import process from "process";

import Logger from "../../util/Logger.js";

const port = process.env.API_GATEWAY_PORT;

if (port === undefined) {
	process.exit(1);
}

export default function server (app) {
	app.listen(port, () => Logger.infoLog(`Server is up in ${port} port`));
}
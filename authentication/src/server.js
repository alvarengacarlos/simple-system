import process from "process";

const port = process.env.AUTHENTICATION_PORT;

if (port === undefined) {
    process.exit(1);
}

export default function server (app) {
    app.listen(port, () => console.log("Server is up in %d port", port))
}
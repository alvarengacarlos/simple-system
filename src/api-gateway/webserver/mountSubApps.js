import accountSubApp from "../../account/index.js";

export default function mountSubApps(app) {
    app.use("/account", accountSubApp);
}
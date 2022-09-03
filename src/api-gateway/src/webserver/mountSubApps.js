import authenticationSubApp from "../../../authentication/index.js";

export default function mountSubApps(app) {
    app.use("/authentication", authenticationSubApp);
}
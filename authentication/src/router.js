export default function router(app) {
    app.get("/test", (request, response) => {
        return response.status(200)
            .json({message: "It test is successfully"});
    });
}
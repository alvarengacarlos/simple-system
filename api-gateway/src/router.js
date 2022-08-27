export default function router(app) {        
    app.get("/test", (request, response, next) => {    
        try {
            next();
            return response.status(200).json({message: "It test is successfully"});
            
        } catch (error) {
            error.message = "My error";
            error.httpStatus = 500;
            next(error);
        }       
    });

};
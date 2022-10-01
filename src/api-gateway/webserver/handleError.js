import Exception from "../../helper/Exception.js";

export default function handleError(error, request, response, next) {
    if (error.httpStatusCode) {
        return response.status(error.httpStatusCode).send({error: error.message});
    }

    const exception = new Exception("sorry, internal error", 11, 500);
    return response.status(exception.httpStatusCode).send({error: exception.message});
}
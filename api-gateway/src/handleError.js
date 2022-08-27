export default function handleError(error, request, response, next) {
    if (error.httpStatusCode) {
        return response.status(error.httpStatusCode).send({error: error.message});
    }

    return response.status(500).send({error: error.message});
}
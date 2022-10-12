import Exception from "../../helper/Exception.js";

//eslint-disable-next-line
export default function handleError(error, request, response, next) {
	if (error._httpStatusCode) {
		return response.status(error._httpStatusCode).json({error: error.message});
	}

	const exception = new Exception("sorry, internal error", 11, 500);
	return response.status(exception._httpStatusCode).json({error: exception.message});
}
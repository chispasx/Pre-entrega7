import ErrorDictionary from "./ErrorDictionary.js";

class CustomError extends Error {

    constructor(code, message = null, statusCode = null, details = null) {

        const defaultError = ErrorDictionary[code];

        super(
            message ||
            defaultError?.message ||
            "Error interno del servidor"
        );

        this.name = "CustomError";
        this.code = code;

        this.statusCode =
            statusCode ||
            defaultError?.status ||
            500;

        this.details = details;

        Error.captureStackTrace(this, this.constructor);
    }
}

export default CustomError;
class ApiError extends Error {
    constructor(statusCode, message, code = "ERROR") {
        super(message);

        this.name = "ApiError";
        this.statusCode = statusCode;
        this.code = code;

        Error.captureStackTrace(this, this.constructor);
    }

    static badRequest(message, code = "INVALID_DATA") {
        return new ApiError(400, message, code);
    }

    static notFound(message, code = "NOT_FOUND") {
        return new ApiError(404, message, code);
    }

    static unauthorized(message = "No autorizado") {
        return new ApiError(401, message, "UNAUTHORIZED");
    }

    static forbidden(message = "Acceso prohibido") {
        return new ApiError(403, message, "FORBIDDEN");
    }

    static internal(message = "Error interno del servidor") {
        return new ApiError(500, message, "INTERNAL_ERROR");
    }
}

export default ApiError;
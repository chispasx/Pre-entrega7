import mongoose from "mongoose";
import multer from "multer";
import logger from "../config/logger.js";
import ErrorCodes from "../errors/ErrorCodes.js";

const errorHandler = (error, req, res, next) => {

    let status = error.statusCode || 500;
    let code = error.code || ErrorCodes.INTERNAL_ERROR;
    let message = error.message || "Error interno del servidor";

    // Errores de validación de Mongoose
    if (error instanceof mongoose.Error.ValidationError) {
        status = 400;
        code = ErrorCodes.INVALID_DATA;
        message = "Los datos enviados no son válidos.";
    }

    // IDs inválidos
    if (error instanceof mongoose.Error.CastError) {
        status = 400;
        code = ErrorCodes.INVALID_DATA;
        message = "El identificador proporcionado no es válido.";
    }

    // Archivo demasiado grande
    if (error.code === "LIMIT_FILE_SIZE") {
        status = 400;
        code = ErrorCodes.FILE_TOO_LARGE;
        message = "El archivo supera el tamaño máximo permitido.";
    }

    // Errores de Multer
    if (error instanceof multer.MulterError) {

        status = 400;

        if (error.code === "LIMIT_FILE_SIZE") {
            code = ErrorCodes.FILE_TOO_LARGE;
            message = "El archivo supera el tamaño máximo permitido.";
        } else if (error.code === "LIMIT_UNEXPECTED_FILE") {
            code = ErrorCodes.FILE_FIELD_INVALID;
            message = "El campo del archivo no es válido. Debe utilizarse el campo file.";
        } else {
            code = ErrorCodes.INVALID_DATA;
            message = "Error al procesar el archivo.";
        }
    }

    logger.error(
        `${req.method} ${req.originalUrl} - ${code}: ${message}`
    );

    return res.status(status).json({
        success: false,
        error: {
            code,
            message
        },
        ...(error.details
            ? { details: error.details }
            : {})
    });
};

export default errorHandler;
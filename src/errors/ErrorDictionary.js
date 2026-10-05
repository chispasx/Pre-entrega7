import ErrorCodes from "./ErrorCodes.js";

const ErrorDictionary = {

    [ErrorCodes.USER_NOT_FOUND]: {
        status: 404,
        message: "Usuario no encontrado"
    },

    [ErrorCodes.PRODUCT_NOT_FOUND]: {
        status: 404,
        message: "Producto no encontrado"
    },

    [ErrorCodes.ORDER_NOT_FOUND]: {
        status: 404,
        message: "Envío no encontrado"
    },

    [ErrorCodes.DELIVERY_NOT_FOUND]: {
        status: 404,
        message: "Entrega no encontrada"
    },

    [ErrorCodes.INVALID_DATA]: {
        status: 400,
        message: "Los datos enviados no son válidos"
    },

    [ErrorCodes.VALIDATION_ERROR]: {
        status: 400,
        message: "Datos inválidos"
    },

    [ErrorCodes.INVALID_STATUS]: {
        status: 400,
        message: "Estado inválido"
    },

    [ErrorCodes.INVALID_QUANTITY]: {
        status: 400,
        message: "Cantidad inválida"
    },

    [ErrorCodes.FILE_REQUIRED]: {
        status: 400,
        message: "El archivo es obligatorio"
    },

    [ErrorCodes.INVALID_FILE_TYPE]: {
        status: 400,
        message: "Tipo de archivo inválido"
    },

    [ErrorCodes.FILE_TOO_LARGE]: {
        status: 400,
        message: "El archivo supera el tamaño máximo permitido"
    },

    [ErrorCodes.FILE_FIELD_INVALID]: {
        status: 400,
        message: "El campo del archivo no es válido"
    },

    [ErrorCodes.INVALID_DOCUMENT_TYPE]: {
        status: 400,
        message: "Tipo de documento inválido"
    },

    [ErrorCodes.FILE_SAVE_ERROR]: {
        status: 500,
        message: "No se pudo guardar el archivo"
    },

    [ErrorCodes.DATABASE_ERROR]: {
        status: 500,
        message: "Error en la base de datos"
    },

    [ErrorCodes.INTERNAL_ERROR]: {
        status: 500,
        message: "Error interno del servidor"
    }
};

export default ErrorDictionary;
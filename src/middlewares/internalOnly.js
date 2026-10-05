import env from "../config/env.config.js";

const internalOnly = (req, res, next) => {
    if (env.NODE_ENV === "production") {
        return res.status(404).json({
            success: false,
            error: {
                code: "NOT_FOUND",
                message: "Recurso no encontrado."
            }
        });
    }

    next();
};

export default internalOnly;

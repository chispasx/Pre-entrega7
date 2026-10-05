import mongoose from "mongoose";
import deliveriesRepository from "../repositories/deliveries.repository.js";
import CustomError from "../errors/CustomError.js";
import ErrorCodes from "../errors/ErrorCodes.js";
import { DELIVERY_STATUS } from "../constants/index.js";
import logger from "../config/logger.js";
import { buildFileMetadata } from "../utils/fileMetadata.js";
import { removeUploadedFile } from "../config/upload.config.js";

const validateId = (id) => {

    if (!mongoose.isValidObjectId(id)) {

        throw new CustomError(
            ErrorCodes.INVALID_DATA,
            "El ID proporcionado no es válido"
        );
    }
};

const validatePagination = (page, limit) => {

    if (
        !Number.isInteger(page) ||
        !Number.isInteger(limit) ||
        page < 1 ||
        limit < 1 ||
        limit > 100
    ) {

        throw new CustomError(
            ErrorCodes.INVALID_DATA,
            "page debe ser mayor o igual a 1 y limit debe estar entre 1 y 100"
        );
    }
};

class DeliveriesService {

    async getDeliveries(page = 1, limit = 10) {

        validatePagination(page, limit);

        return deliveriesRepository.getAll({
            page,
            limit
        });
    }

    async getById(id) {

        validateId(id);

        const delivery =
            await deliveriesRepository.getById(id);

        if (!delivery) {

            throw new CustomError(
                ErrorCodes.DELIVERY_NOT_FOUND
            );
        }

        return delivery;
    }

    async create(data) {

        if (!data?.order) {

            throw new CustomError(
                ErrorCodes.VALIDATION_ERROR,
                "El campo order es obligatorio"
            );
        }

        if (!data?.driver) {

            throw new CustomError(
                ErrorCodes.VALIDATION_ERROR,
                "El campo driver es obligatorio"
            );
        }

        if (
            data.status &&
            !Object.values(DELIVERY_STATUS).includes(
                data.status
            )
        ) {

            throw new CustomError(
                ErrorCodes.INVALID_STATUS,
                "Estado de entrega inválido"
            );
        }

        const delivery =
            await deliveriesRepository.create({
                order: data.order,
                driver: data.driver,
                status:
                    data.status ||
                    DELIVERY_STATUS.ASSIGNED
            });

        logger.info(
            `Entrega creada: ${delivery._id}`
        );

        return delivery;
    }

    async update(id, data) {

        validateId(id);

        if (
            data.status &&
            !Object.values(DELIVERY_STATUS).includes(
                data.status
            )
        ) {

            throw new CustomError(
                ErrorCodes.INVALID_STATUS,
                "Estado de entrega inválido"
            );
        }

        const delivery =
            await deliveriesRepository.update(
                id,
                data
            );

        if (!delivery) {

            throw new CustomError(
                ErrorCodes.DELIVERY_NOT_FOUND
            );
        }

        logger.info(
            `Entrega actualizada: ${id}`
        );

        return delivery;
    }

    async remove(id) {

        validateId(id);

        const delivery =
            await deliveriesRepository.delete(id);

        if (!delivery) {

            throw new CustomError(
                ErrorCodes.DELIVERY_NOT_FOUND
            );
        }

        logger.info(
            `Entrega eliminada: ${id}`
        );

        return delivery;
    }

    async saveProof(id, file) {
        validateId(id);

        if (!file) {
            throw new CustomError(ErrorCodes.FILE_REQUIRED);
        }

        const deliveryExists = await deliveriesRepository.getById(id);
        if (!deliveryExists) {
            await removeUploadedFile(file.path);
            throw new CustomError(ErrorCodes.DELIVERY_NOT_FOUND);
        }

        const proof = buildFileMetadata(file, "PROOF");

        try {
            const delivery = await deliveriesRepository.saveProof(id, proof);
            if (!delivery) {
                await removeUploadedFile(file.path);
                throw new CustomError(ErrorCodes.DELIVERY_NOT_FOUND);
            }
            logger.info(`Comprobante asociado a la entrega ${id}: ${proof.generatedName}`);
            return delivery;
        } catch (error) {
            await removeUploadedFile(file.path);
            if (error instanceof CustomError) throw error;
            logger.error(`Error al guardar comprobante de entrega ${id}: ${error.message}`);
            throw new CustomError(ErrorCodes.FILE_SAVE_ERROR);
        }
    }
}

export default new DeliveriesService();



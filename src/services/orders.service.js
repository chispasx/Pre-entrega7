import mongoose from "mongoose";
import ordersRepository from "../repositories/orders.repository.js";
import CustomError from "../errors/CustomError.js";
import ErrorCodes from "../errors/ErrorCodes.js";
import { ORDER_STATUS } from "../constants/index.js";
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

class OrdersService {

    async getOrders(page = 1, limit = 10) {

        validatePagination(page, limit);

        return ordersRepository.getAll({
            page,
            limit
        });
    }

    async getOrderById(id) {

        validateId(id);

        const order =
            await ordersRepository.getById(id);

        if (!order) {

            throw new CustomError(
                ErrorCodes.ORDER_NOT_FOUND
            );
        }

        return order;
    }

    async createOrder(data) {

        const requiredFields = [
            "sender",
            "recipient",
            "origin",
            "destination",
            "description"
        ];

        const missingField =
            requiredFields.find(
                field => !data?.[field]
            );

        if (missingField) {

            throw new CustomError(
                ErrorCodes.VALIDATION_ERROR,
                `El campo ${missingField} es obligatorio`
            );
        }

        if (
            data.status &&
            !Object.values(ORDER_STATUS).includes(data.status)
        ) {

            throw new CustomError(
                ErrorCodes.INVALID_STATUS,
                "Estado de envío inválido"
            );
        }

        const order =
            await ordersRepository.create({
                sender: data.sender,
                recipient: data.recipient,
                origin: data.origin,
                destination: data.destination,
                description: data.description,
                status:
                    data.status ||
                    ORDER_STATUS.PENDING
            });

        logger.info(
            `Envío creado: ${order._id}`
        );

        return order;
    }

    async updateOrder(id, data) {

        validateId(id);

        if (
            data.status &&
            !Object.values(ORDER_STATUS).includes(data.status)
        ) {

            throw new CustomError(
                ErrorCodes.INVALID_STATUS,
                "Estado de envío inválido"
            );
        }

        const order =
            await ordersRepository.update(
                id,
                data
            );

        if (!order) {

            throw new CustomError(
                ErrorCodes.ORDER_NOT_FOUND
            );
        }

        logger.info(
            `Envío actualizado: ${id}`
        );

        return order;
    }

    async deleteOrder(id) {

        validateId(id);

        const order =
            await ordersRepository.delete(id);

        if (!order) {

            throw new CustomError(
                ErrorCodes.ORDER_NOT_FOUND
            );
        }

        logger.info(
            `Envío eliminado: ${id}`
        );

        return order;
    }

    async addTracking(id, data) {

        validateId(id);

        if (
            !data?.status ||
            !Object.values(ORDER_STATUS).includes(data.status)
        ) {

            throw new CustomError(
                ErrorCodes.INVALID_STATUS,
                "Estado de tracking inválido"
            );
        }

        if (!data.description) {

            throw new CustomError(
                ErrorCodes.VALIDATION_ERROR,
                "La descripción del tracking es obligatoria"
            );
        }

        const order =
            await ordersRepository.addTracking(
                id,
                {
                    status: data.status,
                    description: data.description,
                    location: data.location || ""
                }
            );

        if (!order) {

            throw new CustomError(
                ErrorCodes.ORDER_NOT_FOUND
            );
        }

        return order;
    }

    async saveProof(id, file) {
        validateId(id);

        if (!file) {
            throw new CustomError(ErrorCodes.FILE_REQUIRED);
        }

        const orderExists = await ordersRepository.getById(id);
        if (!orderExists) {
            await removeUploadedFile(file.path);
            throw new CustomError(ErrorCodes.ORDER_NOT_FOUND);
        }

        const proof = buildFileMetadata(file, "PROOF");

        try {
            const order = await ordersRepository.saveProof(id, proof);
            if (!order) {
                await removeUploadedFile(file.path);
                throw new CustomError(ErrorCodes.ORDER_NOT_FOUND);
            }
            logger.info(`Comprobante asociado al pedido ${id}: ${proof.generatedName}`);
            return order;
        } catch (error) {
            await removeUploadedFile(file.path);
            if (error instanceof CustomError) throw error;
            logger.error(`Error al guardar comprobante del pedido ${id}: ${error.message}`);
            throw new CustomError(ErrorCodes.FILE_SAVE_ERROR);
        }
    }
}

export default new OrdersService();



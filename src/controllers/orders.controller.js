import ordersService from "../services/orders.service.js";

class OrdersController {

    async getAll(req, res, next) {

        try {

            const page = Number(req.query.page || 1);
            const limit = Number(req.query.limit || 10);

            const orders = await ordersService.getOrders(
                page,
                limit
            );

            res.status(200).json({
                success: true,
                ...orders
            });

        } catch (error) {
            next(error);
        }
    }

    async getById(req, res, next) {

        try {

            const order =
                await ordersService.getOrderById(req.params.id);

            res.status(200).json({
                success: true,
                data: order
            });

        } catch (error) {
            next(error);
        }
    }

    async create(req, res, next) {

        try {

            const order =
                await ordersService.createOrder(req.body);

            res.status(201).json({
                success: true,
                data: order
            });

        } catch (error) {
            next(error);
        }
    }

    async update(req, res, next) {

        try {

            const order =
                await ordersService.updateOrder(
                    req.params.id,
                    req.body
                );

            res.status(200).json({
                success: true,
                data: order
            });

        } catch (error) {
            next(error);
        }
    }

    async delete(req, res, next) {

        try {

            await ordersService.deleteOrder(
                req.params.id
            );

            res.status(200).json({
                success: true,
                message: "Envío eliminado correctamente"
            });

        } catch (error) {
            next(error);
        }
    }

    async tracking(req, res, next) {

        try {

            const order =
                await ordersService.addTracking(
                    req.params.id,
                    req.body
                );

            res.status(201).json({
                success: true,
                data: order
            });

        } catch (error) {
            next(error);
        }
    }

    async proof(req, res, next) {

        try {

            const order =
                await ordersService.saveProof(
                    req.params.id,
                    req.file
                );

            res.status(200).json({
                success: true,
                data: order
            });

        } catch (error) {
            next(error);
        }
    }
}

export default new OrdersController();
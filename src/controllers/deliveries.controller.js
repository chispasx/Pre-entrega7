import deliveriesService from "../services/deliveries.service.js";

class DeliveriesController {

    async getAll(req, res, next) {

        try {

            const page =
                Number(req.query.page || 1);

            const limit =
                Number(req.query.limit || 10);

            const deliveries =
                await deliveriesService.getDeliveries(
                    page,
                    limit
                );

            res.status(200).json({
                success: true,
                ...deliveries
            });

        } catch (error) {
            next(error);
        }
    }

    async getById(req, res, next) {

        try {

            const delivery =
                await deliveriesService.getById(
                    req.params.id
                );

            res.status(200).json({
                success: true,
                data: delivery
            });

        } catch (error) {
            next(error);
        }
    }

    async create(req, res, next) {

        try {

            const delivery =
                await deliveriesService.create(
                    req.body
                );

            res.status(201).json({
                success: true,
                data: delivery
            });

        } catch (error) {
            next(error);
        }
    }

    async update(req, res, next) {

        try {

            const delivery =
                await deliveriesService.update(
                    req.params.id,
                    req.body
                );

            res.status(200).json({
                success: true,
                data: delivery
            });

        } catch (error) {
            next(error);
        }
    }

    async delete(req, res, next) {

        try {

            await deliveriesService.remove(
                req.params.id
            );

            res.status(200).json({
                success: true,
                message: "Entrega eliminada correctamente"
            });

        } catch (error) {
            next(error);
        }
    }

    async proof(req, res, next) {

        try {

            const delivery =
                await deliveriesService.saveProof(
                    req.params.id,
                    req.file
                );

            res.status(200).json({
                success: true,
                data: delivery
            });

        } catch (error) {
            next(error);
        }
    }
}

export default new DeliveriesController();
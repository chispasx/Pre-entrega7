import mocksService from "../services/mocks.service.js";

class MocksController {

  getMockUsers(req, res, next) {
    try {
        const quantity =
            req.query.quantity !== undefined
                ? Number(req.query.quantity)
                : 10;

        const users = mocksService.getMockUsers(quantity);

        res.status(200).json(users);
    } catch (error) {
        next(error);
    }
}

    getMockDrivers(req, res, next) {
        try {
           const quantity =
    req.query.quantity !== undefined
        ? Number(req.query.quantity)
        : 5;

            const drivers = mocksService.getMockDrivers(quantity);

            res.status(200).json(drivers);
        } catch (error) {
            next(error);
        }
    }

    getMockOrders(req, res, next) {
        try {
           const quantity =
    req.query.quantity !== undefined
        ? Number(req.query.quantity)
        : 10;

            const orders = mocksService.getMockOrders(quantity);

            res.status(200).json(orders);
        } catch (error) {
            next(error);
        }
    }

    getMockDeliveries(req, res, next) {
        try {
           const quantity =
    req.query.quantity !== undefined
        ? Number(req.query.quantity)
        : 10;
        
            const deliveries = mocksService.getMockDeliveries(quantity);

            res.status(200).json(deliveries);
        } catch (error) {
            next(error);
        }
    }

    async populateDatabase(req, res, next) {
        try {
            const result = await mocksService.populateDatabase();

            res.status(201).json({
                message: "Datos de prueba insertados correctamente",
                result
            });
        } catch (error) {
            next(error);
        }
    }
}

export default new MocksController();
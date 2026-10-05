import productsService from "../services/products.service.js";

class ProductsController {

    async getAll(req, res, next) {
        try {
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 10;

            if (!Number.isInteger(page) || !Number.isInteger(limit) || page < 1 || limit < 1 || limit > 100) {
                return res.status(400).json({
                    success: false,
                    error: {
                        code: "VALIDATION_ERROR",
                        message: "page debe ser mayor a 0 y limit debe estar entre 1 y 100."
                    }
                });
            }

            const products = await productsService.getProducts(page, limit);
            res.status(200).json(products);
        } catch (error) {
            next(error);
        }
    }

    async getById(req, res, next) {
        try {
            const product = await productsService.getProductById(req.params.id);
            res.status(200).json(product);
        } catch (error) {
            next(error);
        }
    }

    async create(req, res, next) {
        try {
            const product = await productsService.createProduct(req.body);
            res.status(201).json(product);
        } catch (error) {
            next(error);
        }
    }

    async update(req, res, next) {
        try {
            const product = await productsService.updateProduct(req.params.id, req.body);
            res.status(200).json(product);
        } catch (error) {
            next(error);
        }
    }

    async delete(req, res, next) {
        try {
            await productsService.deleteProduct(req.params.id);
            res.status(200).json({ message: "Producto eliminado" });
        } catch (error) {
            next(error);
        }
    }
}

export default new ProductsController();

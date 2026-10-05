import Product from "../models/Product.js";
import { PRODUCT_STATUS } from "../constants/index.js";

class ProductsRepository {

    async getAll({ page = 1, limit = 10 } = {}) {
        const skip = (page - 1) * limit;
        const filter = { status: PRODUCT_STATUS.AVAILABLE };

        const [products, total] = await Promise.all([
            Product.find(filter, { __v: 0 })
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            Product.countDocuments(filter)
        ]);

        return {
            data: products,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        };
    }

    async getById(id) {
        return Product.findById(id);
    }

    async create(data) {
        return Product.create(data);
    }

    async update(id, data) {
        return Product.findByIdAndUpdate(id, data, { new: true });
    }

    async delete(id) {
        return Product.findByIdAndDelete(id);
    }
}

export default new ProductsRepository();

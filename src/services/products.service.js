import logger from "../config/logger.js";
import productsRepository from "../repositories/products.repository.js";
import CustomError from "../errors/CustomError.js";
import ErrorCodes from "../errors/ErrorCodes.js";
import { PRODUCT_STATUS } from "../constants/index.js";

class ProductsService {
  async getProducts(page=1,limit=10){return productsRepository.getAll({page,limit});}
  async getProductById(id){const p=await productsRepository.getById(id);if(!p)throw new CustomError(ErrorCodes.PRODUCT_NOT_FOUND,"Producto no encontrado",404);return p;}
  async createProduct(data){if(!data?.title||data.price===undefined)throw new CustomError(ErrorCodes.VALIDATION_ERROR,"Título y precio son obligatorios");if(Number(data.price)<=0)throw new CustomError(ErrorCodes.VALIDATION_ERROR,"El precio debe ser mayor a cero");if(data.status&&!Object.values(PRODUCT_STATUS).includes(data.status))throw new CustomError(ErrorCodes.INVALID_STATUS,"Estado de producto inválido");const p=await productsRepository.create(data);logger.info(`Producto creado: ${p._id}`);return p;}
  async updateProduct(id,data){if(data.status&&!Object.values(PRODUCT_STATUS).includes(data.status))throw new CustomError(ErrorCodes.INVALID_STATUS,"Estado de producto inválido");const p=await productsRepository.update(id,data);if(!p)throw new CustomError(ErrorCodes.PRODUCT_NOT_FOUND,"Producto no encontrado",404);return p;}
  async deleteProduct(id){const p=await productsRepository.delete(id);if(!p)throw new CustomError(ErrorCodes.PRODUCT_NOT_FOUND,"Producto no encontrado",404);return p;}
}
export default new ProductsService();

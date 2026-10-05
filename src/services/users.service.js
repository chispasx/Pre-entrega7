import mongoose from "mongoose";
import usersRepository from "../repositories/users.repository.js";
import CustomError from "../errors/CustomError.js";
import ErrorCodes from "../errors/ErrorCodes.js";
import { USER_ROLES } from "../constants/index.js";
import { DOCUMENT_TYPE_VALUES } from "../constants/documentTypes.js";
import logger from "../config/logger.js";
import { buildFileMetadata } from "../utils/fileMetadata.js";
import { removeUploadedFile } from "../config/upload.config.js";

const validateId = (id) => {
  if (!mongoose.isValidObjectId(id)) throw new CustomError(ErrorCodes.INVALID_DATA, "El ID proporcionado no es válido");
};

const validatePagination = (page, limit) => {
  if (!Number.isInteger(page) || !Number.isInteger(limit) || page < 1 || limit < 1 || limit > 100) {
    throw new CustomError(ErrorCodes.INVALID_DATA, "page debe ser mayor o igual a 1 y limit debe estar entre 1 y 100");
  }
};

class UsersService {
  async getUsers(page = 1, limit = 10) { validatePagination(page, limit); return usersRepository.getAll({ page, limit }); }
  async getById(id) {
    validateId(id);
    const user = await usersRepository.getById(id);
    if (!user) throw new CustomError(ErrorCodes.USER_NOT_FOUND);
    return user;
  }
  async createUser(data) {
    if (!data?.name || !data?.email || !data?.password) throw new CustomError(ErrorCodes.VALIDATION_ERROR, "Nombre, email y contraseña son obligatorios");
    if (data.role && !Object.values(USER_ROLES).includes(data.role)) throw new CustomError(ErrorCodes.VALIDATION_ERROR, "Rol de usuario inválido");
    return usersRepository.create({ ...data, role: data.role || USER_ROLES.USER });
  }
  async updateUser(id, data) {
    validateId(id);
    if (data.role && !Object.values(USER_ROLES).includes(data.role)) throw new CustomError(ErrorCodes.VALIDATION_ERROR, "Rol de usuario inválido");
    const user = await usersRepository.update(id, data);
    if (!user) throw new CustomError(ErrorCodes.USER_NOT_FOUND);
    return user;
  }
  async deleteUser(id) {
    validateId(id);
    const user = await usersRepository.delete(id);
    if (!user) throw new CustomError(ErrorCodes.USER_NOT_FOUND);
    return user;
  }
  async saveDocument(id, file, documentType) {
    validateId(id);
    if (!file) throw new CustomError(ErrorCodes.FILE_REQUIRED);
    if (!documentType || !DOCUMENT_TYPE_VALUES.includes(documentType)) {
      await removeUploadedFile(file.path);
      throw new CustomError(ErrorCodes.INVALID_DOCUMENT_TYPE, `Tipo de documento inválido. Valores permitidos: ${DOCUMENT_TYPE_VALUES.join(", ")}`);
    }
    const userExists = await usersRepository.getById(id);
    if (!userExists) {
      await removeUploadedFile(file.path);
      throw new CustomError(ErrorCodes.USER_NOT_FOUND);
    }
    const document = buildFileMetadata(file, documentType);
    try {
      const user = await usersRepository.saveDocument(id, document);
      if (!user) {
        await removeUploadedFile(file.path);
        throw new CustomError(ErrorCodes.USER_NOT_FOUND);
      }
      logger.info(`Carga de documento exitosa para usuario ${id}: ${document.generatedName}`);
      return user;
    } catch (error) {
      await removeUploadedFile(file.path);
      if (error instanceof CustomError) throw error;
      logger.error(`Error al guardar documento de usuario ${id}: ${error.message}`);
      throw new CustomError(ErrorCodes.FILE_SAVE_ERROR);
    }
  }
}

export default new UsersService();





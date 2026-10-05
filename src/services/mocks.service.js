import mocksRepository from "../repositories/mocks.repository.js";
import CustomError from "../errors/CustomError.js";
import ErrorCodes from "../errors/ErrorCodes.js";
import logger from "../config/logger.js";
const validate=q=>{if(!Number.isInteger(q)||q<1||q>100)throw new CustomError(ErrorCodes.INVALID_QUANTITY,"La cantidad debe ser un entero entre 1 y 100");};
class MocksService{
 getMockUsers(q=10){validate(q);return mocksRepository.generateUsers(q);}
 getMockDrivers(q=5){validate(q);return mocksRepository.generateDrivers(q);}
 getMockOrders(q=10){validate(q);return mocksRepository.generateOrders(q);}
 getMockDeliveries(q=10){validate(q);return mocksRepository.generateDeliveries(q);}
 async populateDatabase(){logger.info("Insertando datos mock en MongoDB");return mocksRepository.populateDatabase();}
}
export default new MocksService();

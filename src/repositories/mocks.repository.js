import { faker } from "@faker-js/faker";
import mongoose from "mongoose";
import User from "../models/User.js"; import Driver from "../models/Driver.js"; import Order from "../models/Order.js"; import Delivery from "../models/Delivery.js";
import { USER_ROLES, ORDER_STATUS, DELIVERY_STATUS } from "../constants/index.js";
class MocksRepository{
 generateUsers(q){return Array.from({length:q},()=>({name:faker.person.fullName(),email:faker.internet.email(),password:faker.internet.password({length:10}),role:USER_ROLES.USER}));}
 generateDrivers(q){return Array.from({length:q},()=>({name:faker.person.fullName(),email:faker.internet.email(),role:USER_ROLES.DRIVER}));}
 generateOrders(q){return Array.from({length:q},()=>({sender:faker.person.fullName(),recipient:faker.person.fullName(),origin:faker.location.city(),destination:faker.location.city(),description:faker.commerce.productDescription(),status:faker.helpers.arrayElement(Object.values(ORDER_STATUS)),tracking:[]}));}
 generateDeliveries(q){return Array.from({length:q},()=>({order:new mongoose.Types.ObjectId(),driver:new mongoose.Types.ObjectId(),status:faker.helpers.arrayElement(Object.values(DELIVERY_STATUS))}));}
 async populateDatabase(){await Promise.all([User.deleteMany({}),Driver.deleteMany({}),Order.deleteMany({}),Delivery.deleteMany({})]);const users=await User.insertMany(this.generateUsers(10));const drivers=await Driver.insertMany(this.generateDrivers(5));const orders=await Order.insertMany(this.generateOrders(10));const deliveries=[];for(let i=0;i<orders.length;i++){deliveries.push({order:orders[i]._id,driver:drivers[i%drivers.length]._id,status:DELIVERY_STATUS.ASSIGNED});}const saved=await Delivery.insertMany(deliveries);return {users:users.length,drivers:drivers.length,orders:orders.length,deliveries:saved.length};}
}
export default new MocksRepository();

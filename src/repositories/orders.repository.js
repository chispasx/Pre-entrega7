import Order from "../models/Order.js";
class OrdersRepository {
  async getAll({ page = 1, limit = 10 } = {}) { const skip=(page-1)*limit; const [data,total]=await Promise.all([Order.find().sort({createdAt:-1}).skip(skip).limit(limit).lean(),Order.countDocuments()]); return {data,pagination:{page,limit,total,totalPages:Math.ceil(total/limit)}}; }
  async getById(id){ return Order.findById(id); }
  async create(data){ return Order.create(data); }
  async update(id,data){ return Order.findByIdAndUpdate(id,data,{new:true,runValidators:true}); }
  async delete(id){ return Order.findByIdAndDelete(id); }
  async addTracking(id,event){ return Order.findByIdAndUpdate(id,{$push:{tracking:event}},{new:true,runValidators:true}); }
  async saveProof(id,proof){ return Order.findByIdAndUpdate(id,{proof},{new:true,runValidators:true}); }
}
export default new OrdersRepository();

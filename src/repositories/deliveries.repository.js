import Delivery from "../models/Delivery.js";
class DeliveriesRepository {
  async getAll({page=1,limit=10}={}){const skip=(page-1)*limit;const [data,total]=await Promise.all([Delivery.find().populate("order").populate("driver").sort({createdAt:-1}).skip(skip).limit(limit).lean(),Delivery.countDocuments()]);return {data,pagination:{page,limit,total,totalPages:Math.ceil(total/limit)}};}
  async getById(id){return Delivery.findById(id).populate("order").populate("driver");}
  async create(data){return Delivery.create(data);}
  async update(id,data){return Delivery.findByIdAndUpdate(id,data,{new:true,runValidators:true});}
  async delete(id){return Delivery.findByIdAndDelete(id);}
  async saveProof(id,proof){return Delivery.findByIdAndUpdate(id,{proof},{new:true});}
}
export default new DeliveriesRepository();

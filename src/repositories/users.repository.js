import User from "../models/User.js";
class UsersRepository {
 async getAll({page=1,limit=10}={}){const skip=(page-1)*limit;const [data,total]=await Promise.all([User.find({}, {password:0}).sort({createdAt:-1}).skip(skip).limit(limit).lean(),User.countDocuments()]);return {data,pagination:{page,limit,total,totalPages:Math.ceil(total/limit)}};}
 async getById(id){return User.findById(id,{password:0});}
 async create(data){const created=await User.create(data);return User.findById(created._id,{password:0}).lean();}
 async update(id,data){return User.findByIdAndUpdate(id,data,{new:true,runValidators:true,projection:{password:0}});}
 async delete(id){return User.findByIdAndDelete(id);}
 async saveDocument(id,document){return User.findByIdAndUpdate(id,{document},{new:true,projection:{password:0}});}
}
export default new UsersRepository();

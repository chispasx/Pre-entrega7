import usersService from "../services/users.service.js";

class UsersController {
  async getAll(req,res,next){try{const users=await usersService.getUsers(Number(req.query.page||1),Number(req.query.limit||10));res.status(200).json({success:true,...users});}catch(e){next(e);}}
  async getById(req,res,next){try{res.status(200).json({success:true,data:await usersService.getById(req.params.id)});}catch(e){next(e);}}
  async create(req,res,next){try{res.status(201).json({success:true,data:await usersService.createUser(req.body)});}catch(e){next(e);}}
  async update(req,res,next){try{res.status(200).json({success:true,data:await usersService.updateUser(req.params.id,req.body)});}catch(e){next(e);}}
  async delete(req,res,next){try{await usersService.deleteUser(req.params.id);res.status(200).json({success:true,message:"Usuario eliminado correctamente"});}catch(e){next(e);}}
  async document(req,res,next){try{const user=await usersService.saveDocument(req.params.id,req.file,req.body.documentType);res.status(200).json({success:true,data:user,message:"Documento cargado correctamente"});}catch(e){next(e);}}
}
export default new UsersController();

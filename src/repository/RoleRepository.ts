import { AppDataSource } from "../config/data-source";
import { Role } from "../entity/Role";
import { injectable } from "inversify";

@injectable()
export class RoleRepository{
    private roleRepository = AppDataSource.getRepository(Role);

    async findAll(){
        return await this.roleRepository.find();
    }
    
    async findById(id: number){
        return await this.roleRepository.findOne({where: {id: id}});
    }
    
}
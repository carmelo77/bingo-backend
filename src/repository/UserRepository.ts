import { IUserModel } from "../types";
import { AppDataSource } from "../config/data-source";
import { User } from "../entity/User";
import { injectable } from "inversify";

@injectable()
export class UserRepository{
    private userRepository = AppDataSource.getRepository(User);
    
    async findAll(){
        return await this.userRepository.find();
    }
    async findByEmail(email: string){
        return await this.userRepository.findOne({where: {email: email}});
    }
    async findById(id: number){
        return await this.userRepository.findOne({where: {id: id}});
    }
    async create(data: IUserModel){
        return await this.userRepository.save(data);
    }
    async update(id: number, data: IUserModel){
        const userToUpdate = await this.userRepository.findOne({where: {id: id}})
        return this.userRepository.save({...userToUpdate, ...data});
    }
    async remove(id: number){
        const userToRemove = await this.userRepository.findOne({where: {id: id}});
        await this.userRepository.remove(userToRemove);
        return userToRemove;
    }
    
}
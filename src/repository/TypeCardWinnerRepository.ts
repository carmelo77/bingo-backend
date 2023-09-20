import { ITypeCardWinnerModel } from "../types";
import { AppDataSource } from "../config/data-source";
import { TypeCardWinner } from "../entity/TypeCardWinner";
import { injectable } from "inversify";

@injectable()
export class TypeCardWinnerRepository{
    private typecardRepository = AppDataSource.getRepository(TypeCardWinner);
    
    async findAll(){
        return await this.typecardRepository.find({
            order: {
                id: 'ASC'
            }
        });
    }
    async findById(id: number){
        return await this.typecardRepository.findOne({where: {id: id}});
    }
    async findByDefault(){
        return await this.typecardRepository.findOne({where: {default: true}});
    }
    async activate(id: number){
        await this.typecardRepository.update({}, { default: false });

        const dataToUpdate = await this.typecardRepository.findOne({where: {id: id}})
        dataToUpdate.default = true;
        return this.typecardRepository.save(dataToUpdate);
    }
    async create(data: ITypeCardWinnerModel){
        return await this.typecardRepository.save(data);
    }
    async update(id: number, data: ITypeCardWinnerModel){
        const dataToUpdate = await this.typecardRepository.findOne({where: {id: id}})
        return this.typecardRepository.save({...dataToUpdate, ...data});
    }
    async remove(id: number){
        const dataToRemove = await this.typecardRepository.findOne({where: {id: id}});
        await this.typecardRepository.remove(dataToRemove);
        return dataToRemove;
    }
    
}
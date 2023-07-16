import { AppDataSource } from "../config/data-source";
import { IBingoNumberModel } from "../types";
import { BingoNumber } from "../entity/BingoNumber";
import { injectable } from "inversify";
import { FindOneOptions, FindManyOptions } from "typeorm";

@injectable()
export class BingoNumberRepository{
    private bingoNumberRepository = AppDataSource.getRepository(BingoNumber);
    
    async create(data: IBingoNumberModel){
        return await this.bingoNumberRepository.save(data);
    }

    async isBingoNumberFound(number: number) {
        const options: FindOneOptions<BingoNumber> = {
            where: {  number: number }
          };
        return await this.bingoNumberRepository.findOne(options);
    }

    async update(id: number, data: IBingoNumberModel){
        const dataToUpdate = await this.bingoNumberRepository.findOne({where: {id: id}})
        return this.bingoNumberRepository.save({...dataToUpdate, ...data});
    }

    async getNumbers(){
        return await this.bingoNumberRepository.find();
    }

    async clearNumbersFromMatch() {
        const result = await this.bingoNumberRepository
        .createQueryBuilder()
        .delete()
        .from(BingoNumber)
        .execute();

        // Restablece la secuencia de la columna de identidad a 1
        await this.bingoNumberRepository.query('ALTER SEQUENCE bingo_number_id_seq RESTART WITH 1');
        
        return result;
    }
    
}
import { IBingoCardModel } from "../types";
import { AppDataSource } from "../config/data-source";
import { BingoCard } from "../entity/BingoCard";
import { injectable } from "inversify";

@injectable()
export class BingoCardRepository{
    private bingocardRepository = AppDataSource.getRepository(BingoCard);
    
    async findAll(): Promise<BingoCard[]>{
        return await this.bingocardRepository.find({
            order: {
                number_table: 'ASC'
            }
        });
    }
    async findById(id: number): Promise<BingoCard | null>{
        return await this.bingocardRepository.findOne({where: {id: id}});
    }
    async findByNumberCard(number_card: number){
        return await this.bingocardRepository.findOne({where: {number_table: number_card}});
    }
    async create(data: IBingoCardModel): Promise<BingoCard>{
        return await this.bingocardRepository.save(data);
    }
    async update(id: number, data: IBingoCardModel): Promise<BingoCard>{
        const dataToUpdate = await this.bingocardRepository.findOne({where: {id: id}})
        return this.bingocardRepository.save({...dataToUpdate, ...data});
    }
    async remove(id: number): Promise<Boolean>{
        // const dataToRemove = await this.bingocardRepository.findOne({where: {id: id}});
        // await this.bingocardRepository.remove(dataToRemove);
        const result = await this.bingocardRepository.delete(id);
        return result.affected == 1;
    }

    async winnerReview(numbers_card: number[], typeCard: number = 1): Promise<{ bingo_card_id: number }[]> {
        const bingo_cards = await this.bingocardRepository.find(); //Tomamos todos los cartones.
        let winners = []; //Establecemos una variable de ganadores vacía.

        if(numbers_card.length < 24) {
            return winners;
        }

        for (const card of bingo_cards) { //Recorremos todos los cartones que tenemos uno por uno.
            const values_card = card.values; //Tomamos especificamente el campo de los numeros de los cartones.
            
            if(typeCard == 1) { //Si el tipo de carton es igual a 1, es decir, cartón lleno.
                // const fill_card_exist = numbers_card.every(num => values_card[num] != null); //Verificamos que carton lleno exista.
                const fill_card_exist = values_card.every(num => numbers_card.includes(num));

                if(fill_card_exist && !card.isSkip) { // Si existe cartón lleno.
                    winners.push({ bingo_card_id: card.number_table }); // Colocamos la partida y id del carton que ganó.
                }
            }
        }

        return winners; // Y lo retornamos.
    }

    async isSkipTrue(number_table: number): Promise<void>{
        await this.bingocardRepository.update({ number_table }, { isSkip: true });
    }

    async isSkipFalse(): Promise<void>{
        await this.bingocardRepository.update({}, { isSkip: false });
    }
    
}
import { TYPES } from "../types/";
import * as express from 'express';
import { controller, httpGet, httpPost, request, response, queryParam, httpPut, httpDelete } from "inversify-express-utils";
import { BingoNumberRepository } from "../repository/BingoNumberRepository";
import { BingoCardRepository } from "../repository/BingoCardRepository";
import { inject } from "inversify";

@controller("/bingo-number")

export class BingoNumberController {

    private bingoNumberRepo: BingoNumberRepository;
    private bingocardRepo: BingoCardRepository;

    constructor(
        @inject(TYPES.BingoNumberRepository) bingoNumberRepo: BingoNumberRepository,
        @inject(TYPES.BingoCardRepository) bingocardRepo: BingoCardRepository) {
        this.bingoNumberRepo = bingoNumberRepo;
        this.bingocardRepo = bingocardRepo;
    }

    @httpGet("/availables", TYPES.AuthMiddleware)
    public async listOne(@request() req: express.Request, @response() res: express.response) {
        try {
            const data = await this.bingoNumberRepo.getNumbers();
            res.status(200).send(data);
        }
        catch (err) {
            res.status(400).json(err);
        }
    }

    @httpGet("/reset-match", TYPES.AuthMiddleware)
    public async resetMatch(@request() req: express.Request, @response() res: express.response) {
        try {
            const data = await this.bingoNumberRepo.clearNumbersFromMatch();
            await this.bingocardRepo.isSkipFalse();
            res.status(200).send(data);
        }
        catch (err) {
            res.status(400).json(err);
        }
    }


    @httpPost("/", TYPES.AuthMiddleware)
    public async create(@request() req: express.Request, @response() res: express.response) {
        try {
            const { bingo_number } = req.body;

            const foundNumber = await this.bingoNumberRepo.isBingoNumberFound( bingo_number );

            if(foundNumber) {
                return res.status(400).send({
                    message: 'Este número ya salió anteriormente para esta partida.'
                })
            }

            const result = await this.bingoNumberRepo.create({ 
                number: bingo_number,
            });

            const bingoNumbers = await this.bingoNumberRepo.getNumbers();

            const numbers_card = bingoNumbers.map(item => item.number);
            const winners = await this.bingocardRepo.winnerReview(numbers_card);

            if(winners.length == 0) {
                res.status(200).send({
                    success: false,
                    message: 'Aún no hay ganadores.'
                })
            } else {

                const tablesWinners = [];

                for (const winner of winners) {
                    tablesWinners.push(winner.bingo_card_id);
                    await this.bingocardRepo.isSkipTrue(winner.bingo_card_id);
                }

                res.status(200).send({
                    success: true,
                    message: `Los cartones con número: ${tablesWinners.join(', ')} han resultado ganadores!`
                })
            }
        } catch (err) {
            console.log(err);
            res.status(500).send(err);
        }
    }

    @httpPut("/update/:id", TYPES.AuthAdminMiddleware)
    public async update(@request() req: express.Request, @response() res: express.response) {
        try {
            const { id } = req.params;
            const { bingo_number, match_id } = req.body;

            const foundNumber = await this.bingoNumberRepo.isBingoNumberFound( bingo_number );

            if(foundNumber) {
                return res.status(400).send({
                    message: 'Este número ya salió anteriormente para esta partida.'
                })
            }

            const result = await this.bingoNumberRepo.update(id, { 
                number: bingo_number,
            });

            const bingoNumbers = await this.bingoNumberRepo.getNumbers();

            const numbers_card = bingoNumbers.map(item => item.number);
            const winners = await this.bingocardRepo.winnerReview(numbers_card, match_id);

            if(winners.length == 0) {
                res.status(200).send({
                    success: false,
                    message: 'Aún no hay ganadores.'
                })
            } else {

                const tablesWinners = [];

                for (const winner of winners) {
                    // const bingoc = await this.bingocardRepo.findById( winner.bingo_card_id );
                    tablesWinners.push(winner.bingo_card_id);
                    await this.bingocardRepo.isSkipTrue(winner.bingo_card_id);
                }

                res.status(200).send({
                    success: true,
                    message: `Los cartones ${tablesWinners.join(', ')} han resultado ganadores!`
                })
            }
        } catch (err) {
            console.log(err);
            res.status(500).send(err);
        }
    }

}
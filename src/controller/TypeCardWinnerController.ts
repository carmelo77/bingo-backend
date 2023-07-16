import { TYPES } from "../types/";
import * as express from 'express';
import { controller, httpGet, httpPost, request, response, queryParam, httpPut, httpDelete } from "inversify-express-utils";
import { TypeCardWinnerRepository } from "../repository/TypeCardWinnerRepository";
import { inject } from "inversify";

@controller("/type-card-winner")

export class TypeCardWinnerController {

    private typeCardWinnerRepository: TypeCardWinnerRepository;

    constructor(
        @inject(TYPES.TypeCardWinnerRepository) typeCardWinnerRepository: TypeCardWinnerRepository) {
        this.typeCardWinnerRepository = typeCardWinnerRepository;
    }

    @httpGet("/data",TYPES.AuthAdminMiddleware)
    public async index(@request() req: express.Request, @response() res: express.response) {
        try {
            const data = await this.typeCardWinnerRepository.findAll();
            res.status(200).json(data);
        }
        catch (err) {
            res.status(500).json(err);
        }
    }

    @httpGet("/one", TYPES.AuthAdminMiddleware)
    public async listOne(@queryParam("id") id: number, @response() res: express.response) {
        try {
            const data = await this.typeCardWinnerRepository.findById(id);
            res.status(200).send(data);
        }
        catch (err) {
            res.status(400).json(err);
        }
    }

    @httpPost("/", TYPES.AuthAdminMiddleware)
    public async create(@request() req: express.Request, @response() res: express.response) {
        try {
            const { name } = req.body;

            const result = await this.typeCardWinnerRepository.create({ 
                name, 
            });
            res.status(200).send(result)
        } catch (err) {
            console.log(err);
            res.status(500).send(err);
        }
    }

    @httpPut("/update/:id", TYPES.AuthAdminMiddleware)
    public async update(@request() req: express.Request, @response() res: express.response) {
        try {
            const { id } = req.params;
            const { name } = req.body;


            const result = await this.typeCardWinnerRepository.update(id, {
                name, 
            });

            res.status(200).send(result)
        } catch (err) {
            res.status(500).send(err);
        }
    }

    @httpDelete("/:id", TYPES.AuthAdminMiddleware)
    public async remove(@request() req: express.Request, @response() res: express.response) {
        try {
            const { id } = req.params;
            const result = await this.typeCardWinnerRepository.remove(id);

            res.status(200).send(result);
        } catch (err) {
            res.status(500).send(err);
        }
    }

}
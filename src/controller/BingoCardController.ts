import { TYPES } from "../types/";
import * as express from 'express';
import * as multer from 'multer';
import * as XLSX from 'xlsx';
import { controller, httpGet, httpPost, request, response, queryParam, httpPut, httpDelete } from "inversify-express-utils";
import { BingoCardRepository } from "../repository/BingoCardRepository";
import { inject } from "inversify";

const upload = multer().single('file');

@controller("/bingo-cards")

export class BingoCardController {

    private bingoCardRepo: BingoCardRepository;

    constructor(
        @inject(TYPES.BingoCardRepository) bingoCardRepo: BingoCardRepository) {
        this.bingoCardRepo = bingoCardRepo;
    }

    @httpGet("/data", TYPES.AuthMiddleware)
    public async index(@request() req: express.Request, @response() res: express.response) {
        try {
            const data = await this.bingoCardRepo.findAll();
            res.status(200).json(data);
        }
        catch (err) {
            res.status(500).json(err);
        }
    }

    @httpGet("/one", TYPES.AuthMiddleware)
    public async listOne(@queryParam("id") id: number, @response() res: express.response) {
        try {
            const data = await this.bingoCardRepo.findById(id);
            res.status(200).send(data);
        }
        catch (err) {
            res.status(400).json(err);
        }
    }

    @httpGet("/number-table", TYPES.AuthMiddleware)
    public async listOneNumberTable(@queryParam("number_card") number_card: number, @response() res: express.response) {
        try {
            const data = await this.bingoCardRepo.findByNumberCard(number_card);
            res.status(200).send(data);
        }
        catch (err) {
            res.status(400).json(err);
        }
    }

    @httpPost("/", TYPES.AuthAdminMiddleware)
    public async create(@request() req: express.Request, @response() res: express.response) {
        try {
            const { number_table, values } = req.body;

            const find = await this.bingoCardRepo.findByNumberCard(number_table);

            if (find) {
                return res.status(400).send({
                    message: 'Este número de cartón ya existe, usa otro o elimina el anterior.'
                })
            }

            const result = await this.bingoCardRepo.create({
                number_table,
                values,
                isSkip: false,
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
            const { number_table, values } = req.body;


            const result = await this.bingoCardRepo.update(id, {
                number_table,
                values,
                isSkip: false
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
            const result = await this.bingoCardRepo.remove(id);

            res.status(200).send(result);
        } catch (err) {
            res.status(500).send(err);
        }
    }

    @httpPost("/upload", TYPES.AuthAdminMiddleware)
public async upload(@request() req: express.Request, @response() res: express.response) {
    try {
        // Verificar si se ha subido un archivo

        const fileUploadPromise = new Promise<void>((resolve, reject) => {
            upload(req, res, (err) => {
                if (err) {
                    console.error(err);
                    reject(err);
                }

                if (!req.file) {
                    reject(new Error('No se ha proporcionado ningún archivo'));
                }

                const fileBuffer = req.file.buffer;

                // Leer el archivo Excel desde el buffer
                const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
                const worksheet = workbook.Sheets[workbook.SheetNames[0]];

                // Recorrer cada celda del archivo Excel en orden horizontal
                const range = XLSX.utils.decode_range(worksheet['!ref']);
                const firstElements = [];
                const restElements = [];
                for (let row = range.s.r + 1; row <= range.e.r; row++) {
                    const firstCellAddress = XLSX.utils.encode_cell({ r: row, c: range.s.c });
                    const firstCellValue = worksheet[firstCellAddress]?.v;
                    firstElements.push(firstCellValue);
                    const rowData = [];
                    for (let col = range.s.c + 1; col <= range.e.c - 1; col++) {
                        const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
                        const cellValue = worksheet[cellAddress]?.v;
                        rowData.push(cellValue);
                    }
                    restElements.push(rowData);
                }

                // Imprimir los datos en el formato solicitado
                const processData = async (): Promise<void> => {
                    for (let i = 0; i < firstElements.length; i++) {
                        const firstElement = firstElements[i];
                        const restData = restElements[i].join(', ');
                        console.log(`${firstElement}: restantes: [${restData}]`);

                        const find = await this.bingoCardRepo.findByNumberCard(firstElement);

                        if (find) {
                            continue;
                        }

                        const values = restData.split(',').map(value => Number(value));

                        await this.bingoCardRepo.create({
                            number_table: firstElement,
                            values,
                            isSkip: false
                        });
                    }
                };

                processData()
                    .then(() => resolve())
                    .catch((err) => reject(err));
            });
        });

        await fileUploadPromise; // Esperar a que se complete la carga de archivos

        res.status(200).send('Excel procesado correctamente');
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
}



}
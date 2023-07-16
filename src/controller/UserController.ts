import { TYPES } from "../types/";
import * as express from 'express';
import { controller, httpGet, httpPost, request, response, queryParam, httpPut, httpDelete } from "inversify-express-utils";
import { UserRepository } from "../repository/UserRepository";
import { RoleRepository } from "../repository/RoleRepository";
import * as bcrypt from 'bcrypt';
import { inject } from "inversify";
import * as jwt from 'jsonwebtoken';

@controller("/users")

export class UserController {

    private userRepo: UserRepository;
    private roleRepo: RoleRepository

    constructor(
        @inject(TYPES.UserRepository) userRepo: UserRepository,
        @inject(TYPES.RoleRepository) roleRepo: RoleRepository) {
        this.userRepo = userRepo;
        this.roleRepo = roleRepo;
    }

    @httpGet("/data",TYPES.AuthMiddleware)
    public async index(@request() req: express.Request, @response() res: express.response) {
        try {
            const users = await this.userRepo.findAll();
            res.status(200).json(users);
        }
        catch (err) {
            res.status(500).json(err);
        }
    }

    @httpGet("/roles",TYPES.AuthMiddleware)
    public async getRoles(@request() req: express.Request, @response() res: express.response) {
        try {
            const roles = await this.roleRepo.findAll();
            res.status(200).json(roles);
        }
        catch (err) {
            res.status(500).json(err);
        }
    }

    @httpGet("/one", TYPES.AuthMiddleware)
    public async listOne(@queryParam("id") id: number, @response() res: express.response) {
        try {
            const data = await this.userRepo.findById(id);
            res.status(200).send(data);
        }
        catch (err) {
            res.status(400).json(err);
        }
    }

    @httpPost("/", TYPES.AuthAdminMiddleware)
    public async create(@request() req: express.Request, @response() res: express.response) {
        try {
            const { name, lastname, email, phone, document, role_id } = req.body;
            let { password } = req.body;
            password = await bcrypt.hash(password, 10);

            const result = await this.userRepo.create({ 
                name, 
                lastname, 
                email, 
                phone, 
                password,
                document
            });
            result.role = await this.roleRepo.findById(role_id);

            await this.userRepo.update(result.id, result);
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
            const { name, lastname, email, phone, role_id, document } = req.body;
            let { password } = req.body;

            
            const result = await this.userRepo.update(id, {
                name, 
                lastname, 
                email, 
                phone, 
                // password,
                document
            });

            if(password != '') {
                password = await bcrypt.hash(password, 10);
                result.password = password;
            }
            
            result.role = await this.roleRepo.findById(role_id);
            console.log(result)
            await this.userRepo.update(id, result);

            res.status(200).send(result)
        } catch (err) {
            res.status(500).send(err);
        }
    }

    @httpDelete("/:id", TYPES.AuthAdminMiddleware)
    public async remove(@request() req: express.Request, @response() res: express.response) {
        try {
            const { id } = req.params;
            const result = await this.userRepo.remove(id);

            res.status(200).send(result);
        } catch (err) {
            res.status(500).send(err);
        }
    }


    @httpPost("/login")
    public async performLogin(@request() req: express.Request, @response() res: express.response) {
        try {
            const { email, password } = req.body;
            const user = await this.userRepo.findByEmail(email);
            if (!user) {
                return res.status(400).send({ error: true, message: "Email not found" });
            }
            const checkPassword = await bcrypt.compare(password, user.password);

            if (!checkPassword) {
                return res.status(400).send({ error: true, message: "Invalid email or Incorrect password" });
            }

            delete user.password;

            const token = jwt.sign({
                id: user.id,
                email: user.email,
                role: user.role.id
            }, process.env.TOKEN_KEY, {expiresIn: '24h'});

            return res.status(200).send({
                error:false,
                ...user,
                token
            });

        } catch (err) {
            console.log(err)
            res.status(500).send(err);
        }
    }


}
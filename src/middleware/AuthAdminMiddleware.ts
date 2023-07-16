import { BaseMiddleware } from "inversify-express-utils";
import { injectable } from "inversify";
import * as express from "express";
import * as jwt from "jsonwebtoken";
import jwt_decode from "jwt-decode";

@injectable()
export class AuthAdminMiddleware extends BaseMiddleware {

    public async handler(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        try {
            const token = req.headers["authorization"];
            const checkToken = jwt.verify(token, process.env.TOKEN_KEY);

            if (checkToken) {
                const decode: any = jwt_decode(token);
                
                const user = {
                    email: decode.email,
                    userID: decode.id,
                    role: decode.role,
                }

                req.user = user;

                if (decode.role == 2) {
                    return next()
                }
                else {
                    res.status(401).send({ error: true, message: "You dont have permissions for this action" });
                }

            }
            else {
                return res.status(401).send({ error: true, message: "the token does not exist" });
            }


        }
        catch (err) {
            console.log(err);
            res.status(401).send(err);
        }

    }
}
import "reflect-metadata"
import { DataSource } from "typeorm"
import { User } from "../entity/User"
import { Role } from "../entity/Role"
import { BingoCard } from "../entity/BingoCard"
import { BingoNumber } from "../entity/BingoNumber"
import { TypeCardWinner } from "../entity/TypeCardWinner"

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOSTNAME,
    port: 5432,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: true,
    logging: false,
    entities: [
        User,
        Role,
        BingoCard,
        BingoNumber,
        TypeCardWinner
    ],
    migrations: [],
    subscribers: [],
})

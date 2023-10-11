import 'dotenv/config';
import { AppDataSource } from "./config/data-source";
import { InversifyExpressServer } from 'inversify-express-utils';
import app from './app';
import container from './config/inversify.config';

//Controllers
import  './controller/UserController';
import './controller/TypeCardWinnerController';
import './controller/BingoCardController';
import './controller/BingoNumberController';
import { Server } from "socket.io";



AppDataSource.initialize().then(async () => {

    const staticPort = 3050;
    const port = process.env.PORT || staticPort;
    app.set('port', port);

    const server =  new InversifyExpressServer(container, null, { rootPath: "/" }, app);

    const appConfigured = server.build();
    const serve = appConfigured.listen(port, () => console.log(`App running on`, serve.address()));


    // const io = new Server(serve);
    const io = new Server(serve, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    });
    io.on("connection", (socket) => {
        socket.on("NewBingoNumberByMatch", ({ number, typeCard }) => {
            // console.log(`Nuevo número de bingo: ${number} para la partida ${matchId}`);
            // Emitir el número de bingo a todos los clientes conectados
            io.emit("NewBingoNumberByMatch", { number, typeCard });
        });

        socket.on("deleteWrongNumber", ( number ) => {
            io.emit("deleteWrongNumber", { number: number });
        });

        socket.on("resetAll", () => {
            io.emit("resetAll");
        });

        socket.on("BingoNumberWin", ({ number }) => {
            // Emitir el número de bingo cuando se detecte cartones ganadores.
            io.emit("BingoNumberWin", { number });
        });
    });

}).catch(error => console.log(error))

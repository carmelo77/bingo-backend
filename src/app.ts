import * as express from "express";
import * as bodyParser from "body-parser";
import * as cors from 'cors';
import * as os from "os";

// create express app
const app = express()

const port = process.env.PORT || 3050;

// Configuración de CORS
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(bodyParser.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }))

//.. further setup 

export default app;

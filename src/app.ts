import * as express from "express";
import * as bodyParser from "body-parser";
import * as cors from 'cors';

// create express app
const app = express()

const staticPort = 3050;
const port = process.env.PORT || staticPort;
console.log({port});

app.use(bodyParser.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }))

//.. further setup 

export default app;

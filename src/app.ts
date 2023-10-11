import * as express from "express";
import * as bodyParser from "body-parser";
import * as cors from 'cors';
import * as os from "os";

// create express app
const app = express()

const staticPort = 3050;
const port = process.env.PORT || staticPort;
const serverIP = Object.values(os.networkInterfaces())
  .map((interfaces: any) =>
    interfaces.find(
      (iface) => iface.family === "IPv4" && !iface.internal
    )
  )
  .find((iface) => iface !== undefined)?.address;

console.log("Server IP:", serverIP);
console.log({port});

app.use(bodyParser.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }))

//.. further setup 

export default app;

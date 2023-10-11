import * as express from "express";
import * as bodyParser from "body-parser";
import * as cors from 'cors';
import * as os from "os";

// create express app
const app = express()


// Configuración de CORS
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

const serverIP = Object.values(os.networkInterfaces())
  .map((interfaces: any) =>
    interfaces.find(
      (iface) => iface.family === "IPv4" && !iface.internal
    )
  )
  .find((iface) => iface !== undefined)?.address;


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

console.log("Server IP:", serverIP);

app.use(bodyParser.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }))

//.. further setup 

export default app;

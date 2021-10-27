import { Request, Response } from "express";

require("dotenv").config();

const exec = require("child_process").exec;
const express = require("express");
const bodyParser = require("body-parser")
const app = express();
const { indexImageRouter } = require("./routes/images/index");
const { indexContainerRouter } = require("./routes/containers");
const cors = require("cors");
const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://afif:Wu7DZ4PG8rBEJHZ7@image-service.kp4h6.mongodb.net", {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useFindAndModify: false,
});

app.use(cors());
app.use(bodyParser.json());
app.use("/api/images", indexImageRouter)
app.use("/api/container", indexContainerRouter)
app.get("/ping", (req: Request, res: Response) => res.end("Hello from ec2"));

let port = 3001

interface DataI {
  port: number;
  password: string;
  username: string;
  containerName: string;
  baseImage: string;
}

function run(data: DataI) {
  return new Promise((resolve, reject) => {
    exec(`docker run -d -p ${data.port}:4200 -e SIAB_PASSWORD=${data.password} -e SIAB_SUDO=true -e  SIAB_SSL=false -e  SIAB_GROUP=${data.username} --name ${data.containerName} sspreitzer/shellinabox:${data.baseImage}`, (error: Error, stdout: Buffer, stderr: Buffer) => {
      if (error) return reject(error);
      if (stderr) return reject(stderr);
      if (stdout) {
        console.log(stdout);
        resolve(stdout);
      }
    });
  });
}

app.post("/", (req: Request, res: Response) => {
  port = port+1;
  const data = {...req.body, port};
  run(data).then((result) => {
    res.json({
      id: result,
      ip: "3.89.213.136",
      port
    }).end();
  }).catch(err => {
    res.status(500)
  });
})

app.listen(3000, () => console.log("Listening on 3000"));
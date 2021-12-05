import { json } from "body-parser";
import { docker } from "../../utils/dockersock";
import express, { Request, Response } from "express";
import Dockerode from "dockerode";
import Container from "../../models/container";
import path from 'path'

const router = express.Router();
router.use(json());


let port = 3001;

router.post("/create", async (req: Request, res: Response) => {
	const { containerName, password } = req.body;
	port = 3001 + Math.floor(Math.random() * 100);

  var PortBindings: Dockerode.PortMap = {
		"4200/tcp": [
			{
				HostPort: `${port}`
			}
		]
	}

  const buildargs = {
    PASSWORD: password
  }
  
  docker.buildImage(path.join(__dirname, "../../lib/Docker/Dockerfile"), { buildargs }, (error, result) => {
    if (!error) {
      console.log(result);
      res.end();
    } else {
      console.log(error);
      res.status(500);
      res.json({
        error
      });
      res.end();
    }
  })
})

export { router as createContainerRouter };
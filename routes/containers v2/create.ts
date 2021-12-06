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
	const { imageName, containerName, password, userId } = req.body;
  const t = imageName + String(Math.floor(Math.random() * 10 ** 10))
  
	port = 3001 + Math.floor(Math.random() * 100);

  var PortBindings: Dockerode.PortMap = {
		"4217/tcp": [
			{
				HostPort: `${port}`
			}
		]
	}

  const buildargs = {
    PASSWORD: password
  }
  
  let success =  await docker.buildImage({
    context: path.join(__dirname, "../../lib/Docker"),
    src: ['Dockerfile', 'shellinabox']
  }, { buildargs, t }).then(() => {
    return true;
  }).catch(err => {
    // console.log(err);
    return false;
  });

  if (!success) {
    res.status(500);
    res.json({
      message: "Failed while building image."
    });
    return res.end();
  }

  docker.createContainer({
    Image: t,
    name: containerName,
    HostConfig: { PortBindings },
		Tty: true
  }, (err: Error, container) => {
    if (!err) {
			container?.start({}, async (err) => {
				if (!err) {
					await Container.create({
						containerId: container.id,
						baseImage: t,
						origin: "raw",
						state: "Running",
						userId
					}).catch(console.error);
					res.setHeader("Access-Control-Allow-Origin", "*");
					res.json({
						ip: process.env.HOST_IP,
						port
					}).end();
				} else {
					console.error(err);
					res.status(500)
					res.json({
						err: err
					}).end();
				}
			});
		} else {
			console.error(err)
			res.status(500)
			res.json({
				err: err
			}).end();
		}
  })

})

export { router as createContainerRouter };
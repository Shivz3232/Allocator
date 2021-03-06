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
	const { baseImage, containerName, password, userId } = req.body;
  const t = baseImage + String(Math.floor(Math.random() * 10 ** 10))
  
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
  
  let stream =  await docker.buildImage({
    context: path.join(__dirname, "../../lib/Docker"),
    src: ['Dockerfile', 'shellinabox', 'config.yaml', 'settings.json']
  }, { buildargs, t });
	// then(() => {
  //   return true;
  // }).catch(err => {
  //   // console.log(err);
  //   return false;
  // });

	const success = await new Promise((resolve, reject) => {
		stream.on("end", () => { resolve(1) });
		stream.on("data", (data) => { console.log(String(data)) })
	}).then(() => {
		return true;
	})
	.catch(err => {
		console.log(err);
		return false;
	})

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
            containerName,
						baseImage,
						origin: "raw",
						state: "Running",
            shellinaBoxPort: port,
            shellinaBoxPassword: password,
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
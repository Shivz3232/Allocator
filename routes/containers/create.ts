import { json } from "body-parser";
import { docker } from "../../utils/dockersock";
import express, { Request, Response } from "express";
import Dockerode, { ContainerInfo } from "dockerode";

const router = express.Router();

let port = 3001

router.use(json());
router.post("/create", async (req: Request, res: Response) => {
	const { baseImage, imageTag, containerName } = req.body;
	console.log(baseImage, imageTag, containerName);
	//tty:true
	var auxContainer;
	port = port+1;
	var PortBindings: Dockerode.PortMap = {
		"4200/tcp": [
			{
				HostPort: `${port}`
			}
		]
	}

	docker.createContainer({Image: `sspreitzer/shellinabox:${baseImage}`, name: containerName, HostConfig: { PortBindings }}, (err: Error, container) => {
		if (!err) {
			container?.start((err, data) => {
				if (!err) {
					res.json({
						id: data.id,
						ip: "54.210.61.73",
						port
					}).end()
				} else {
					console.error(err);
					res.status(500)
					res.json({
						err: err
					}).end();
				}
			})
		} else {
			console.error(err)
			res.status(500)
			res.json({
				err: err
			}).end();
		}
	})
	// docker.pull("ubuntu:18.04", (err: any, stream: any) => {
	// 	stream.pipe(process.stdout);
	// });
	// docker.createContainer(
	// 	{
	// 		Image: "ubuntu:18.04",
	// 		Cmd: ["/bin/bash"],
	// 		name: containerName,
	// 		Tty: true,
	// 	},
	// 	(err, container) => {
	// 		if (err) {
	// 			console.log(err);
	// 		}
	// 		container?.start((err, data) => {
	// 			if (err) {
	// 				console.log(err);
	// 			}
	// 			console.log({ data });
	// 		});
	// 	}
	// );
});

export { router as createContainerRouter };

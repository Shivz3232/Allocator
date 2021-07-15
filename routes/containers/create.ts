import { json } from "body-parser";
import { docker } from "../../utils/dockersock";
import express, { Request, Response } from "express";
import Dockerode from "dockerode";

const router = express.Router();

let port = 3001;

router.use(json());
router.post("/create", async (req: Request, res: Response) => {
	const { baseImage, containerName, password, username } = req.body;
	port = port+1;
	var PortBindings: Dockerode.PortMap = {
		"4200/tcp": [
			{
				HostPort: `${port}`
			}
		]
	}

	docker.createContainer({Image: `sspreitzer/shellinabox:${baseImage}`, name: containerName, HostConfig: { PortBindings }, Env: ["SIAB_SSL=false", `SIAB_PASSWORD=${password}`, `SIAB_USER=${username}`, `SIAB_SUDO=true`]}, (err: Error, container) => {
		if (!err) {
			container?.start((err, data) => {
				if (!err) {
					res.json({
						id: data.id,
						ip: "54.210.61.73",
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
	});
});

export { router as createContainerRouter };

import { json } from "body-parser";
import { docker } from "../../utils/dockersock";
import express, { Request, Response } from "express";
import { ContainerInfo } from "dockerode";

const router = express.Router();

router.use(json());
router.get("/api/images/all", async (req: Request, res: Response) => {
	docker.listContainers({ all: true }).then((result) => {
		res.send(result);
	});
});

export { router as indexImageRouter };

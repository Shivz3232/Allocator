import { json } from "body-parser";
import { docker } from "../../utils/dockersock";
import express, { Request, Response } from "express";
import { createContainerRouter } from "./create";
import { saveContainerRouter } from "./save";

const router = express.Router();

router.use(json());
router.use(createContainerRouter);
router.use(saveContainerRouter);

export { router as indexContainerRouter };

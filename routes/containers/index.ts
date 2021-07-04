import { json } from "body-parser";
import { docker } from "../../utils/dockersock";
import express, { Request, Response } from "express";
import { createContainerRouter } from "./create";

const router = express.Router();

router.use(json());
router.use(createContainerRouter);

export { router as indexContainerRouter };

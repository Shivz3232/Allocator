import { json } from "body-parser";
import express, { Request, Response } from "express";
import { createContainerRouter } from "./create";
import { commitContainerRouter } from "./commit";
import { stopContainerRouter } from "./stop";

const router = express.Router();

router.use(json());
router.use(createContainerRouter);
router.use(commitContainerRouter);
router.use(stopContainerRouter);

export { router as indexContainerRouter };

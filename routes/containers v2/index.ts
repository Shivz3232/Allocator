import { json } from "body-parser";
import express from "express";
import { createContainerRouter } from "./create";

const router = express.Router();

router.use(json());
router.use(createContainerRouter);

export { router as indexContainerRouterV2 };
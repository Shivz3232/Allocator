import { json } from "body-parser";
import express from "express";

const router = express.Router();

router.use(json());

export { router as indexContainerRouterV2 };
import { Router } from "express";
import openviduController from "../controllers/openviduController.js";

const openviduRouter = Router();

openviduRouter.post("/", openviduController.makeSession)

export default openviduRouter;
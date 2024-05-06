import { Router } from "express";
import openviduController from "../controllers/openviduController.js";

const openviduRouter = Router();

openviduRouter.post("/", openviduController.makeSession)

openviduRouter.post("/:sessionId/connections", openviduController.sessionToken);

export default openviduRouter;
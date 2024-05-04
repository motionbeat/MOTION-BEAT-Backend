import { Router } from "express";
import instrumentController from "../controllers/instrumentController.js"; 

const instrumentRouter = Router();

instrumentRouter.get("/", instrumentController.showInstruments);

export default instrumentRouter;
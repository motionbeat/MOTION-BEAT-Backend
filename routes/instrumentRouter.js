import { Router } from "express";
import instrumentController from "../controllers/instrumentController.js"; 

const instrumentRouter = Router();

instrumentRouter.get("/", instrumentController.showInstruments);

instrumentRouter.patch("/select", instrumentController.selectInstrument);

export default instrumentRouter;
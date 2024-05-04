import { Router } from "express";
import gameController from "../controllers/gameController.js"; 

const gameRouter = Router();

gameRouter.post("/start", gameController.startGame);

export default gameRouter;

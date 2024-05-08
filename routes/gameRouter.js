import { Router } from "express";
import gameController from "../controllers/gameController.js"; 
import adminAuth from "../middlewares/adminAuth.js";


const gameRouter = Router();

gameRouter.post("/start", gameController.startGame);

gameRouter.post("/finished", gameController.gameFinished);

gameRouter.patch("/leave", gameController.leaveGame);

gameRouter.delete("/admin/delete", adminAuth, gameController.resetGames);

export default gameRouter;

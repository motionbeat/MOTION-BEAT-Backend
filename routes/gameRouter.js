import { Router } from "express";
import gameController from "../controllers/gameController.js"; 
import createRateLimiter from "../middlewares/rateLimitMiddleware.js";

const limiter = createRateLimiter({ trustProxy: true });
const gameRouter = Router();

gameRouter.post("/start", limiter, gameController.startGame);

gameRouter.post("/finished", gameController.gameFinished);

gameRouter.patch("/leave", gameController.leaveGame);

export default gameRouter;

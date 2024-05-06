import { Router } from "express";
import gameController from "../controllers/gameController.js"; 
import createRateLimiter from "../middlewares/rateLimitMiddleware.js";

const limiter = createRateLimiter();
const gameRouter = Router();

gameRouter.post("/start", limiter, gameController.startGame);

gameRouter.post("/finished", limiter, gameController.gameFinished);

export default gameRouter;

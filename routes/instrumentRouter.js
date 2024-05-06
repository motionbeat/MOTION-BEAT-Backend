import { Router } from "express";
import instrumentController from "../controllers/instrumentController.js"; 
import createRateLimiter from "../middlewares/rateLimitMiddleware.js";

const limiter = createRateLimiter();
const instrumentRouter = Router();

instrumentRouter.get("/", limiter, instrumentController.showInstruments);

instrumentRouter.patch("/select", limiter, instrumentController.selectInstrument);

export default instrumentRouter;
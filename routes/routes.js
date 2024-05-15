import express from 'express';
import userRouter from "./userRouter.js";
import songRouter from "./songRouter.js";
import rankingRouter from "./rankingRouter.js";
import roomRouter from "./roomRouter.js";
import gameRouter from "./gameRouter.js";
import instrumentRouter from "./instrumentRouter.js";
import openviduRouter from "./openviduRouter.js";
import authMiddleware from "../middlewares/authMiddleware.js";


const router = express.Router();

router.use("/api/users", userRouter);
router.use('/api', authMiddleware);
router.use("/api/openvidu", openviduRouter);
router.use("/api/songs", songRouter);
router.use("/api/rankings", rankingRouter);
router.use("/api/rooms", roomRouter);
router.use("/api/games", gameRouter);
router.use("/api/instruments", instrumentRouter);

export default router;
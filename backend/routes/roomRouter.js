import { Router } from "express";
import roomController from "../controllers/roomController.js"; 

const roomRouter = Router();

roomRouter.post("/create", roomController.createRoom);

roomRouter.patch("/leave", roomController.leaveRoom);

// roomRouter.patch("/join/random", roomController.joinRoom);

roomRouter.patch("/join/:code", roomController.joinRoomByCode);

roomRouter.delete("/:code", roomController.deleteRoom);

export default roomRouter;
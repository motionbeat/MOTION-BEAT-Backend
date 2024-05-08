import { Router } from "express";
import roomController from "../controllers/roomController.js"; 
import adminAuth from "../middlewares/adminAuth.js";

const roomRouter = Router();

/**
 * @swagger
 *  /rooms/add:
 *    post:
 *      summary: "방 생성"
 *      description: "POST방식으로 방 생성"
 *      tags:
 *      - room
 *      produces:
 *      - application/json
 *      parameters:
 *      - in: body
 *        name: body
 *        required: true
 *        schema:
 *          type: object
 *          required: 
 *          - song
 *          - type
 *          properties:
 *            song:
 *              type: number
 *            type:
 *              type: string
 *      - in: headers
 *        name: header
 *        required: true
 *        schema:
 *          type: object
 *          required:
 *          - nickname: string
 *      responses:
 *       201:
 *        description: Successfully created room
 *       500:
 *        description: Internal server error
 *         
 */
roomRouter.post("/create",  roomController.createRoom);

roomRouter.patch("/leave",  roomController.leaveRoom);

roomRouter.post("/match", roomController.matchRoom);
// roomRouter.patch("/join/random", roomController.joinRoom);

roomRouter.patch("/join/:code",roomController.joinRoomByCode);

roomRouter.get("/check", roomController.checkStartGame);

roomRouter.get("/playerinfo/:code", roomController.getPlayerInfo)

roomRouter.delete("/admin/delete", adminAuth, roomController.resetRooms);


export default roomRouter;
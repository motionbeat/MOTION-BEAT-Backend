import { Router } from "express";
import rankingController from "../controllers/rankingController.js"; 

const rankingRouter = Router();

/**
 * @swagger
 *  /rankings/{title}:
 *    get:
 *      summary: "곡의 모든 점수 기록 조회"
 *      description: "GET 방식으로 곡의 모든 점수 조회"
 *      tags:
 *      - ranking
 *      produces:
 *      - application/json
 *      parameters:
 *      - in: query
 *        name: query
 *        type: string
 *        required: true
 *        description: song title
 *      responses:
 *       200:
 *        description: Successfully found all rankings for title
 *       500:
 *        description: Internal server error
 *         
 */
rankingRouter.get("/:title", rankingController.getRankingBySong);

rankingRouter.get("/:title/instrument/:instrument", rankingController.getRankingByInstrument)

export default rankingRouter;
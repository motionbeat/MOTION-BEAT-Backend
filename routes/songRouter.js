import { Router } from "express";
import songController from "../controllers/songController.js"; 
import adminAuth from "../middlewares/adminAuth.js";

const songRouter = Router();

/**
 * @swagger
 *  /songs:
 *    get:
 *      summary: "전체 곡 조회"
 *      description: "GET 방식으로 전체 곡 목록 조회"
 *      tags:
 *      - song
 *      produces:
 *      - application/json
 *      responses:
 *       200:
 *        description: Successfully found all songs
 *       500:
 *        description: Internal server error
 *         
 */
songRouter.get("/", songController.getAllSongs);

/**
 * @swagger
 *  /songs/{difficulty}:
 *    get:
 *      summary: "난이도로 곡 조회"
 *      description: "요청 경로에 값을 담아 서버에 보낸다"
 *      tags:
 *      - song
 *      produces:
 *      - application/json
 *      parameters:
 *        - in: path
 *          name: category
 *          required: false
 *          schema:
 *            type: String
 *            description: 카테고리
 *      responses:
 *       200:
 *        description: Successfully found all songs
 *       500:
 *        description: Internal server error
 *         
 */
songRouter.get("/difficulty/:difficulty", songController.getSongByDifficulty);

/**
 * @swagger
 *  /songs/favorite/{title}:
 *    patch:
 *      summary: "즐겨찾기 추가/제거"
 *      description: "{title}을 사용자의 즐겨찾기 목록에 추가/제거"
 *      tags:
 *      - song
 *      produces:
 *      - application/json
 *      parameters:
 *        - in: path
 *      responses:
 *       200:
 *        description: Successfully favorited/unfavorited song
 *       500:
 *        description: Internal server error
 *         
 */
songRouter.patch("/favorite/:title", songController.updateFavorite);

/**
 * @swagger
 *  /songs/favorite:
 *    get:
 *      summary: "즐겨찾기 노래 조회"
 *      description: "요청 경로에 값을 담아 서버에 보낸다"
 *      tags:
 *      - song
 *      produces:
 *      - application/json
 *      parameters:
 *        - in: path
 *      responses:
 *       200:
 *        description: Successfully found favorite songs
 *       500:
 *        description: Internal server error
 *         
 */
songRouter.get("/favorite", songController.getFavoriteSongs);

/**
 * @swagger
 *  /songs/add:
 *    post:
 *      summary: "Admin 노래 등록"
 *      description: "POST방식으로 데이터베이스에 노래 등록"
 *      tags:
 *      - song
 *      produces:
 *      - application/json
 *      parameters:
 *      - in: body
 *        name: body
 *        required: true
 *        schema:
 *          type: object
 *          required: 
 *          - number
 *          - title
 *          - artist
 *          - imagePath
 *          - runtime
 *          - difficulty
 *          properties:
 *            number:
 *              type: number
 *            title:
 *              type: string
 *            artist:
 *              type: string
 *            imagePath:
 *              type: string
 *            runtime: 
 *              type: string
 *            difficulty:
 *              type: string
 *      responses:
 *       201:
 *        description: Successfully registered song
 *       500:
 *        description: Internal server error
 *         
 */
songRouter.post("/add", adminAuth, songController.addSong);

/**
 * @swagger
 *  /songs/random:
 *    get:
 *      summary: "무작위 노래 조회"
 *      description: "요청 경로에 값을 담아 서버에 보낸다"
 *      tags:
 *      - song
 *      produces:
 *      - application/json
 *      responses:
 *       200:
 *        description: Successfully found random songs
 *       500:
 *        description: Internal server error
 *         
 */
songRouter.get("/random", songController.randomSong);

/**
 * @swagger
 *  /songs/{id}:
 *    get:
 *      summary: "id로 곡 조회"
 *      description: "요청 경로에 값을 담아 서버에 보낸다"
 *      tags:
 *      - song
 *      produces:
 *      - application/json
 *      parameters:
 *        - in: path
 *          name: category
 *          required: false
 *          schema:
 *            type: String
 *            description: 카테고리
 *      responses:
 *       200:
 *        description: Successfully found all songs
 *       500:
 *        description: Internal server error
 *         
 */
songRouter.get("/:number", songController.getSongByNumber);



export default songRouter;
import { Router } from "express";
import userController from "../controllers/userController.js"; 
import authMiddleware from "../middlewares/authMiddleware.js";
import createRateLimiter from "../middlewares/rateLimitMiddleware.js";

const limiter = createRateLimiter();
const userRouter = Router();


/**
 * @swagger
 *  /users:
 *    get:
 *      summary: "전체 사용자 조회"
 *      description: "GET 방식으로 전체 사용자 목록 조회"
 *      tags:
 *      - user
 *      produces:
 *      - application/json
 *      responses:
 *       200:
 *        description: Successfully found all users
 *       500:
 *        description: Internal server error
 *         
 */
userRouter.get("/", limiter, userController.getAllUsers);

//사용자 친구목록
userRouter.get("/friends", authMiddleware, limiter, userController.getAllFriends);

/**
 * @swagger
 *  /users/signup:
 *    post:
 *      summary: "사용자 회원가입"
 *      description: "POST방식으로 데이터베이스에 사용자 등록"
 *      tags:
 *      - user
 *      produces:
 *      - application/json
 *      parameters:
 *      - in: body
 *        name: body
 *        required: true
 *        schema:
 *          type: object
 *          required: 
 *          - email
 *          - nickname
 *          - pw
 *          properties:
 *            email:
 *              type: string
 *            nickname:
 *              type: string
 *            pw:
 *              type: string
 *              minLength: 6
 *      responses:
 *       200:
 *        description: Successfully registered user
 *       404:
 *        description: Invalid credentials
 *       500:
 *        description: Internal server error
 *         
 */
userRouter.post("/signup", limiter, userController.createUser);

/**
 * @swagger
 *  /users/login:
 *    post:
 *      summary: "사용자 로그인"
 *      description: "POST방식으로 로그인"
 *      tags:
 *      - user
 *      produces:
 *      - application/json
 *      parameters:
 *      - in: body
 *        name: body
 *        required: true
 *        schema:
 *          type: object
 *          required: 
 *          - email
 *          - pw
 *          properties:
 *            email:
 *              type: string
 *            pw:
 *              type: string
 *              minLength: 6
 *      responses:
 *       201:
 *        description: Successfully logged in
 *       400: 
 *        description: Bad request 
 *       409:
 *        description: Invalid credentials
 *       500:
 *        description: Internal server error
 *         
 */
userRouter.post("/login", limiter, userController.loginUser);

/**
 * @swagger
 *  /users/logout:
 *    patch:
 *      summary: "사용자 로그아웃"
 *      description: "PATCH방식으로 로그아웃"
 *      tags:
 *      - user
 *      produces:
 *      - application/json
 *      parameters:
 *      - in: headers
 *        nickname: body
 *        required: true
 *      responses:
 *       200:
 *        description: Successfully logged out
 *       500:
 *        description: Internal server error
 *         
*/
userRouter.patch("/logout", authMiddleware, limiter, userController.logoutUser);

/**
 * @swagger
 *  /users:
 *    get:
 *      summary: "최근 플레이 곡 조회"
 *      description: "GET 방식으로 최근 플레이 목록 5개 조회"
 *      tags:
 *      - user
 *      produces:
 *      - application/json
 *      responses:
 *       200:
 *        description: Successfully found recent songs
 *       500:
 *        description: Internal server error
 *         
 */
userRouter.get("/recent", limiter, userController.getRecentSongs)

/**
 * @swagger
 *  /users/{id}:
 *    get:
 *      summary: "id로 사용자 조회"
 *      description: "요청 경로에 값을 담아 서버에 보낸다"
 *      tags:
 *      - user
 *      produces:
 *      - application/json
 *      parameters:
 *        - in: path
 *      responses:
 *       200:
 *        description: Successfully found user
 *       500:
 *        description: Internal server error
 *         
 */
userRouter.get("/:id", limiter, userController.getUser);

// userRouter.delete("/:id", userController.deleteUser);

export default userRouter;
import { Router } from "express";
import userController from "../controllers/userController.js"; 
import authMiddleware from "../middlewares/authMiddleware.js";

const userRouter = Router();


/**
 * @swagger
 * tags:
 *   name: User
 *   description: Operations related to users
 */


/**
 * @swagger
 * /api/users/friends:
 *   get:
 *     summary: Get user's friends
 *     description: Retrieve user's friends
 *     tags: [User]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       '200':
 *         description: Successfully retrieved user's friends
 *       '500':
 *         description: Internal server error
 */
userRouter.get("/friends", authMiddleware, userController.getAllFriends);

/**
 * @swagger
 * /api/users/signup:
 *   post:
 *     summary: Register a new user
 *     description: Register a new user with email, nickname, and password
 *     tags: [User]
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: body
 *         description: User information
 *         required: true
 *         schema:
 *           type: object
 *           required:
 *             - email
 *             - nickname
 *             - pw
 *           properties:
 *             email:
 *               type: string
 *               description: Email of the user
 *             nickname:
 *               type: string
 *               description: Nickname of the user
 *             pw:
 *               type: string
 *               minLength: 6
 *               description: Password of the user
 *     responses:
 *       201:
 *         description: Successfully registered user
 *       500:
 *         description: Internal server error
 */
userRouter.post("/signup", userController.createUser);

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Log in user
 *     description: Log in user with email and password
 *     tags: [User]
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: body
 *         description: User information
 *         required: true
 *         schema:
 *           type: object
 *           required:
 *             - email
 *             - pw
 *           properties:
 *             email:
 *               type: string
 *               description: Email of the user
 *             pw:
 *               type: string
 *               minLength: 6
 *               description: Password of the user
 *     responses:
 *       '201':
 *         description: Successfully logged in
 *       '404':
 *         description: User not found or invalid credentials
 *       '500':
 *         description: Internal server error
 */
userRouter.post("/login", userController.loginUser);

/**
 * @swagger
 * /api/users/logout:
 *   patch:
 *     summary: Log out user
 *     description: Log out currently logged-in user
 *     tags: [User]
 *     security:
 *       - BearerAuth: []
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: header
 *         name: header
 *         description: User information
 *         required: true
 *         schema:
 *           type: object
 *           required:
 *             - userid
 *           properties:
 *             userid:
 *               type: string
 *               description: id of the user
 *     responses:
 *       '200':
 *         description: Successfully logged out
 *       '500':
 *         description: Internal server error
 */
userRouter.patch("/logout", authMiddleware, userController.logoutUser);

/**
 * @swagger
 * /api/users/recent:
 *   get:
 *     summary: Get recent songs
 *     description: Retrieve recent songs played by the user
 *     tags: [User]
 *     parameters:
 *       - in: header
 *         name: header
 *         description: User information
 *         required: true
 *         schema:
 *           type: object
 *           required:
 *             - nickname
 *           properties:
 *             nickname:
 *               type: string
 *               description: nickname of the user
 *     responses:
 *       '200':
 *         description: Successfully retrieved recent songs
 *       '500':
 *         description: Internal server error
 */
userRouter.get("/recent", userController.getRecentSongs)

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get user by ID
 *     description: Retrieve user by their ID
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       '200':
 *         description: Successfully retrieved user
 *       '500':
 *         description: Internal server error
 */
userRouter.get("/:id", userController.getUser);

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users
 *     description: Retrieve all users
 *     tags: [User]
 *     responses:
 *       '200':
 *         description: Successfully retrieved all users
 *       '500':
 *         description: Internal server error
 */
userRouter.get("/", userController.getAllUsers);
// userRouter.delete("/:id", userController.deleteUser);

export default userRouter;
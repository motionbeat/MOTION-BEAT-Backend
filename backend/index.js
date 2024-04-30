// backend/index.js
import express from "express";
import session from "express-session";
import bodyParser from "body-parser";
// import cors from "cors";

import bcrypt from "bcrypt";
import authMiddleware from "./middlewares/authMiddleware.js";

import userRouter from "./routes/userRouter.js";
import songRouter from "./routes/songRouter.js";
import rankingRouter from "./routes/rankingRouter.js";
import roomRouter from "./routes/roomRouter.js"

import { KakaoClient } from "./social/kakao.js";

import { swaggerUi , specs } from "./modules/swagger.js";
import dotenv from "dotenv";
dotenv.config();
import {app} from "./app.js"

// app.use(cors());

import {createServer} from "http";
import {Server} from "socket.io";

const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        // // origin: "http://localhost:3000",
        origin: "*",
    }
});

import ioFunction from "./utils/io.js"
ioFunction(io);

// request parsing
app.use(bodyParser.json());
app.use(express.urlencoded({extended:true}));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.get("/kakao/url", (req, res, next) => {
    console.log("/kakao/url start");
  
    const url = KakaoClient.getAuthCodeURL();
  
    res.status(200).json({
      url,
    });
    
    console.log("/kakao/url finish");
});

app.use("/api/users", userRouter);

app.use('/api', authMiddleware);

app.use("/api/songs", songRouter);
app.use("/api/rankings", rankingRouter);
app.use("/api/rooms", roomRouter);
//Main
app.get('/', (req, res) => {
    res.send("Welcome to MOTION-BEAT");
});

httpServer.listen(process.env.PORT, ()=>{
    console.log("Server listening on port", process.env.PORT);
});

// app.listen(port, () => {
//     console.log(`Server running on http://localhost:${port}`);
// });

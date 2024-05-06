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
import roomRouter from "./routes/roomRouter.js";
import gameRouter from "./routes/gameRouter.js";
import instrumentRouter from "./routes/instrumentRouter.js";
import openviduRouter from "./routes/openviduRouter.js";


import { KakaoClient } from "./social/kakao.js";

import { swaggerUi , specs } from "./modules/swagger.js";
import dotenv from "dotenv";
dotenv.config();
import {app} from "./app.js"

// request parsing
app.use(bodyParser.json());
app.use(express.urlencoded({extended:true}));

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); // Allow requests from any origin
    res.header('Access-Control-Allow-Methods', 'GET, POST, , PATCH, PUT, DELETE, OPTIONS'); // Specify the allowed HTTP methods
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization'); // Specify the allowed headers
    next();
  });


import ioFunction from "./utils/io.js";
import {io, httpServer} from "./utils/socket.js";
ioFunction(io);

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

// app.use('/api', authMiddleware);

app.use("/api/songs", songRouter);
app.use("/api/rankings", rankingRouter);
app.use("/api/rooms", roomRouter);
app.use("/api/games", gameRouter);
app.use("/api/instruments", instrumentRouter);
app.use("/api/openvidu", openviduRouter);
//Main
app.get('/', (req, res) => {
    res.send("Welcome to MOTION-BEAT");
});

httpServer.listen(process.env.PORT, ()=>{
    console.log("Server listening on port", process.env.PORT);
    console.log("Application server connecting to OpenVidu at",  process.env.OPENVIDU_URL);
});

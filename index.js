import express from "express";
import session from "express-session";
import bodyParser from "body-parser";
import bcrypt from "bcrypt";
import routes from "./routes/routes.js";
import { KakaoClient } from "./social/kakao.js";
import { swaggerUi , specs } from "./modules/swagger.js";
import dotenv from "dotenv";
dotenv.config();
import {app} from "./app.js"


// app.use((req, res, next) => {
//     res.header('Access-Control-Allow-Origin', '*'); // Allow requests from any origin
//     res.header('Access-Control-Allow-Methods', 'GET, POST, , PATCH, PUT, DELETE, OPTIONS'); // Specify the allowed HTTP methods
//     res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization'); // Specify the allowed headers
//     next();
//   });


import ioFunction from "./utils/io.js";
import {io, httpServer} from "./utils/socket.js";
ioFunction(io);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.get("/kakao/url", (req, res, next) => {
  const url = KakaoClient.getAuthCodeURL();

  res.status(200).json({
    url,
  });
});

app.use('/', routes);

app.get('/', (req, res) => {
    res.send("Welcome to MOTION-BEAT");
});

httpServer.listen(process.env.PORT, ()=>{
    console.log("Server listening on port", process.env.PORT);
    console.log("Application server connecting to OpenVidu at",  process.env.OPENVIDU_URL);
});

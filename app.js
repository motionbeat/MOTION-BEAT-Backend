import cors from "cors";
import express from "express";
import bodyParser from 'body-parser';
import compression from 'compression';
import createRateLimiter from "./middlewares/rateLimitMiddleware.js";

const limiter = createRateLimiter();
const app =  express();

app.use(cors({
    origin: ['http://192.168.0.146:3000', 'http://172.21.176.1:3000', 'http://localhost:3000'],
    credentials: true
}));
app.set('trust proxy', true);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.urlencoded({extended:true}));
app.use(compression());
app.use(limiter);

import db from "./config/db.js";

export {app};


import cors from "cors";
import express from "express";
import bodyParser from 'body-parser';
import compression from 'compression';
import createRateLimiter from "./middlewares/rateLimitMiddleware.js";

const limiter = createRateLimiter();
const app =  express();

app.use(cors());
// app.set('trust proxy', true);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.urlencoded({extended:true}));
app.use(compression());
app.use(limiter);

import db from "./config/db.js";

export {app};


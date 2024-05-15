import cors from "cors";
import express from "express";
import bodyParser from 'body-parser';
import compression from 'compression';
import createRateLimiter from "./middlewares/rateLimitMiddleware.js";

const limiter = createRateLimiter();
const app =  express();

// app.use(cors({
//     origin: ['http://192.168.0.0:3000', 'http://172.21.176.1:3000', 'http://localhost:3000'],
//     credentials: true
// }));
app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin 
        // (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        if (origin.startsWith('http://192.168.') || origin === 'http://172.21.176.1:3000' || origin === 'http://localhost:3000') {
            return callback(null, true);
        }
        var msg = 'The CORS policy for this site does not ' +
                  'allow access from the specified Origin.';
        return callback(new Error(msg), false);
    },
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


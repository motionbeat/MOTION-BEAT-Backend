import cors from "cors";
import express from "express";
const app =  express();
app.use(cors({
    origin: "http://localhost:3000"
}));

import db from "./config/db.js";

export {app};


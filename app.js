import cors from "cors";
import express from "express";
const app =  express();
app.use(cors());

app.set('trust proxy', true);

import db from "./config/db.js";

export {app};


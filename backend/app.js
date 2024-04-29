import cors from "cors";
import express from "express";
const app =  express();
app.use(cors());

import db from "./config/db.js";

export {app};


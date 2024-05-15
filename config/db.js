import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const db = mongoose.connect(process.env.DB)
    .then(() => {
        console.log("Connection to DB established");     
    }) 
    .catch((err)=> {
        console.log("DB connection error");
        console.log(err);
    });

export default db; 
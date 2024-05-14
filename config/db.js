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
    })

process.on('SIGINT', function() {
    mongoose.connection.close(function () {
        console.log('Mongoose disconnected on app termination');
        process.exit(0);
    });
});

export default db; 
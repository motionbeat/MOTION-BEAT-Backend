import mongoose from "mongoose";

const rankingSchema = new mongoose.Schema({
    title:{
        type:String,
        required: true,
    }, 
    number:{
        type: String,
        required: true,
    },
    user:{
        type:String,
        required:true,
    },
    score: {
        type: Number,
        required:true,
    },
    instrument: {
        type:String,
        required:true,
    }
});

export default mongoose.model("Ranking", rankingSchema);
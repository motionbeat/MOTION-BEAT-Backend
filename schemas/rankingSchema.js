import mongoose from "mongoose";

const rankingSchema = new mongoose.Schema({
    title:{
        type:String,
    }, 
    number:{
        type: String,
        required: true,
    },
    players: [],
    totalScore: {
        type: Number
    }
});

export default mongoose.model("Ranking", rankingSchema);
import mongoose from "mongoose";

const songSchema = new mongoose.Schema({
    number: {
        type: Number,
        // required: true,
        unique: true
    },
    title:{
        type:String,
        required: true,
        unique: true
    }, 
    artist:{
        type:String,
        required:true,
    },
    imagePath: {
        type:String,
        required: true,
        unique: true
    },
    runtime:{
        type:String,
        required:true        
    },

    difficulty: {
        type:String,
        required:true 
    }
});

export default mongoose.model("Song", songSchema);
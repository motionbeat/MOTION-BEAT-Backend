import mongoose from "mongoose";

const songSchema = new mongoose.Schema({
    number: {
        type: Number,
        required: true,
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
        unique: true
    },
    runtime:{
        type:String,
        required:true        
    },

    difficulty: {
        type:String,
        required:true 
    },
    notes: []
});

export default mongoose.model("Song", songSchema);

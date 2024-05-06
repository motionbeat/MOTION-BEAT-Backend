import mongoose from "mongoose";
import User from "./userSchema.js";

const roomSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true
    },
    hostName:{
        type:String,
        required: true,
        unique: true
    }, 
    song:{
        type:String,
        required:true,
    },
    type:{
        type:String,
        required:true        
    },
    players: [{
        nickname: {
            type: String,
            ref: "User"
        },
        instrument: {
            type: String,
            ref: "Instrument"
        }
      }],
    gameState: {
        type: String,
        required: true,
        ref: "Game"
    }
});

export default mongoose.model("Room", roomSchema);

import mongoose from "mongoose";
import User from "./userSchema.js";
import Room from "./roomSchema.js";

const gameSchema = new mongoose.Schema({
    code: { 
        type: String,
        ref: 'Room', 
        required: true 
    },
    song:{
        type: Number,
        ref: "Song",
        required: true
    },
    gameState: { 
        type: String, 
        ref: "Room",
        required: true 
    },
    players: [{ 
        nickname: { 
            type: String, 
            ref: 'User'
        }, 
        instrument: {
            type: String,
            ref: "Instrument"
        },
        score: {
            type: Number,
            default: 0
        },
    }],
    // Other game-related fields...
  });

export default mongoose.model("Game", gameSchema);

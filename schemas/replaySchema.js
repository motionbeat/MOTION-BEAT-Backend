import mongoose from "mongoose";
import User from "./userSchema.js";
import Room from "./roomSchema.js";

const replaySchema = new mongoose.Schema({
    song:{
        type: Number,
        ref: "Song",
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
        data: [] 
    }],
    // Other game-related fields...
  });

export default mongoose.model("Replay", replaySchema);

import mongoose from "mongoose";
import User from "./userSchema.js";
import Room from "./roomSchema.js";

const gameSchema = new mongoose.Schema({
    code: {
        type: String,
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
    players: [
        {
          type: String,
          unique: true,
          ref: "User",
        },
      ],
    
});

export default mongoose.model("Room", roomSchema);

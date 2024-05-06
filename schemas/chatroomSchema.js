import mongoose from "mongoose";
import User from "./userSchema.js";
import Room from "./roomSchema.js";

const chatroomSchema = new mongoose.Schema(
  {
    chatroom: String,
    players: [
      {
        type: String,
        unique: true,
        ref: "User",
      },
    ],
    room: {
        type: mongoose.Schema.ObjectId,
        ref: "Room"
    }
  },
  { timestamp: true }
);

export default mongoose.model("Chatroom", chatroomSchema);

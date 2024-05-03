import mongoose from "mongoose";
import User from "./userSchema.js";
import Chatroom from "./chatroomSchema.js";


const chatSchema = new mongoose.Schema({
    chat: String,
    user: {
        id: {
            type: mongoose.Schema.ObjectId,
            ref: "User",
        },
        nickname: String,
    },
    chatroom: {
        type: mongoose.Schema.ObjectId,
        ref: "Chatroom",
    },
},
    { timestamp: true }   
)

export default mongoose.model("Chat", chatSchema);
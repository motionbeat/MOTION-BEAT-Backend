import Chat from "../schemas/chatSchema.js";
import mongoose from "mongoose";

const chatController = {
    saveChat: async (message, user)=>{
        const newMessage = new Chat({
            chat:message,
            user:{
                id:user._id,
                nickname:user.nickname
            }
        })
        await newMessage.save();
        return newMessage;
    }
}

export default chatController;
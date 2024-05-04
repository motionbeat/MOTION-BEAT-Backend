import Chat from "../schemas/chatSchema.js";
import mongoose from "mongoose";

const chatController = {
    saveChat: async (message, user, code)=>{
        const newMessage = new Chat({
            chat:message,
            user:{
                id:user._id,
                nickname:user.nickname
            },
            chatroom: code
        })
        await newMessage.save();
        return newMessage;
    },
    // deleteChat: async ()
}

export default chatController;
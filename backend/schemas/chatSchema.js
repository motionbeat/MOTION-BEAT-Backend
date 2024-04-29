import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
    chat: String,
    user: {
        id: {
            type: mongoose.Schema.ObjectId,
            ref: "User",
        },
        name: String,
    },
},
    { timestamp: true }   
)

export default mongoose.model("Chat", chatSchema);
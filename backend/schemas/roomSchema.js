import mongoose from "mongoose";

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
    players: {
        type:Array,
        default:[] 
    }
});

export default mongoose.model("Room", roomSchema);

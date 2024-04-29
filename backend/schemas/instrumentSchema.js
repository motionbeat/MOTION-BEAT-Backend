import mongoose from "mongoose";

const instrumentSchema = new mongoose.Schema({
    instrumentName : {
        type: String
    },
    motion1 : {
        type: String,
        required: true
    },
    motion2 : {
        type: String, 
        required: true
    }, 
    motion3 : {
        type: String,
        required: true
    },
    motion4 : {
        type: String
    }
});

export default mongoose.model("Instrument", instrumentSchema);
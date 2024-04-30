import mongoose from "mongoose";
import User from "../schemas/userSchema.js";
// ObjectId = mongoose.Types.ObjectId;

export default async function(req, res, next){
    // const objectId = new mongoose.Types.ObjectId;
    try{
        const currentUser = await User.findById(req.headers.userid);
        if (!currentUser) {
            return res.status(404).json({ message: "User not found" });
        }
        if(!currentUser.isAdmin){
            return res.status(403).json({ message: "Forbidden" });    
        } else {
            console.log("success");
            next();
        }
    } catch (err) {
        console.error("Error:", err);
        return res.status(500).json({message: "Internal Server Error"});
    }
};
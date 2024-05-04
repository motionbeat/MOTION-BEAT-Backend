import {io} from "../utils/socket.js";
import Room from "../schemas/roomSchema.js";
import User from "../schemas/userSchema.js";
import Instrument from "../schemas/instrumentSchema.js";
import songController from "./songController.js";
import mongoose from "mongoose";

const instrumentController = {
    showInstruments : async(req, res)=>{
        try{
            const allInstruments = await Instrument.find({});
            res.status(200).json(allInstruments);
        } catch (err) {
            res.status(500).json({message: err.message});
        }
    },
    selectInstrument : async(req,res)=>{
        const {nickname} = req.headers
        const {instrumentName} = req.body;
        try{
            const room = await Room.findOne({ "players.nickname": nickname });
            if (!room) {
                return res.status(404).json({ message: "Room not found" });
            }
            const updatedRoom = await Room.findOneAndUpdate(
                { code: room.code, "players.nickname": nickname },
                { $set: { "players.$.instrument": instrumentName } },
                { new: true }
            );    
            io.to(updatedRoom.code).emit("instrumentStatus", {
                nickname: nickname,
                instrument: instrumentName
            });
            res.status(200).json({message: "성공적으로 악기를 변경했습니다"});
        } catch (err) {
            res.status(500).json({message: err.message});
        }
    }
}

export default instrumentController
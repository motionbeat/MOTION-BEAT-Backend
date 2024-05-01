import Room from "../schemas/roomSchema.js";
import User from "../schemas/userSchema.js";
import songController from "./songController.js";
import mongoose from "mongoose";

function makeCode() {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < 6) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
}

const roomController = {
    createRoom: async (req, res)=>{
        const nickname = req.headers.nickname;
        const { type } = req.body;
        let code = makeCode();
        try{
            let song = await songController.randomSong();
            const room = new Room({ code, hostName: nickname, song: song.number, type });
            await room.save();
            await Room.updateOne({ code }, {$push : {players: nickname}});
            res.status(200).json(room);
        } catch (err) {
            console.log(err);
            res.status (500).json({message: err.message});
        }
    },
    joinRoomByCode: async (req, res)=>{
        const nickname = req.headers.nickname
        const code = req.params.code;
        try{
            const room = await Room.findOneAndUpdate({ code }, {$push : {players: nickname}}, {new: true});
            res.status(200).json(room);
        } catch(err){
            res.status(500).json({message: err.message});            
        }
    },
    matchRoom: async(req, res)=>{
        try {
            const availableMatch = await Room.findOne({
                type: "match",
                $expr: { $lt: [{ $size: "$players" }, 4] }
            });
            if (availableMatch) {
                req.body.code = availableMatch.code; 
                joinRoomByCode(req, res);
                return;
            } else {
                req.body.type = "match";
                createRoom(req, res);
                return;
            }
        } catch (err) {
            res.status(500).json({message: err.message}); 
        }
    },
    leaveRoom: async (req, res)=>{
        const nickname = req.headers.nickname;
        const { code } = req.body;
        try{
            await Room.updateOne({ code }, {$pull : { players: nickname}});
            const currentRoom = await Room.findOne({code});
            if (currentRoom.players.length === 0){
                await Room.deleteOne({ code });
            } else if (currentRoom.hostName === nickname){
                hostName = currentRoom.players[0];
            }
            res.status(200).json({message: "redirect"});
        } catch(err){
            res.status(500).json({message: "Internal Server Error"});            
        }
    },
    getPlayerInfo: async(code)=>{
        try{
            const room = await Room.findOne({code});
            return room.players;
        } catch (err){
            throw err;
        }
    },
    deleteRoom: async (req, res)=>{
     
    },
    checkStartGame : async(req, res)=>{
        const { code } = req.body;
        const gameRoom = await Room.findOne({ code });
        if(!gameRoom){
            res.status(404).json({message: "존재하지 않는 방입니다."});
        }
        try {
            let falseCount = 0;
            for(let i = 0; i < gameRoom.players.length; i++){
                let user = await User.findOne({ nickname : gameRoom.players[i]});
                if (!user.isReady){
                    falseCount ++;
                }
            }
            if (falseCount != 1){
                return res.json({message: "모든 플레이어가 준비를 완료하지 않았습니다."})
            } 
            res.status(200).json({canStart : true});
        } catch (err) {
            res.status(500).json({message: err.message });
        }
    }
}

export default roomController
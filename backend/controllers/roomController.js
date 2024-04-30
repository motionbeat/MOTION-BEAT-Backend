import Room from "../schemas/roomSchema.js";
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
        console.log("CHECKING123");
        const nickname = req.headers.nickname;
        const { song, isTutorial } = req.body;
        let code = makeCode();
        try{
            const room = new Room({ code, hostName: nickname, song, type: isTutorial});
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
        const { code } = req.body;
        try{
            await Room.updateOne({ code }, {$push : {players: nickname}});
            const room = await Room.findOne({code});
            req.status(200).json(room);
        } catch(err){
            res.status(500).json({message: message.err});            
        }
    },
    leaveRoom: async (req, res)=>{
        const nickname = req.headers.nickname;
        const { code } = req.body;
        try{
            await Room.updateOne({ code }, {$pull : { players: nickname}});
            const currentRoom = await Room.find({code});
            if (currentRoom.players.length === 0){
                await Room.deleteOne({ code });
            }
        } catch(err){
            res.status(500).json({message: message.err});            
        }
    },
    deleteRoom: async (req, res)=>{
     
    }
}

export default roomController
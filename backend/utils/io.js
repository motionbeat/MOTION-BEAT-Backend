import User from "../schemas/userSchema.js";
import Room from "../schemas/roomSchema.js";
import userController from "../controllers/userController.js";
import chatController from "../controllers/chatController.js";
import roomController from "../controllers/roomController.js";
import mongoose from "mongoose"

export default function(io) {
    io.on("connection", async(socket) => {
        console.log("Client is connected", socket.id);
        // let tempData = socket.id;
        
        socket.on("login", async (nickname, cb) => {
            console.log("backend", nickname);
            try {
                const currentUser = await User.findOneAndUpdate(
                    { nickname }, 
                    {$set: {socketId: socket.id}}, 
                    {new: true}
                );
                console.log(currentUser);
                if (currentUser) {
                    console.log("User logged in successfully:", currentUser);
                    cb({ok: true});
                } else {
                    console.log("User not found.");
                    cb({ok: false, error: "User not found"});
                }
            } catch (err) {
                console.log("Error updating user:", err);
                cb({ok: false, error: err.message});
            }
        });

        socket.on("sendMessage", async (message, cb)=>{
            try{
                console.log("SENDING MESSAGE");
                const user = await userController.checkUser(socket.id);
                const newMessage = await chatController.saveChat(message, user);
                io.emit("message", newMessage);
                cb({ok: true});
            } catch(err){
                cb({ok: false, error: err.message });
            }
        })
        
        // socket.on("createRoom", async (hostName, cb))=>{
        //     try{
        //         const roomPlayers = await
        //     }
        // }

        socket.on("joinRoom", async (code, cb)=>{
            try{
                const roomPlayers = await roomController.getPlayerInfo(code);
                io.emit("players", roomPlayers);
                cb({ok: true});
            } catch(err){
                console.log("Error in joining room:", err);
                cb({ok: false, error: err.message});
            }
        });

        socket.on("ready", async (cb)=>{
            try{
                const user = await userController.toggleReady(socket.id);
                const { isReady, nickname } = user;
                const userReady = {
                    isReady, 
                    nickname
                }
                io.emit("readyStatus", userReady);
                cb({ok: true})
            } catch (err) {
                console.log("Error readying:", err);
                cb({ok: false, error: err.message});
            }
        })

        socket.on("changeSong", async (song, cb)=>{
            try{
                io.emit("change", song);
                cb({ok: true})
            } catch (err) {
                console.log("Error in changing song", err);
                cb({ok: false, error: err.message})
            }
        });

        socket.on("leaveRoom", async (code, cb)=>{
            try{
                const roomPlayers = await roomController.getPlayerInfo(code); 
                if (roomPlayers){
                    io.emit("leftRoom", roomPlayers);
                }
            } catch (err) {
                console.log("Error in leaving room", err);
                cb({ok: false, error: err.message})
            }
        })

        socket.on("disconnect", async () => {
            try {
                const user = await User.findOneAndUpdate({socketId: socket.id}, {$set: {socketId: null}}, {new: true});
                if(user){
                    const room = await Room.findOne({players: {$in: [user.nickname]}});
                    if (room){
                        const res = { status: () => {}, json: () => {} };
                        const req = {
                            body : {
                                live : true,
                                code : room.code
                            },
                            headers: {
                                nickname:  user.nickname
                            }
                        };
                        const testRoom = await roomController.leaveRoom(req, res);
                        if (testRoom){
                            const roomPlayers = await roomController.getPlayerInfo(room.code)
                            io.emit("leftRoom", roomPlayers)
                        }
                    }
                }
                console.log("User is disconnected");
            } catch (err) {
                console.log("Error disconnecting user:", err);
            }
        });
    });
};


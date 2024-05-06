import User from "../schemas/userSchema.js";
import Room from "../schemas/roomSchema.js";
import Game from "../schemas/gameSchema.js";
import userController from "../controllers/userController.js";
import chatController from "../controllers/chatController.js";
import roomController from "../controllers/roomController.js";
import gameController from "../controllers/gameController.js";
import mongoose from "mongoose"
import songSchema from "../schemas/songSchema.js";
import roomSchema from "../schemas/roomSchema.js";

const loadedPlayersPerRoom = new Map();
const endedPlayersPerRoom = new Map();

export default function ioFunction(io) {
    io.on("connection", async(socket) => {
        console.log("Client is connected", socket.id);
        
        //사용자 로그인: 로그인 시 사용자에 소켓 ID 등록
        socket.on("login", async (nickname, cb) => {
            try {
                const currentUser = await User.findOneAndUpdate(
                    { nickname }, 
                    {$set: {socketId: socket.id}, online: true}, 
                    {new: true}
                );
                if (currentUser) {
                    io.emit('userStatus', { nickname, online: true });
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

        //채팅시 내용/보낸 사용자 저장, 해당 메시지를 모두에게 전달
        socket.on("sendMessage", async (message, cb)=>{
            try{
                const user = await userController.checkUser(socket.id);
                const room = await Room.findOne({ "players.nickname": user.nickname });

                console.log(room.code)
                if (!room){
                    return;
                }
                const newMessage = await chatController.saveChat(message, user, room.code);
                io.to(room.code).emit(`message`, newMessage);
                cb({ok: true});
            } catch(err){
                cb({ok: false, error: err.message });
            }
        })

        //방 들어가기 및 해당 방 정보 갱신
        socket.on("joinRoom", async (code, cb)=>{
            try{
                const roomPlayers = await roomController.getPlayerInfo(code); 
                socket.join(code);
                console.log("Socket joined room:", code);
                io.emit(`players${code}`, roomPlayers);
                cb({ok: true});
            } catch(err){
                console.log("Error in joining room:", err);
                cb({ok: false, error: err.message});
            }
        });

        //준비상태 갱신
        socket.on("ready", async (cb)=>{
            try{
                const user = await userController.toggleReady(socket.id);
                const { isReady, nickname } = user;
                const userReady = {
                    isReady, 
                    nickname
                }
                const room = await Room.findOne({ "players.nickname": nickname });
                io.to(room.code).emit("readyStatus", userReady);
                cb({ok: true})
            } catch (err) {
                console.log("Error readying:", err);
                cb({ok: false, error: err.message});
            }
        });

        socket.on("changeInstrument", async (data, cb)=>{
            try{
                io.to(data.roomCode).emit(`instChanged`, data.song);
                cb({ok: true});
            } catch (err){
                console.log("Error selecting inst:", err);
                cb({ok: false, error: err.message});
            }
        })

        //곡 변경 
        socket.on("changeSong", async (data, cb)=>{
            const {roomCode, song} = data;
            console.log("CHECKING:", roomCode, song.number);
            try{
                await Room.updateOne({code: roomCode}, {$set: {song: song.number}});
                io.to(data.roomCode).emit(`songChanged`, data.song);
                cb({ok: true})
            } catch (err) {
                console.log("Error in changing song:", err);
                cb({ok: false, error: err.message})
            }
        });

        // 방 나가기 및 방 정보 갱신
        socket.on("leaveRoom", async (code, cb)=>{
            try{
                const roomPlayers = await roomController.getPlayerInfo(code); 
                socket.leave(code);
                if (roomPlayers){
                    io.emit(`leftRoom${code}`, roomPlayers);
                }
            } catch (err) {
                console.log("Error in leaving room", err);
                cb({ok: false, error: err.message})
            }
        });

        // 게임 진입 확인 
        socket.on('playerLoaded', async ({ nickname, code }) => {
            let loadedPlayers = loadedPlayersPerRoom.get(code);
            try{ 
                if (!loadedPlayers) {
                    loadedPlayers = new Set();
                    loadedPlayersPerRoom.set(code, loadedPlayers);
                }
                loadedPlayers.add(nickname);
                const game = await Game.findOne({ code })
                if (game && game.players.length === loadedPlayers.size) {
                    io.emit(`allPlayersLoaded${code}`);
                }
            } catch (err) {
                console.error('방 확인 중 오류 발생:', err);
            }
        });

        // 게임 종료 확인
        socket.on('gameEnded', async ({nickname, code, score})=>{
            let endedPlayers = endedPlayersPerRoom.get(code);
            try{ 
                if (!endedPlayers) {
                    endedPlayers = new Set();
                    endedPlayersPerRoom.set(code, endedPlayers);
                }
                endedPlayers.add(nickname);
        
                const game = await Game.findOne({ code })
                if (game) {
                    // Update player's score
                    const playerIndex = game.players.findIndex(player => player.nickname === nickname);
                    if (playerIndex !== -1) {
                        game.players[playerIndex].score += score;
                        await game.save();
                    }
                    
                    if (game.players.length === endedPlayers.size) {                    
                        io.emit(`allPlayersEnded${code}`);
                    }
                }
            } catch (err) {
                console.error('방 확인 중 오류 발생:', err);
            }
        });

        socket.on("hit", async(code, currentScore, cb)=>{
            io.to(code).emit(currentScore)
            cb({ ok: true });
        });

        // Disconnect 확인
        socket.on("disconnect", async () => {
            try {
                const user = await User.findOneAndUpdate({socketId: socket.id}, {$set: {socketId: null, online: false}}, {new: true});
                if(user){
                    const room = await Room.findOne({ "players.nickname": nickname });
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
                            socket.leave(room.code);
                            io.to(room.code).emit("leftRoom", roomPlayers)
                        }
                    }
                    io.emit('userStatus', { nickname: user.nickname, online: false });
                }
                console.log("User is disconnected");
            } catch (err) {
                console.log("Error disconnecting user:", err);
            }
        });
    });
};


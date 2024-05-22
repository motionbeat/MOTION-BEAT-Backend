import User from "../schemas/userSchema.js";
import Room from "../schemas/roomSchema.js";
import Game from "../schemas/gameSchema.js";
import userController from "../controllers/userController.js";
import chatController from "../controllers/chatController.js";
import roomController from "../controllers/roomController.js";
import gameController from "../controllers/gameController.js";
import rankingController from "../controllers/rankingController.js";
import mongoose from "mongoose"
import songSchema from "../schemas/songSchema.js";
import roomSchema from "../schemas/roomSchema.js";

const loadedPlayersPerRoom = new Map();
const endedPlayersPerRoom = new Map();

export default function ioFunction(io) {
    io.on("connection", async (socket) => {
        console.log("Client is connected", socket.id);

        //사용자 로그인: 로그인 시 사용자에 소켓 ID 등록
        socket.on("login", async (nickname, cb) => {
            socket.nickname = nickname;
            try {
                const currentUser = await userController.loginUserAndUpdateSocketId(socket.id, nickname);
                if (currentUser) {
                    io.emit('userStatus', { nickname, online: true });
                    cb({ ok: true });
                } else {
                    console.log("User not found.");
                    cb({ ok: false, error: "User not found" });
                }
            } catch (err) {
                cb({ ok: false, error: err.message });
            }
        });

        //채팅시 내용/보낸 사용자 저장, 해당 메시지를 모두에게 전달
        socket.on("sendMessage", async (message, cb) => {
            try {
                const user = await userController.checkUser(socket.id);
                const room = await roomController.findRoomByPlayerNickname(user.nickname);
                if (!room) {
                    return;
                }
                const newMessage = await chatController.saveChat(message, user, room.code);
                io.to(room.code).emit(`message`, newMessage);
                cb({ ok: true });
            } catch (err) {
                cb({ ok: false, error: err.message });
            }
        })

        //방 들어가기 및 해당 방 정보 갱신
        socket.on("joinRoom", async (receivedData, cb) => {
            const { nickname, code } = receivedData;
            socket.code = code;
            try {
                const roomPlayers = await roomController.getPlayerInfo(code);
                socket.join(code);
                io.emit(`players${code}`, roomPlayers);
                const room = await Room.findOne({ code })
                if (room.hostName !== nickname) {
                    io.to(room.code).emit('allReady', false);
                }
                cb({ ok: true });
            } catch (err) {
                cb({ ok: false, error: err.message });
            }
        });


        //준비상태 갱신
        socket.on("ready", async (cb) => {
            try {
                const user = await userController.toggleReady(socket.id);

                const { isReady, nickname } = user;
                const userReady = {
                    isReady,
                    nickname
                }
                const room = await Room.findOneAndUpdate(
                    { "players.nickname": nickname },
                    { $set: { "players.$.isReady": true ? true : false } }
                );
                io.to(room.code).emit("readyStatus", userReady);
                if (room.players.every(player => player.isReady)) {
                    io.to(room.code).emit("allReady", true)
                } else {
                    io.to(room.code).emit("allReady", false)
                }
                cb({ ok: true })
            } catch (err) {
                console.log("Error readying:", err);
                cb({ ok: false, error: err.message });
            }
        });

        //플레이어 악기 선택/변경
        socket.on("changeInstrument", async (data, cb) => {
            try {
                io.to(data.roomCode).emit(`instChanged`, data.song);
                cb({ ok: true });
            } catch (err) {
                console.log("Error selecting inst:", err);
                cb({ ok: false, error: err.message });
            }
        })

        //곡 변경 
        socket.on("changeSong", async (data, cb) => {
            const { roomCode, song } = data;
            try {
                await Room.updateOne({ code: roomCode }, { $set: { song: song.number } });
                io.to(data.roomCode).emit(`songChanged`, data.song);
                cb({ ok: true })
            } catch (err) {
                console.log("Error in changing song:", err);
                cb({ ok: false, error: err.message })
            }
        });

        // 방 나가기 및 방 정보 갱신
        socket.on("leaveRoom", async (code, cb) => {
            socket.code = null;
            try {
                const roomPlayers = await roomController.getPlayerInfo(code);
                socket.leave(code);
                if (roomPlayers) {
                    io.emit(`leftRoom${code}`, roomPlayers);
                }
            } catch (err) {
                console.log("Error in leaving room", err);
                cb({ ok: false, error: err.message })
            }
        });

        // 게임 진입 확인 
        socket.on('playerLoaded', async ({ nickname, code }) => {
            let loadedPlayers = loadedPlayersPerRoom.get(code);
            try {
                if (!loadedPlayers) {
                    loadedPlayers = new Set();
                    loadedPlayersPerRoom.set(code, loadedPlayers);
                }
                loadedPlayers.add(nickname);
                const game = await Game.findOne({ code })
                if (game && game.players.length === loadedPlayers.size) {
                    const startTime = Date.now() + 5000;
                    io.to(code).emit(`allPlayersLoaded${code}`, startTime);
                }
            } catch (err) {
                console.error('방 확인 중 오류 발생:', err);
            }
        });

        // 게임 종료 확인
        socket.on('gameEnded', async (data) => {
            const { code, nickname, score } = data;
            let endedPlayers = endedPlayersPerRoom.get(code);
            try {
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
                        await rankingController.saveRanking(game);
                        io.emit(`allPlayersEnded${code}`);
                    }
                }
            } catch (err) {
                console.error('방 확인 중 오류 발생:', err);
            }
        });

        socket.on("hit", async (receivedData) => {
            const { code, nickname, currentScore, combo, instrument, motionType } = receivedData
            try {
                io.to(code).emit(`liveScore${nickname}`, currentScore, combo, instrument, motionType);
            } catch (error) {
                console.error("Error sending score update", error);
            }
        });

        // Disconnect 확인
        socket.on("disconnect", async () => {
            const { nickname, code } = socket;

            try {

                // const user = await User.findOneAndUpdate({ socketId: socket.id }, { $set: { socketId: null, online: false } }, { new: true });
                const user = await User.findOneAndUpdate({ socketId: socket.id }, { $set: { online: false } }, { new: true });
                if (user) {
                    const room = await Room.findOne({ "players.nickname": nickname });
                    if (room) {
                        const res = { status: () => { }, json: () => { } };
                        const req = {
                            body: {
                                live: true,
                                code: room.code
                            },
                            headers: {
                                nickname: user.nickname
                            }
                        };
                        const leftRoom = await roomController.leaveRoom(req, res);
                        if (leftRoom) {
                            const roomPlayers = await roomController.getPlayerInfo(room.code)
                            socket.leave(room.code);
                            io.to(room.code).emit("leftRoom", roomPlayers)
                        }
                    }
                    let endedPlayers = endedPlayersPerRoom.get(code);
                    if (endedPlayers) {
                        endedPlayers.delete(nickname);
                        const game = await Game.findOne({ code })
                        if (game) {
                            const playerIndex = game.players.findIndex(player => player.nickname === nickname);
                            if (playerIndex !== -1) {
                                game.players.splice(playerIndex, 1);
                                await game.save();
                            }

                            if (game.players.length === endedPlayers.size) {
                                await rankingController.saveRanking(game);
                                io.emit(`allPlayersEnded${code}`);
                            }
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


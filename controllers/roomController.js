import { io } from "../utils/socket.js";
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
    createRoom: async (req, res) => {
        const nickname = req.headers.nickname;
        const { type } = req.body;
        const checkroom = await Room.findOne({ 'players.nickname': nickname })
        if (checkroom) {
            const leaveBody = {
                headers: {
                    nickname,
                },
                body: {
                    code: checkroom.code,
                },
                ghost: true
            };
            roomController.leaveRoom(leaveBody, res);
        }
        let code = makeCode();
        try {
            let song = await songController.randomSong();
            const room = new Room({
                code,
                hostName: nickname,
                song: song.number,
                type,
                gameState: "waiting"
            });
            await room.save();
            await Room.updateOne(
                { code },
                {
                    $push: {
                        players: {
                            nickname: nickname,
                            instrument: "select",
                            isReady: true
                        }
                    }
                });
            res.status(200).json(room);
        } catch (err) {
            console.log(err);
            res.status(500).json({ message: err.message });
        }
    },
    joinRoomByCode: async (req, res) => {
        const nickname = req.headers.nickname;
        const checkroom = await Room.findOne({ 'players.nickname': nickname })
        if (checkroom) {
            const leaveBody = {
                headers: {
                    nickname,
                },
                body: {
                    code: checkroom.code,
                },
                ghost: true
            }
            roomController.leaveRoom(leaveBody, res);
        }
        let code = req.params.code;
        if (!code) {
            code = req.body.code;
        }
        try {
            let room = await Room.findOne({ code });
            if (!room) {
                return res.status(404).json({ message: "존재하지 않는 방입니다." });
            }
            if (room.players.length === 4) {
                return res.status(409).json({ message: "방이 모두 찼습니다." });
            }
            if (room.gameState !== "waiting") {
                return res.status(409).json({ message: "현재 게임이 진행중인 방입니다." });
            }
            room = await Room.findOneAndUpdate({ code }, { $push: { players: { nickname: nickname, instrument: "none" } } }, { new: true });
            res.status(200).json(room);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },
    matchRoom: async (req, res) => {
        try {
            const availableMatch = await Room.findOne({
                type: "match",
                gameState: "waiting",
                $expr: { $lt: [{ $size: "$players" }, 4] }
            });
            if (availableMatch) {
                req.body.code = availableMatch.code;
                await roomController.joinRoomByCode(req, res);
                return;
            } else {
                req.body.type = "match";
                await roomController.createRoom(req, res);
                return;
            }
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },

    leaveRoom: async (req, res) => {
        const { nickname } = req.headers;
        const { code } = req.body;
        try {
            const currentRoom = await Room.findOneAndUpdate(
                { code },
                { $pull: { players: { nickname: nickname } } },
                { new: true }
            );
            if (currentRoom.players.length === 0) {
                await Room.deleteOne({ code });
                if (req.body.live) {
                    return false;
                }
            } else if (currentRoom.hostName === nickname) {
                currentRoom.hostName = currentRoom.players[0].nickname;
                currentRoom.save();
                io.to(currentRoom.code).emit("hostChanged", currentRoom.hostName);
                if (req.body.live) {
                    return currentRoom;
                }
            }
            if (req.ghost) {
                return;
            }
            if (req.body.live) {
                return currentRoom;
            }
            res.status(200).json({ message: "redirect" });
        } catch (err) {
            res.status(500).json({ message: "Internal Server Error" });
        }
    },

    checkStartGame: async (req, res) => {
        const { code } = req.body;
        const gameRoom = await Room.findOne({ code });
        if (!gameRoom) {
            res.status(404).json({ message: "존재하지 않는 방입니다." });
        }
        try {
            let falseCount = 0;
            for (let i = 0; i < gameRoom.players.length; i++) {
                let user = await User.findOne({ nickname: gameRoom.players[i] });
                if (!user.isReady) {
                    falseCount++;
                }
            }
            if (falseCount != 1) {
                return res.json({ message: "모든 플레이어가 준비를 완료하지 않았습니다." })
            }
            res.status(200).json({ canStart: true });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },

    makeTutorial: async (req, res) => {
        const nickname = req.headers.nickname;
        let code = makeCode();
        if (await Room.findOne({ hostName: nickname })) {
            await Room.deleteOne({ hostName: nickname });
        }
        try {
            const room = new Room({
                code,
                hostName: nickname,
                song: 0,
                type: "tutorial",
                gameState: "waiting"
            });
            await room.save();
            await Room.updateOne(
                { code },
                {
                    $push: {
                        players: {
                            nickname: nickname,
                            instrument: "drum1",
                            isReady: true
                        }
                    }
                });
            res.status(200).json(room);
        } catch (err) {
            console.log(err);
            res.status(500).json({ message: err.message });
        }
    },

    /* Socket */

    getPlayerInfo: async (code) => {
        try {
            const room = await Room.findOne({ code });
            if (room) {
                return room.players;
            } else {
                return false;
            }
        } catch (err) {
            throw err;
        }
    },

    findRoomByPlayerNickname: async (nickname) => {
        return await Room.findOne({ "players.nickname": nickname });
    },
    /* Admin */

    resetRooms: async (req, res) => {
        try {
            await Room.deleteMany({});
            res.status(200).json({ message: "successfully deleted all rooms" })
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }

}

export default roomController
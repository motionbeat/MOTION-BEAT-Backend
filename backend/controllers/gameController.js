import {io} from "../utils/socket.js";
import Room from "../schemas/roomSchema.js";
import Game from "../schemas/gameSchema.js";
import User from "../schemas/userSchema.js";
import roomController from "./roomController.js";
import mongoose from "mongoose";

// Controller method to start a game
const gameController = {
    startGame: async (req, res) => {
        const { code } = req.body;
        try {
            const room = await Room.findOne({code});
            if (!room) {
                return res.status(404).json({ error: 'Room not found' });
            }

            const players = room.players.map(playerId => ({
                nickname: playerId,
                score: 0
            }));

            const game = new Game({
                code,
                song: room.song, 
                gameState : "playing",
                players           
            });
            await game.save();
            room.gameState = "playing";
            await room.save();            
            io.emit("gameStarted",  { code });
            res.status(200).json(game);
        } catch (error) {
            console.error('Error starting game:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}

export default gameController;
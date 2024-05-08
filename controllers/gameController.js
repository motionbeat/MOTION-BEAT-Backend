import {io} from "../utils/socket.js";
import Room from "../schemas/roomSchema.js";
import Game from "../schemas/gameSchema.js";
import User from "../schemas/userSchema.js";
import Ranking from "../schemas/rankingSchema.js";

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

            const game = new Game({
                code: code,
                song: room.song, 
                gameState : "playing",
                players : room.players 
            });
            await game.save();
            room.gameState = "playing";
            await room.save();
            io.emit(`gameStarted${code}`,  game);

            res.status(200).json(game);
        } catch (error) {
            console.error('Error starting game:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    gameFinished: async(req, res)=>{
        const { code } = req.body;
        const { nickname } = req.headers
        try{
            const game = await Game.findOneAndUpdate(
                { code },
                { $set: { gameState: "finished" } },
                { new: true }
            );
            if (!game){
                console.log("NO GAME");
            }
            if (nickname.recentlyPlayed.length > 4){
                await User.updateOne({ nickname }, { $pull: { recentlyPlayed: nickname.recentlyPlayed[0] } });
            }
            await User.updateOne({ nickname }, { $push: { recentlyPlayed: game.song } });
            const myRanking = new Ranking({

            })
            res.status(200).json(game);
        } catch(err){
            console.error('Error finishing game', err);
            res.status(500).json({error: 'Internal server error'})
        }
    },
    leaveGame: async(req, res)=>{
        const { code } = req.body
        const { nickname } = req.headers
        try{
            const game = await Game.findOne({code});
            if (game){
                const currentGame = await Game.findOneAndUpdate({code}, { $pull: { players: { nickname } }}, {new: true});
                if (game.players.length === 0){
                    Game.deleteOne({code});
            //         if (req.body.live){
            //             return false;
            //         }
                }
            }
            // if (req.body.live){
            //     return currentGame;
            // }
            // return;
            res.status(200).json({message:"Successfully ended"});
        } catch (err) {
            res.status(500).json({error: 'Internal server error'})
        }
    },

        /* Admin */

    resetGames: async(req, res)=>{
        try{
            await Game.deleteMany({});
            res.status(200).json ({message: "successfully deleted all rooms"})
        } catch (err) {
            res.status(500).json({message: err.message });
        }
    }
}

export default gameController;
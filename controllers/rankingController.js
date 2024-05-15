import Ranking from "../schemas/rankingSchema.js";
import Song from "../schemas/songSchema.js";
import mongoose from "mongoose";


const rankingController = {
    getRankingBySong: async (req, res)=>{
        const title = req.params.title
        try{
            const rankings = await Ranking.find({ title });
            res.status(200).json(rankings);
        } catch (err) {
            console.log(err);
            res.status(500).json({message: err.message});
        }
    },
    saveRanking: async(game) => {
        try {
            const song = await Song.findOne({number: game.song});
            const totalScore = game.players.reduce((total, player) => total + player.score, 0);
            const newRanking = new Ranking({
                title: song.title,
                number: game.song,
                players: game.players,
                totalScore
            })
            await newRanking.save()
            return;
        } catch (err) {
            console.error(err);
            throw err;
        }
    }
}

export default rankingController
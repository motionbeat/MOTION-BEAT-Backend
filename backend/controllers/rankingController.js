import Ranking from "../schemas/rankingSchema.js";
import mongoose from "mongoose";

const rankingController = {
    getRankingBySong: async (req, res)=>{
        const title = req.params.title
        try{
            const rankings = await Ranking.find({ title });
            res.json(rankings);
        } catch (err) {
            console.log(err);
            res.status (500).json({message: err.message});
        }
    },
    getRankingByInstrument: async (req, res) =>{
        try{
            const instRankings = await Ranking.find({ title: req.params.title , instrument: req.params.instrument});
            res.json(instRankings);
        } catch (err) {
            console.log(err);
            res.status(500).json({message:err.message});
        }
    }
}

export default rankingController
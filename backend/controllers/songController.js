import Song from "../schemas/songSchema.js";
import User from "../schemas/userSchema.js";
import userController from "./userController.js";
import mongoose from "mongoose";

const songController = {
    getAllSongs: async (req, res)=>{
        try{
            const songs = await Song.find({});
            res.status(200).json(songs);
        } catch (err) {
            console.log(err);
            res.status (500).json({message: err.message});
        }
    },

    getSongById: async(req, res) =>{
        try{
            const song = await Song.findById(req.params.id);
            if(song){
                res.json(song);
            } else {
                res.status(404).json({message: "곡을 찾을 수 없습니다."});
            }
        } catch (err) {
            console.log(err);
            res.status(500).json({message: err.message});
        }
    },

    getSongByDifficulty: async (req, res) =>{
        try {
            const songs = await Song.find({ difficulty: req.params.difficulty })
            if(songs){
                res.json(songs);
            } else {
                res.json({message: "없음"});
            }
        } catch  (err) {
            res.status(500).json({ message : err.message })
        }
    },
    updateFavorite: async(req,res)=>{
        try{
            const favSong = await Song.findOne({title: req.params.title});
            const currentUser = await User.findById(req.userId);
            if (currentUser.favorite.includes(favSong._id)){
                User.updateOne({ _id: req.userId }, {$pull : {favorite: favSong._id}})
            } else {
                User.updateOne({ _id: req.userId }, {$push : {favorite: favSong._id}})
            }
            res.status(200).json({ message: `${req.params.title}이(가) 즐겨찾기에 추가되었습니다.`})
        } catch(err){
            res.status(500).json({ message : err.message })
        }
    },
    getFavoriteSongs: async (req, res) =>{
        try {
            // const currentPlayer = await User.find({ _id: req.session.user_id });
            const currentPlayer = await User.findById(req.userId);
            const showSongs = currentPlayer.favorite;
            let favoriteList = [];
            for(let i = 0; i <= showSongs.length; i++){
                let foundSong = Song.find({title:showSongs[i]})
                favoriteList.push(foundSong);
            }
            res.send(favoriteList); // change to res.json after
        } catch (err) {
            res.status(500).json({ message : err.message })
        }
    }
}

export default songController
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

    getSongByNumber: async(req, res) =>{
        try{
            const song = await Song.findOne({number: req.params.number});
            if(song){
                res.status(200).json(song);
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
            const currentUser = await User.findById(req.headers.userid);
            if (currentUser.favorite.includes(favSong._id)){
                User.updateOne({ nickname:currentUser.nickname }, {$pull : {favorite: favSong.number}})
            } else {
                User.updateOne({ nickname:currentUser.nickname }, {$push : {favorite: favSong.number}})
            }
            res.status(200).json({ message: `${req.params.title}이(가) 즐겨찾기에 추가되었습니다.`})
        } catch(err){
            res.status(500).json({ message : err.message })
        }
    },
    getFavoriteSongs: async (req, res) =>{
        try {
            const currentUser = await User.findById(req.headers.userid);
            console.log(currentUser);
            if (!currentUser) {
                return res.status(404).json({ message: "User not found" });
            }
            
            const favList = await Song.find({ title: {$in: currentUser.favorite} });

            res.json(favList);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },
    addSong: async(req, res) =>{
        const { number, title, artist, imagePath, runtime, difficulty } = req.body;
        let isValid = await Song.findOne({ title, artist })
        if(isValid){
            return res.status(409).json({message: "이 곡은 이미 등록되어 있습니다."});
        } 
        try{
            const newSong = new Song({ number, title, artist, imagePath, runtime, difficulty });
            await newSong.save();
            res.status(201).json({ message: "곡 등록 성공"});
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },
    randomSong: async (req, res)=>{
        try{
            const docCount = await Song.countDocuments()
            const randomValue = Math.floor(Math.random() * docCount);
            const randomSong = await Song.findOne({number: randomValue});
            // res.status(200).json(randomSong);
            return randomSong;
        } catch (err) {
            throw err;
        }
    },
    addRecentSong: async (req, res)=>{
        const songNumber = req.body;
        const nickname = req.headers;
        try{
            const song = Song.findOne({number: songNumber});
            const currentUser = User.findOne({nickname});
            currentUser.recentlyPlayed.unshift(song.title);
            if (currentUser.recentlyPlayed.length > 5){
                currentUser.recentlyPlayed.pop();
            }
            res.status(200).json({message: "성공적으로 노래를 등록했습니다."});
        } catch (err) {
            res.status(500).json({message: err.message});
        }
    }
}

export default songController
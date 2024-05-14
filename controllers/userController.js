import {io} from "../utils/socket.js";
import User from "../schemas/userSchema.js";
import Room from "../schemas/roomSchema.js";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import session from "express-session";
import jwt from "jsonwebtoken";
import dotenv from "dotenv"
dotenv.config();

async function getUserBySocketId(socketId) {
    return await User.findOne({socketId: socketId});
}

const userController = {
    getAllUsers: async (req, res)=>{
        try{
            const users = await User.find({});
            res.status(200).json(users);
        } catch (err) {
            console.log(err);
            res.status (500).json({message: err.message});
        }
    },

    getUser: async (req, res) =>{
        const { _id } = req.body;
        try{
            const user = await User.find({_id});
            res.status(200).json(user);
        } catch (err) {
            console.log(err);
            res.status(500).json({message: err.message});
        }
    },
    
    getAllFriends: async (req,res) =>{
        try {
            const currentUser = await User.findById(req.headers.userid);
            const friendNicknames = currentUser.friends;
            const friendsOnlineStatus = await User.find(
                { nickname: { $in: friendNicknames } },
                { nickname: 1, online: 1, _id: 0 }
            );
            const friendsWithStatus = friendNicknames.map(nickname => {
                const friendStatus = friendsOnlineStatus.find(friend => friend.nickname === nickname);
                const online = friendStatus ? friendStatus.online : false;
                return { nickname, online };
            });
    
            res.json(friendsWithStatus);
        } catch (err) {
            console.log(err);
            res.status(500).json({message: err.message});
        }
    },
    getRecentSongs: async(req, res)=>{
        const {nickname} = req.headers;
        try{
            const currentUser = await User.findOne({nickname});
            const recentSongs = await currentUser.populateRecentSongs();
            res.status(200).json(recentSongs)
        } catch (err) {
            res.status(500).json({message: err.message});
        }
    },
    createUser: async (req, res) =>{
        const { email, nickname, pw } = req.body;
        let isValid = await User.findOne({ email })
        if(isValid){
            return res.status(409).json({message: "이 이메일은 사용할 수 없습니다."});
        } 
        isValid = await User.findOne({ nickname })
        if(isValid) {
            return res.status(409).json({message: "이 이름은 사용할 수 없습니다."});
        }

        try{
            const newUser = new User({ email, nickname, pw });
            await newUser.save();
            res.status(201).json({ message: "회원가입 성공"});
        } catch (err) {
            console.log(err);
            return res.status(400).json({ message: err.message});
        }
    },

    loginUser: async (req,res) =>{
        const {email, pw} = req.body;
        try{
            const userPromise = User.findOne({ email });
            const validatePromise = User.findAndValidate(email, pw);
            const [loginUser, validate] = await Promise.all([userPromise, validatePromise]);
            if(!loginUser || !validate){
                return res.status(404).json({message:"잘못된 정보입니다."});
            }
            const jwtoken = jwt.sign(
                { id: loginUser._id, email: loginUser.email },
                process.env.JWT_SECRET,
                { expiresIn: "1h" }
            );
            loginUser.token = jwtoken;
            loginUser.online = true;
            loginUser.isReady = false;
            await loginUser.save()
            res.status(200).json({message: "로그인 성공!", jwtoken, userId: loginUser._id, nickname: loginUser.nickname })
        } catch(err) {
            res.status(500).json({message: err.message});
        }
    },
    logoutUser: async (req, res)=>{
        const currentUser = await User.findById(req.headers.userid);
        currentUser.online = false;
        currentUser.token = null;
        try{
            await currentUser.save();
            io.emit('userStatus', { nickname: currentUser.nickname, online: false });
            res.status(200).json({message: "로그아웃 성공!"});
        } catch (err) {
            res.status(500).json({message : err.message});
        }
    },

    changeSettings: async(req, res)=>{
        const {nickname} = req.headers;
        const { lobbyVolume, buttonVolume, gameVolume } = req.body;
        try {
            const user = await User.findOneAndUpdate(
                {nickname},
                { $set: { lobbyVolume, buttonVolume, gameVolume } },
                { new: true }
            );
        } catch (err){
            res.status(500).json({message:err.message});
        }
    },

    /* Socket */

    loginUserAndUpdateSocketId: async(sid, nickname) =>{
        return await User.findOneAndUpdate(
            { nickname },
            { $set: { socketId : sid, online: true } },
            { new: true }
        );
    },
    checkUser: async (sid) => {
        const user = await getUserBySocketId(sid);
        if (!user) throw new Error("user not found");
        return user;
    },
    toggleReady: async(sid)=>{
        const user = await getUserBySocketId(sid);
        if (!user) throw new Error("user not found");
        user.isReady = !user.isReady;
        await user.save();
        await Room.findOneAndUpdate(
            { "players.nickname": user.nickname }, 
            { $set: { "players.$.isReady": user.isReady } }, 
        );
    
        return user;
    },
}

export default userController
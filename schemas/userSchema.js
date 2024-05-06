import mongoose from "mongoose";
import { compare, hash } from "bcrypt";

const userSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique: true
    },
    nickname:{
        type:String,
        required:true,
        maxlength: 15,
        unique: true,        
    },
    pw:{
        type:String,
        required:true,
        minlength: 6
    },
    token: {

    },
    online: {
        type: Boolean,
        default: false
    },
    favorite: {
        type: Array,
        default: []
    },
    recentlyPlayed: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Song'
    }],
    friends: {
        type: Array,
        default: []
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    socketId: {
        type: String,
    },
    isReady: {
        type: Boolean,
        default: false
    },
    settings: {
        lobbyVolume: {
            type: Number,
            default: 50
        },
        buttonVolume: {
            type: Number,
            default: 50   
        },
        gameVolume: {
            type: Number,
            default: 50
        }
    },
    instrument: {
        type: String,
        ref: "Instrument"
    }
});

userSchema.statics.findAndValidate =  async function (email, pw){
    const foundUser = await this.findOne({ email });
    const validate = await compare(pw, foundUser.pw);
    return validate? foundUser : false; 
}

userSchema.pre("save", async function(next){
    if (!this.isModified("pw")) return next();
    this.pw = await hash(this.pw, 12);
    console.log(this);
    next();
})

userSchema.methods.populateRecentSongs = async function () {
    await this.populate('recentlyPlayed').execPopulate();
};

export default mongoose.model("User", userSchema);
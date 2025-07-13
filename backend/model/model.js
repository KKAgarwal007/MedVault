import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    Height:{
        type:String,
        default: "5 8"
    },
    Weight:{
        type: String,
        default: "70"
    },
    BG:{
        type: String,
        default: "O+"
    }
},{timestamps:true})

const User = mongoose.model("User",userSchema);
export default User;
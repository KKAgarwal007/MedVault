import e from "express";
import User from "../model/model.js";
import bcryptjs from 'bcryptjs';
import getToken from "../config/token.js";

export const SignUp = async (req, res) =>{
    try {
        let {email, password} = req.body;
        if(!email || !password){
            return res.status(400).json({message: "please send all details"});
        } 
        let existUser = await User.findOne({email});
        if(existUser){
            return res.status(400).json({message: "User already exists"});
        }
        let hashpassword = await bcryptjs.hash(password,10);
        let user = await User.create({
            email,
            password:hashpassword
        })
        let token = await getToken(user._id);
        res.cookie("token",token,{
            httpOnly: true,
            sameSite: "strict",
            maxAge: 7*24*60*60*1000,
            secure: process.env.STATUS == "production"
        })
        return res.status(200).json({message: user});
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: "internal server error"});
    }
}


export const Login = async (req, res)=>{
    try {
        let {email, password} = req.body;
        let existUser = await User.findOne({email});
        if(!existUser){
            return res.status(400).json({message: "user does not exist"});
        }
        let compare = await bcryptjs.compare(password,existUser.password);
        if(!compare){
            return res.status(400).json({message:"incorrect password"});
        }
        let token = await getToken(existUser._id);
        res.cookie("token",token,{
            httpOnly: true,
            sameSite: "strict",
            maxAge: 7*24*60*60*1000,
            secure: process.env.STATUS == "production"
        })
        return res.status(200).json({message: existUser});
    } catch (error) {
       console.log(error);
        return res.status(500).json({message: "internal server error"});
    }
}

export const LogOut = async (req, res)=>{
    try{
        res.clearCookie("token");
        return res.status(200).json({message: "Log out successfully"});
    }
    catch (error) {
       console.log(error);
        return res.status(500).json({message: "internal server error"});
    }
}

export const getUserData = async (req, res) =>{
    try{
        let id = req.userId;
        if(!id){
            return res.status(400).json({message:"userid is not get"});
        }
        let user = await User.findById(id);
        if(!user){
            return res.status(400).json({message: "user does not exist"});
        }
        return res.status(200).json({message:user});
    }
    catch(error){
        console.log(error);
        return res.status(500).json({message: "auth error"});
    }
}

export const UpdateUser = async(req, res)=>{
    try{
        let {Height, Weight, BG} = req.body;
    if(!Height || !Weight || !BG){
        return res.status(400).json({message: "provide user details"});
    }
    let user = await User.findByIdAndUpdate(req.userId,{Height, Weight, BG}).select('-password');
    if(!user){
        return res.status(400).json({message: "user details not updated"});
    }
    let newUser = await User.findById(req.userId).select('-password');
    return res.status(200).json({message: newUser});

    }catch(error){
        console.log(error);
        return res.status(500).json({message: "server error"});
    }
}
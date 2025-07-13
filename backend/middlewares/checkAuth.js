import { json } from 'express';
import jwt from 'jsonwebtoken';

const checkAuth = async(req, res, next)=>{
    try{
        let {token} = req.cookies;
    if(!token){
        return res.status(400).json({message: "User does not have token"});
    }
    let verifyToken = jwt.verify(token,process.env.JWT_SECRET);
    if(!verifyToken){
        return res.status(400).json({message: "User does not have valid token"});
    }
    req.userId = verifyToken.userId;

    next();
    }catch(error){
        console.log(error);
        return res.status(500).json({message: "internal server error"});
    }
}

export default checkAuth
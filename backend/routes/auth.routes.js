import express from 'express';
import { getUserData, Login, LogOut, SignUp, UpdateUser } from '../controllers/controllers.js';
import checkAuth from '../middlewares/checkAuth.js';

const userRouter = express.Router();

userRouter.post("/signup",SignUp);
userRouter.post("/login",Login);
userRouter.get("/logout",LogOut);
userRouter.get("/getuserdata",checkAuth,getUserData)
userRouter.put("/getdetails",checkAuth,UpdateUser)

export default userRouter;


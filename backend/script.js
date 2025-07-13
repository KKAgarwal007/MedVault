import express from 'express';
import dotenv from 'dotenv';
import connectdb from './config/db.js';
import userRouter from './routes/auth.routes.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
dotenv.config();

const app = express();
app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin:"https://medvault-frontend-u7i7.onrender.com",
    credentials: true
}))
const port = process.env.PORT || 5000
app.use("/auth",userRouter);
app.listen(port, ()=>{
    console.log("The server has been started at port",port);
    connectdb();
})

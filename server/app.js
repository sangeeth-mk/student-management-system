import mongoose from "mongoose";
import express from "express";
const app = express()
import cors from 'cors';
import authRouter from './routes/authRoute.js';
import connectToDatabase from "./config/config.js";
import dotenv from 'dotenv';
dotenv.config();
connectToDatabase()
const PORT = process.env.PORT || 3007 ;

app.use(cors())
app.use(express.json())
app.use('/api/auth',authRouter)

app.listen(PORT,()=>{
    console.log(`app is running at http://localhost:${PORT}`)
})





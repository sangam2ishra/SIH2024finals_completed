import  express  from "express";
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoute from "./routes/userRoute.js";
import authRoute from "./routes/authRoute.js";

import bookingRoute from './routes/bookingRoute.js';
import paymentRoute from './routes/paymentRoute.js';
import notificationRoute from './routes/notificationRoute.js';
import parcelNotificationRoute from './routes/parcelNotificationRoute.js';
import parcelRoute from './routes/parcelRoute.js';
import nodeRoute from './routes/nodeRoutes.js';

// import pdfDetailsRoute from './routes/pdfDetailsRoute.js';
import multer from "multer";
import PdfDetails from "./models/pdfDetails.js";

import cookieParser from 'cookie-parser';
import path from 'path';
import Razorpay from "razorpay";
dotenv.config();

const url=process.env.MONGO;
mongoose.connect("mongodb+srv://hexcodesih:826uZjDSY73lRLcW@cluster0.muwjo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0").then(()=>{
    console.log("connected to data base");
    console.log("Connected to mogodb successfully");
})
.catch((err)=>{
    console.log(err);
})
const __dirname = path.resolve();

const app=express();


app.use(express.json());
app.use(express.urlencoded({ extended: true })); // For parsing URL-encoded bodies
app.use(express.static(path.join(__dirname,'/client/dist')))
app.use(cookieParser());

  app.get('/api/pay/get-key',(req,res)=>{
    // console.log("ghgh");
    console.log({key:process.env.RAZORPAY_API_KEY});
    res.status(200).json({key:process.env.RAZORPAY_API_KEY});
})


// app.use("/api/test", ()=>console.log("HI  sih ki ma ki ankh------------"));

app.use("/api/user",userRoute);
app.use("/api/auth",authRoute);
app.use("/api/bus",bookingRoute);
app.use("/api/pay",paymentRoute);
app.use("/api/send",notificationRoute);
app.use("/api/parcel", parcelRoute);
app.use("/api/nodes", nodeRoute);
app.use("/api/parcelNotification", parcelNotificationRoute);
// app.use("/api/chat",chatbotRoute);
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
  });

// app.use('/api/pdf',pdfDetailsRoute);

app.use((err,req,res,next)=>{
    const statusCode=err.statusCode||500;
    const message=err.message||'Internal Server Error';
    res.status(statusCode).json({
        success:false,
        statusCode,
        message,
    });
});
app.listen(3000,()=>{
    console.log("App is listening on port 3000");
})

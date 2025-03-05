import  express from "express";
import { google, signin, signin1, signup } from "../controllers/authController.js";

const router=express.Router();
router.post('/signup',signup);
router.post('/signin',signin);
router.post('/signin1',signin1);
router.post('/google',google);

export default router;
import express from "express";
import { getAllNotifications } from "../controllers/parcelNotificationController.js"

const router = express.Router();
router.post('/getAllNotifications', getAllNotifications);

export default router;

import express from "express";
import { sendNotification } from "../controllers/notificationController.js";
import User from "../models/userModel.js";

const router = express.Router();

router.get('/notify-all', async (req, res) => {
    console.log("mnq");
    try {
        console.log("jkl");
        const users = await User.find();
        const userIds = users.map(user => user._id);
        const message = "There is some schedule update Please Visit the Campus Cruisers for more Update";
        await sendNotification({ userIds, message });
        console.log("success");
        res.status(200).json({ success: true, message: "Notifications sent successfully" });
    } catch (error) {
        console.error("Error sending notifications:", error);
        res.status(500).json({ success: false, error: "Failed to send notifications" });
    }
});

export default router;

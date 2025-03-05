import Booking from "../models/bookingModel.js";
import User from "../models/userModel.js";
import { sendNotification } from "./notificationController.js";
import { errorHandler } from './../utilis/error.js';


export const createBooking = async (req, res,next) => {
    console.log('Book request');
  const { userId, busNo, date, source, destination, paymentType } = req.body;
   console.log(req.body);
  try {
    // Check if the user exists
    const existingUser = await User.findById(userId);
    if (!existingUser) {
      return next(errorHandler(404, 'You are not allowed to update this user'));
    }

    // Check if the number of bookings for the bus on the specified date exceeds 100
    const existingBookingCount = await Booking.countDocuments({ busNo, date });
    if (existingBookingCount >= 100) {
        return next(errorHandler(404, 'No seats available'));
    }

    // If the user is a faculty and paymentType is PayLater, increment payment dues
    if (existingUser.accountType === "faculty" && paymentType === "PayLater") {
      existingUser.paymentDues += 50;
      await existingUser.save(); // Save updated user details
    }

    const bookings = new Booking({
      user: userId,
      busNo,
      date,
      source,
      destination,
    });

    await bookings.save();

    const message =`You have successfully made a booking for the bus ${busNo} from ${source} to ${destination} on ${date}`;

    // Send notification to the user
   await sendNotification({ userIds: [userId], message });

    return res.status(201).json({ message: "Booking created successfully", bookings });
  } catch (error) {
    console.error("Error creating booking:", error);
    return next(errorHandler(500, 'Internal Server Error: Unable to create booking'));
  }
};
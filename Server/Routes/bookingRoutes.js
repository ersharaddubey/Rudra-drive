import express from "express";
import { protect } from "../middleware/auth.js";
import { checkCarAvailability, createBooking, getUserBookings, getOwnerBookings, changeBookingStatus } from "../Controller/bookingController.js";

const bookingRouter = express.Router();

bookingRouter.post('/check-availability', protect, checkCarAvailability);
bookingRouter.post('/create', protect, createBooking);
bookingRouter.get('/user', protect, getUserBookings);
bookingRouter.get('/owner', protect, getOwnerBookings);
bookingRouter.post('/change-status', protect, changeBookingStatus);


export default bookingRouter;
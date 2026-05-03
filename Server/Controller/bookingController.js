/**
 * Booking Controller
 * Handles car booking operations, availability checking, and booking management
 * Endpoints: checkCarAvailability, createBooking, getUserBookings, getOwnerBookings, changeBookingStatus
 */

import Booking from "../Models/booking.js";
import Car from "../Models/Car.js";
import User from "../Models/user.js";

// Function to Check Availability

const checkAvailability = async (car, pickupDate, returnDate) => {
    const bookings = await Booking.find({
        car, 
        status: {$ne: "cancelled"}, // Exclude cancelled bookings
        pickupDate: {$lte: returnDate}, 
        returnDate: {$gte: pickupDate}});
   return bookings.length === 0;
}

// API to Check Availability of cars for the Given date and Location

export const checkCarAvailability = async (req, res) => {
    try {
        const {location, pickupDate, returnDate} = req.body;

        // Fetch all cars for the given location
        const cars = await Car.find({location, isAvailable:true});

        // Chcek car Availability for Given Date using Promis
        const availableCarsPromises = cars.map(async(car)=>{
            const isAvailable = await checkAvailability(car._id, pickupDate, returnDate);
            return {...car._doc, isAvailable: isAvailable};
        })
      
        let availableCars = await Promise.all(availableCarsPromises);
        availableCars = availableCars.filter(car=>car.isAvailable === true);

        res.json({success:true, availableCars});
    } catch (error) {
        console.log(error.message);
       res.json({success:false, message:error.message});
    }
}

// API to Book a Car

export const createBooking = async (req, res) => {
    try {
        const {_id} = req.user;
        const {car, pickupDate, returnDate} = req.body;
        
        const isAvailable = await checkAvailability(car, pickupDate, returnDate);
        if(!isAvailable){
            return res.json({success:false, message:"Car is not available for the given date"});
        }

        const carData = await Car.findById(car);
        const { tripType } = req.body; // Expecting tripType from frontend
        if (!carData) return res.json({ success: false, message: "Car not found" });

        // Dynamic Price Calculation
        const picked = new Date(pickupDate);
        const returned = new Date(returnDate);
        const numberOfDays = Math.ceil((returned - picked) / (1000 * 60 * 60 * 24)) || 1;
        
        let totalAmount = tripType === "Outstation" 
            ? numberOfDays * (carData.minKmPerDay || 300) * carData.outstationRate 
            : numberOfDays * carData.localPackagePrice;

        await Booking.create({
            car,
            user: _id,
            owner: carData.owner,
            pickupDate,
            returnDate,
            totalAmount,
        })
        res.json({success:true, message:"Booking created successfully"});
    } catch (error) {
        console.log(error.message);
       res.json({success:false, message:error.message});
    }
}
 
// API to list User Booking

export const getUserBookings = async (req, res) => {
    try {
        const {_id} = req.user;
        const bookings = await Booking.find({user:_id}).populate("car").sort({createdAt:-1});
        res.json({success:true, bookings});
    } catch (error) {
        console.log(error.message);
       res.json({success:false, message:error.message});
    }
}


// Owner to Get Owner Bookings

export const getOwnerBookings = async (req, res) => {
    try {
        if(req.user.role !== "owner"){
            return res.json({success:false, message:"You are not authorized to get owner bookings"});
        }
        const bookings = await Booking.find({owner:req.user._id}).populate("car user").select('-user.password').sort({createdAt:-1});
        res.json({success:true, bookings});
    } catch (error) {
        console.log(error.message);
       res.json({success:false, message:error.message});
    }
}

// Change Booking Status

export const changeBookingStatus = async (req, res) => {
    try {
        const {_id} = req.user;
        const {bookingId, status} = req.body;
        const booking = await Booking.findById(bookingId);
        if(booking.owner.toString() !== _id.toString()){
            return res.json({success:false, message:"You are not authorized to change this booking status"});
        }
        booking.status = status;
        await booking.save();
        res.json({success:true, message:"Booking status changed successfully"});
    } catch (error) {
        console.log(error.message);
       res.json({success:false, message:error.message});
    }
}

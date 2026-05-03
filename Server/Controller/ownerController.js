import User from "../Models/user.js";
import mongoose from "mongoose"; // Import mongoose for ObjectId validation
import Car from "../Models/Car.js";
import fs from "fs";
import imageKit from "../config/imageKit.js";
import Booking from "../Models/booking.js";

export const registerOwner = async (req, res) => {
    try {
      const {_id} = req.user;
      await  User.findByIdAndUpdate(_id,{role:"owner"});
      res.json({success:true, message:"Owner registered successfully"});

    } catch (error) {
        console.log(error.message);
       res.json({success:false, message:error.message});
    }
};

// API to Add Car

export const addCar = async (req, res) => {
    try {
        const {_id} = req.user;
        let car = JSON.parse(req.body.carData);
        const imageFile = req.file;

        if (!imageFile) {
            return res.json({ success: false, message: "Car image is required" });
        }

        const fileBuffer = fs.readFileSync(imageFile.path);
     const response = await imageKit.upload({
            file: fileBuffer,
            fileName: imageFile.originalname,
            folder: "/cars",
        })
       
      
        // URL with basic transformations
        const transformedUrl = imageKit.url({
            path: response.filePath,
            transformation:[
                {width: '1280'},  //Width Resize
                {quality:'auto'}, // Auto quality
                {format: 'webp'}, // Format
            ],
        });
        const image = transformedUrl;

        // Validation: Ensure rates are present
        if (!car.outstationRate || !car.localPackagePrice) {
            return res.json({ success: false, message: "Pricing rates (Outstation/Local) are required!" });
        }

        await Car.create({
            owner: _id,
            ...car,
            image,
            date: Date.now()
        })
        res.json({success:true, message:"Car added successfully"});
        

    } catch (error) {
        console.log(error.message);
       res.json({success:false, message:error.message});
    }
};

// API to Get Car

export const getOwnerCars = async (req, res) => {
    try {
        const {_id} = req.user;
        const cars = await Car.find({owner:_id});
        res.json({success:true, cars});
    } catch (error) {
        console.log(error.message);
       res.json({success:false, message:error.message});
    }
};

// API to Toggle Car Availability

export const toggleCarAvailability = async (req, res) => {
    try {
        const {_id} = req.user;
        const {carId} = req.body;
        const car = await Car.findById(carId);

 
        // Checking is Car Belongs to The Owner
if(car.owner.toString() !== _id.toString()){
    return res.json({success:false, message:"You are not authorized to toggle this car availability"});
}

        car.isAvailable = !car.isAvailable;
        await car.save();
        res.json({success:true, message:"Car availability toggled successfully"});
    } catch (error) {
        console.log(error.message);
       res.json({success:false, message:error.message});
    }
};


// API to Delete Car

export const deleteCar = async (req, res) => {
    try {
        const {_id} = req.user;
        const {carId} = req.body;
        const car = await Car.findById(carId);

        // Checking is Car Belongs to The Owner
if(car.owner.toString() !== _id.toString()){
    return res.json({success:false, message:"You are not authorized to delete this car"});
}

await Car.findByIdAndDelete(carId);

        res.json({success:true, message:"Car Removed"});
    } catch (error) {
        console.log(error.message);
       res.json({success:false, message:error.message});
    }
};

// Api to Get DashBorad Data

export const getDashboardData = async (req, res) => {
    try {
        const {_id, role} = req.user;
        if(role !== "owner"){
            return res.json({success:false, message:"You are not authorized to get dashboard data"});
        }
        const cars = await Car.find({owner:_id});
        const allBookings = await Booking.find({owner:_id}).populate("car").sort({createdAt:-1});
        
        // Filter out bookings with null car references
        const bookings = allBookings.filter(booking => booking.car);

        const pendingBookings = bookings.filter(booking => booking.status === "pending");
        const completedBookings = bookings.filter(booking => booking.status === "confirmed");
        
    //    Calculate Total Earnings
    const monthlyRevenue = bookings.filter(booking => booking.status === "confirmed").reduce((acc, booking) => acc + booking.totalAmount, 0);

    const dashboardData = {
        totalCars: cars.length,
        totalBookings: bookings.length,
        pendingBookings: pendingBookings.length,
        completedBookings: completedBookings.length,
        recentBookings: bookings.slice(0, 3),
        monthlyRevenue,
    }
    res.json({success:true, dashboardData});

    } catch (error) {
        console.log(error.message);
       res.json({success:false, message:error.message});
    }
};

// Api to Update User Image
export const updateUserImage = async (req, res) => {
    try {
        const {_id} = req.user;
        const imageFile = req.file;

        if (!imageFile) {
            return res.json({ success: false, message: "Profile image is required" });
        }

        const fileBuffer = fs.readFileSync(imageFile.path);
     const response = await imageKit.upload({
            file: fileBuffer,
            fileName: imageFile.originalname,
            folder: "/users",
        })
       
      
        // URL with basic transformations
        const transformedUrl = imageKit.url({
            path: response.filePath,
            transformation:[
                {width: '400'},  // Resized to a reasonable profile picture width
                {quality:'auto'}, // Auto quality
                {format: 'webp'}, // Format
            ],
        });
        const image = transformedUrl;
        await User.findByIdAndUpdate(_id,{image});
        res.json({success:true, message:"User image updated successfully"});
    } catch (error) {
        console.log(error.message);
       res.json({success:false, message:error.message});
    }
};

// API to get single car details
export const getCarDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const { _id: ownerId } = req.user;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: "Invalid car ID format." });
        }

        // 1. Find the car first to see if it exists
        const car = await Car.findById(id);

        if (!car) {
            return res.status(404).json({ success: false, message: "Vehicle not found in database." });
        }

        // 2. Check ownership separately for better debugging
        if (car.owner.toString() !== ownerId.toString()) {
            return res.status(403).json({ success: false, message: "Access denied. You do not own this vehicle." });
        }

        res.status(200).json({ success: true, car });
    } catch (error) {
        console.error("Error in getCarDetails:", error.message);
        res.status(500).json({ success: false, message: "Failed to fetch car details due to server error." });
    }
};
// API to update car
export const updateCar = async (req, res) => {
    try {
        const { id } = req.params;
        const { _id: ownerId } = req.user;
        const carData = JSON.parse(req.body.carData);
        const imageFile = req.file;

        const existingCar = await Car.findOne({ _id: id, owner: ownerId });
        if (!existingCar) {
            return res.json({ success: false, message: "Unauthorized or Car not found" });
        }

        let image = existingCar.image;

        if (imageFile) {
            const fileBuffer = fs.readFileSync(imageFile.path);
            const response = await imageKit.upload({
                file: fileBuffer,
                fileName: imageFile.originalname,
                folder: "/cars",
            });
            
            image = imageKit.url({
                path: response.filePath,
                transformation: [
                    { width: '1280' },
                    { quality: 'auto' },
                    { format: 'webp' },
                ],
            });
        }

        await Car.findByIdAndUpdate(id, {
            ...carData,
            image
        });

        res.json({ success: true, message: "Car updated successfully" });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

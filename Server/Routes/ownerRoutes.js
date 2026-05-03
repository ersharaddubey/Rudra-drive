import express from "express";
import { protect } from "../middleware/auth.js";
import { 
    addCar, 
    registerOwner, 
    getOwnerCars, 
    getCarDetails, // New import
    updateCar, // New import
    toggleCarAvailability,
    deleteCar, 
    getDashboardData, 
    updateUserImage 
} from "../Controller/ownerController.js";
import upload from "../middleware/multer.js";

const ownerRouter = express.Router();

// Path: /api/owner/change-role
ownerRouter.post("/change-role", protect, registerOwner);

// Baaki saare routes
ownerRouter.post("/add-car", upload.single("image"), protect, addCar);
ownerRouter.get('/cars', protect, getOwnerCars);
ownerRouter.get('/car/:id', protect, getCarDetails); // New route to get single car details
ownerRouter.put('/update-car/:id', upload.single("image"), protect, updateCar); // New route for updating car
ownerRouter.post('/toggle-availability', protect, toggleCarAvailability);
ownerRouter.post('/delete-car', protect, deleteCar);
ownerRouter.get('/dashboard', protect, getDashboardData);
ownerRouter.post('/update-image', upload.single("image"), protect, updateUserImage);

export default ownerRouter;
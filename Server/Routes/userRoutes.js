import express from "express";
import { 
    registerUser, 
    loginUser, 
    getUserData, 
    getAllCars, 
    registerOwner 
} from "../Controller/userController.js";
import { protect } from "../middleware/auth.js";

const userRouter = express.Router();

// Public Routes
userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.get("/cars", getAllCars);

// Protected Routes
userRouter.get("/data", protect, getUserData);
userRouter.post("/change-role", protect, registerOwner); // Navbar se connected

export default userRouter;
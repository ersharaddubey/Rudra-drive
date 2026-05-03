import userModel from "../Models/user.js";
import Car from "../Models/Car.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

export const registerUser = async (req, res) => {
    try {
        const { name, email, password, phone, role } = req.body;
        const exists = await userModel.findOne({ email });
        if (exists) return res.json({ success: false, message: "User already exists" });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new userModel({ 
            name, 
            email, 
            password: hashedPassword, 
            phone, 
            role: role || 'user',
            isOwner: role === 'owner'
        });
        const user = await newUser.save();

        const token = createToken(user._id);
        res.json({ 
            success: true, 
            token, 
            user: { 
                _id: user._id, name: user.name, email: user.email, role: user.role, isOwner: user.isOwner 
            }, 
            message: "Registered Successfully" 
        });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email });
        if (!user) return res.json({ success: false, message: "User doesn't exist" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
            const token = createToken(user._id);
            res.json({ 
                success: true, 
                token, 
                user: { 
                    _id: user._id, name: user.name, email: user.email, role: user.role, isOwner: user.isOwner 
                }, 
                message: "Login Success" 
            });
        } else {
            res.json({ success: false, message: "Invalid credentials" });
        }
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export const getUserData = async (req, res) => {
    try {
        const user = await userModel.findById(req.user._id).select("-password");
        res.json({ success: true, user });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export const registerOwner = async (req, res) => {
    try {
        const { _id } = req.user;
        await userModel.findByIdAndUpdate(_id, { role: 'owner', isOwner: true });
        res.json({ success: true, message: "Role changed to Owner" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export const getAllCars = async (req, res) => {
    try {
        const cars = await Car.find({ isAvailable: true });
        res.json({ success: true, cars });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};
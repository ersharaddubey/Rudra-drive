import jwt from "jsonwebtoken";
import User from "../Models/user.js";

export const protect = async (req, res, next) => {
    let token = req.headers.token || req.headers.authorization;

    if (!token) {
        return res.json({ success: false, message: "Not Authorized. Login Again." });
    }

    if (token.startsWith("Bearer ")) {
        token = token.split(" ")[1];
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        const user = await User.findById(decoded.id).select("-password");
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        req.user = user;
        next();
    } catch (error) {
        res.json({ success: false, message: "Session Expired" });
    }
};
import express from "express";
import "dotenv/config";
import cors from "cors";
import connectDB from "./config/db.js";

// Routes Import
import userRouter from "./Routes/userRoutes.js";
import ownerRouter from "./Routes/ownerRoutes.js";
import bookingRouter from "./Routes/bookingRoutes.js";

// Initialize app
const app = express();

// --- Database Connection ---
// Top-level await for MongoDB
try {
    await connectDB();
    console.log("✅ Database Connected Successfully");
} catch (error) {
    console.error("❌ Database Connection Failed:", error.message);
    process.exit(1); // Server ko stop kar dega agar DB nahi mila
}

// --- Middlewares ---
app.use(cors());
app.use(express.json()); // Body parser

// --- API Routes ---
app.use('/api/user', userRouter);
app.use('/api/owner', ownerRouter);
app.use('/api/bookings', bookingRouter);

// Base Route
app.get("/", (req, res) => {
    res.status(200).send("RudraDrive API is running and healthy");
});

// --- 404 Handler ---
// Agar koi galat URL hit kare toh
app.use((req, res) => {
    res.status(404).json({ success: false, message: "Route not found" });
});

// --- Global Error Handling Middleware ---
app.use((err, req, res, next) => {
    console.error("Internal Error Stack:", err.stack);
    res.status(err.status || 500).json({ 
        success: false, 
        message: err.message || 'Something went wrong on the server!' 
    });
});

// --- Server Startup ---
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
import express from "express";
import "dotenv/config";
import cors from "cors";
import connectDB from "./config/db.js";

// Routes Import
import userRouter from "./Routes/userRoutes.js";
import ownerRouter from "./Routes/ownerRoutes.js";
import bookingRouter from "./Routes/bookingRoutes.js";

const app = express();

// --- Database Connection ---
// Vercel serverless environment mein DB connection manage karna
let isConnected = false;
const connectToDatabase = async () => {
    if (isConnected) return;
    try {
        await connectDB();
        isConnected = true;
        console.log("✅ Database Connected Successfully");
    } catch (error) {
        console.error("❌ Database Connection Failed:", error.message);
    }
};

// --- Middlewares ---
app.use(cors({
    origin: ["https://rudra-drive.vercel.app", "http://localhost:5173"], 
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true
}));
app.use(express.json());

// Har request par DB connection ensure karein (Serverless nature ke liye)
app.use(async (req, res, next) => {
    await connectToDatabase();
    next();
});

// --- API Routes ---
app.use('/api/user', userRouter);
app.use('/api/owner', ownerRouter);
app.use('/api/bookings', bookingRouter);

// Base Route
app.get("/", (req, res) => {
    res.status(200).send("RudraDrive API is running and healthy");
});

// --- 404 Handler ---
app.use((req, res, next) => {
    res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// --- Global Error Handling ---
app.use((err, req, res, next) => {
    res.status(err.status || 500).json({ 
        success: false, 
        message: err.message || 'Internal Server Error' 
    });
});

// Local development ke liye listen karein, Vercel ise ignore karega
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`🚀 Server running locally on port: ${PORT}`);
    });
}

export default app;
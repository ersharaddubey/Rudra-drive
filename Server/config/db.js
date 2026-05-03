import mongoose from "mongoose";

const connectDB = async () => {
    try {
        // Event listener connect hone se pehle setup karein
        mongoose.connection.on('connected', () => {
            console.log('✅ MongoDB connected successfully');
        });

        mongoose.connection.on('error', (err) => {
            console.error('❌ MongoDB connection error:', err);
        });

       // db.js mein change karein
            const uri = process.env.MONGO_URI; 

            if (!uri) {
                console.error("❌ MONGO_URI is missing in Vercel Environment Variables");
                return; // process.exit(1) ki jagah return use karein
            }

            await mongoose.connect(uri, {
                serverSelectionTimeoutMS: 5000, // 5 seconds mein timeout
            });
                    
    } catch (error) {
        console.error("❌ MongoDB connection error:", error.message);
        process.exit(1); // Error aane par process stop kar dein
    }
};

export default connectDB;
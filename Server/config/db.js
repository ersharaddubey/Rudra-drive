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

        // DHAYAN DEIN: .env mein variable name MONGO_URI hai, toh wahi yahan likhein
        const uri = process.env.MONGO_URI; 

        if (!uri) {
            throw new Error("MONGO_URI is not defined in .env file");
        }

        // Agar aapne .env mein database name nahi likha hai, toh yahan add kar sakte hain
        await mongoose.connect(`${uri}`);
        
    } catch (error) {
        console.error("❌ MongoDB connection error:", error.message);
        process.exit(1); // Error aane par process stop kar dein
    }
};

export default connectDB;
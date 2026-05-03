import mongoose from "mongoose";

const carSchema = new mongoose.Schema({
    brand: { type: String, required: true },
    model: { type: String, required: true },
    category: { type: String, enum: ['SUV', 'Sedan'], required: true }, // Restricted categories
    year: { type: String, required: true },
    image: { type: String, required: true },
    fuel_type: { type: String, required: true },
    transmission: { type: String, required: true },
    seat_capacity: { type: Number, required: true },
    location: { type: String, required: true },
    
    // --- New Pricing & Logic Fields ---
    pricingModel: { 
        type: String, 
        enum: ['Outstation', 'Local'], 
        default: 'Outstation' 
    },
    basePrice: { 
        type: Number, 
        required: true 
    }, // Outstation ke liye 16, Local ke liye 2500
    minKm: { 
        type: Number, 
        default: 300 
    }, // Sirf Outstation ke liye kaam aayega
    
    description: { 
        type: String, 
        required: true 
    }, // Sirf features/rules ke liye
    
    isAvailable: { type: Boolean, default: true },
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'owner', required: true },
    date: { type: Number, required: true }
}, { minimize: false });

const carModel = mongoose.models.car || mongoose.model("car", carSchema);
export default carModel;
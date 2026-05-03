import mongoose from "mongoose";


const{ObjectId} = mongoose.Schema.Types;

const carSchema = new mongoose.Schema({
    owner:{type:ObjectId, ref:"User"},
   brand:{type:String, required:true},
    model:{type:String, required:true},
    year:{type:Number, required:true},
    image:{type:String, required:true},
    category:{type:String, required:true},
    seat_capacity:{type:String, required:true},
    fuel_type:{type:String, required:true},
    transmission:{type:String, required:true},
   basePrice:{type:Number, required:false},
   outstationRate: { type: Number, required: true },
   localPackagePrice: { type: Number, required: true },
   minKmPerDay: { type: Number, default: 300 },
   pricingModel: { type: String, enum: ['Outstation', 'Local'], default: 'Outstation' }, // Keeping for compatibility
   description:{type:String, required:true},
   location:{type:String, required:true},
   isAvailable:{type:Boolean, default:true},
   date: { type: Number, required: true }
},{timestamps:true});

const Car = mongoose.model("Car",carSchema);

export default Car;
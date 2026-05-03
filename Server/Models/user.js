import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name:{type:String, required:true},
    phone:{type:String, required:true},
    email:{type:String, required:true, unique:true},
    password:{type:String, required:true},
    role:{type:String, enum:["user", "owner", "admin"], default:"user"},
    isOwner: { type: Boolean, default: false },
    ownerDetails: {
        businessName: { type: String },
        address: { type: String },
        verified: { type: Boolean, default: false }
    },
    image:{type:String, default:""},
},{timestamps:true});

const User = mongoose.model("User",userSchema);

export default User;

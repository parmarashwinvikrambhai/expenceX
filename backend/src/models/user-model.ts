import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    profilePic: {
        type: String,   // URL store hoga
        default: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
}, { timestamps: true });

const User  = mongoose.model("User",userSchema);
export default User
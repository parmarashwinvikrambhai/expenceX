import mongoose from "mongoose"

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    
    type: {
        type: String,
        enum: ["income", "expense"],
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null, // for global categories
    },
}, { timestamps: true });

const Category  = mongoose.model("Category",categorySchema);
export default Category
import mongoose, { model } from "mongoose";

export const categorySchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Types.ObjectId,
        require: true
    },
    name: {
        type: String,
        require: true
    },
    restaurant_id: {
        type: mongoose.Types.ObjectId,
        require: true
    }
}, {
    timestamps: true
})

export default model("categories", categorySchema)
import mongoose, { model } from "mongoose";

export const bannerSchema = new mongoose.Schema({
    banner: {
        type: String,
        require: true
    },
    status: {
        type: String,
        require: true,
        enum: ['active', 'unactive'],
        // 1 == true, 0 == false
        default: 'active'
    }
}, {
    timestamps: true
})

export default model("banners", bannerSchema)
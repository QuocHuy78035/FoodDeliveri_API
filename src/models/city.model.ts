import mongoose, { model } from "mongoose";

export const citySchema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    lat: {
        type: Number,
        require: true
    },
    lng: {
        type: Number,
        require: true
    },
    status: {
        type: String,
        require: true
    }
}, {
    timestamps: true
})

export default model("cities", citySchema)
import mongoose, { model, Schema } from "mongoose";
import { IRestaurant } from "./interfaces/restaurant.interface";

export const restaurantSchema = new mongoose.Schema<IRestaurant>({
    user_id: {
        type: Schema.Types.ObjectId,
        require: true
    },
    city_id: {
        type: Schema.Types.ObjectId,
        require: true
    },
    name: {
        type: String,
        require: true
    },
    short_name: {
        type: String,
        require: true
    },
    description: {
        type: String
    },
    cover: {
        type: String,
    },
    location: {
        type: Object,
        //required: true
    },
    cuisines: {
        type: [String],
        require: true
    },
    open_time: {
        type: String,
        require: true
    },
    close_time: {
        type: String,
        require: true
    },
    price: {
        type: Number,
        require: true
    },
    address: {
        type: String,
        require: true
    },
    delivery_time: {
        type: String,
        require: true
    },
    is_close: {
        type: Boolean,
        require: true,
        default: false
    },
    status: {
        type: String,
        require: true,
        enum: ['active', 'unactive'],
        default: 'active'
    },
    rating: {
        type: Number,
        require: true,
        default: 0
    },
    total_rating: {
        type: Number,
        require: true,
        default: 0
    }
}, {
    timestamps: true
})

export default model("restaurants", restaurantSchema)
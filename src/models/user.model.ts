import * as mongoose from 'mongoose';
import { model } from 'mongoose';

export const userSchema = new mongoose.Schema({
    email: {
        type: String,
        require: true
    },
    name: {
        type: String,
        require: true
    },
    phone: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    type: {
        type: String,
        enum: ['user', 'admin', 'vendor'],
        default: 'user'
    },
    status: {
        type: String,
        enum: ['active', 'unactive'],
        default: 'unactive'
    },
    email_verified: {
        type: Boolean,
        default: false
    },
    verification_token: {
        type: String,
        require: true,
        default: ''
    },
    verification_token_time: {
        type: Date,
        require: true,
        default: Date.now()
    },
    reset_password_token: {
        type: String,
        require: true,
        default: ''
    },
    reset_password_token_time: {
        type: Date,
        require: true,
        default: Date.now()
    }
}, {
    timestamps: true
})

export default model("users", userSchema)
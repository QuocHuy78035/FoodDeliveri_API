import mongoose from "mongoose";

export interface IRestaurant {
    user_id: mongoose.Types.ObjectId,
    city_id: mongoose.Types.ObjectId,
    name: string,
    short_name: string,
    description?: string,
    cover?: string,
    location: object,
    cuisines: string[],
    open_time: string,
    close_time: string,
    price: number,
    address: string,
    delivery_time: string,
    is_close?: boolean,
    status?: string,
    rating?: number,
    total_rating?: number
}
import { Request, Response, NextFunction } from "express";
import restaurantModel from "../models/restaurant.model";
import { Utils } from "../utils/utils";
import userModel from "../models/user.model";
import { IRestaurant } from "../models/interfaces/restaurant.interface";
import categoryModel from "../models/category.model";

export class RestaurantController {

    static async createRestaurant(req: Request, res: Response, next: NextFunction) {
        const restaurant = req.body;

        try {

            //crete user type vendor
            const passwordHash = await Utils.hashPassword(restaurant.password);
            const verifycationToken = Utils.generateVerificationToken(5);
            const userData = {
                name: restaurant.user_name,
                email: restaurant.email,
                password: passwordHash,
                verifycationToken: verifycationToken,
                verification_token_time: Date.now() + new Utils().MAX_TOKEN_TIME,
                phone: restaurant.phone,
                type: 'vendor',
                status: 'active'
            };
            const user = await new userModel(userData).save();

            //create restaurants
            let restaurantData: IRestaurant = {
                user_id: user.id,
                city_id: restaurant.city,
                name: restaurant.res_name,
                short_name: restaurant.short_name,
                location: JSON.parse(restaurant.location),
                cuisines: JSON.parse(restaurant.cuisines),
                open_time: restaurant.open_time,
                close_time: restaurant.close_time,
                price: parseInt(restaurant.price),
                address: restaurant.address,
                delivery_time: restaurant.delivery_time,
            }
            if (restaurant.description) {
                restaurantData = { ...restaurantData, description: restaurant.description }
            }
            if (req.file) {
                const path = `http://localhost:3000/src/uploads/restaurantImages/` + req.file.filename;
                restaurantData = { ...restaurantData, cover: path }
            }
            const restaurantDoc = await new restaurantModel(restaurantData).save();

            //create category
            const categoriesData = JSON.parse(restaurant.categories).map(x => {
                return { name: x, restaurant_id: restaurantDoc._id };
            });
            const categoryDoc = await categoryModel.insertMany(categoriesData);
            if (restaurantDoc && user && categoryDoc) {
                return res.status(201).json({
                    message: "Create restaurant successfully!"
                })
            }
        }
        catch (e) {
            console.log(e)
            return next(e);
        }
    }

    static async getAllCity(req: Request, res: Response, next: NextFunction) {
        // const cities = await cityModel.find({
        //     status: 'active'
        // });
        // return res.status(200).json({
        //     message: 'Get all city successfully!',
        //     status_code: 200,
        //     cities
        // })
    }
}
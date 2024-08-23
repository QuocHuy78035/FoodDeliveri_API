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
            console.log('123', restaurantDoc._id);

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

    static async getNearByRestaurant(req: Request, res: Response, next: NextFunction) {
        const EARTH_RADIUS_IN_KM = 6378.1;
        const lng = req.query.lng as string;
        const lat = req.query.lat as string;
        const radius = req.query.radius as string;
        try {
            const restaurant = await restaurantModel.find({
                status: 'active',
                location: {
                    $geoWithin: {
                        $centerSphere: [
                            [parseFloat(lng), parseFloat(lat)],
                            parseFloat(radius) / EARTH_RADIUS_IN_KM
                        ]
                    }
                }
            }, {
                __v: 0
            })
            return res.status(200).json({
                status_code: 200,
                message: "Get restaurant successfully!",
                restaurant
            })
        }
        catch (e) {
            console.log(e)
            return next(e);
        }
    }

    static async getRestaurantBySearch(req: Request, res: Response, next: NextFunction) {
        const EARTH_RADIUS_IN_KM = 6378.1;
        const lng = req.query.lng as string;
        const lat = req.query.lat as string;
        const radius = req.query.radius as string;
        const name = req.query.name as string;
        console.log(name);
        try {
            const restaurant = await restaurantModel.find({
                status: 'active',
                // i: khong phan biet chu hoa va chu thuong
                name: { $regex: name, $options: 'i' },
                // location: {
                //     $geoWithin: {
                //         $centerSphere: [
                //             [parseFloat(lng), parseFloat(lat)],
                //             parseFloat(radius) / EARTH_RADIUS_IN_KM
                //         ]
                //     }
                // },
            }, {
                __v: 0
            })
            return res.status(200).json({
                status_code: 200,
                message: "Get restaurant successfully!",
                restaurant
            })
        }
        catch (e) {
            console.log(e)
            return next(e);
        }
    }
}
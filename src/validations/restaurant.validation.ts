import { body } from "express-validator";

export class RestaurantValidation {
    static addRestaurant() {
        return [
            body('user_name', 'Vendor name is required').isString(),
            body('email', 'Vendor email is required').isEmail(),
            body('password', 'Vendor password is required').notEmpty(),
            body('phone', 'Vendor phone is required').notEmpty(),
            body('city_id', 'City is requiured').notEmpty(),
            body('res_name', 'Restaurant name is required').notEmpty(),
            body('short_name', 'Restaurant short name is required').notEmpty(),
            body('location', 'Restaurant location is required').notEmpty(),
            body('cuisines', 'Restaurant cuisines is required').notEmpty(),
            body('open_time', 'Restaurant open time is required').notEmpty(),
            body('close_time', 'Restaurant close time is required').notEmpty(),
            body('price', 'Restaurant price is required').notEmpty(),
            body('address', 'Restaurant address is required').notEmpty(),
            body('delivery_time', 'Restaurant delivery time is required').notEmpty(),
            body('restaurantImages', 'Cover image is required')
                .custom((cover, { req }) => {
                    if (req.file) {
                        return true;
                    } else {
                        throw ('File not uploaded');
                    }
                })
        ]
    }
}
import { body } from "express-validator";

export class CityValidators {

    static addCity() {
        return [
            body('name', 'Citi name is required').isString(),
            body('lat', 'Latitude is required').notEmpty(),
            body('lng', 'Longtitude is required').notEmpty()
        ]
    }
}
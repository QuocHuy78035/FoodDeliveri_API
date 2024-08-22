import { Router } from "express";
import { RestaurantController } from "../controllers/restaurant.controller";
import { Utils } from "../utils/utils";
import { RestaurantValidation } from "../validations/restaurant.validation";
import { GlobalMiddleware } from "../middlewares/global.middleware";

class RestaurantRouter {
    public router: Router

    constructor() {
        this.router = Router()
        this.postRouter();
        this.getRouter();
        this.patchRouter();
        this.deleteRouter();
    }

    postRouter() {
        this.router.post('/create/restaurant',
            GlobalMiddleware.auth,
            GlobalMiddleware.adminRole,
            new Utils().multer.single('restaurantImages'),
            RestaurantValidation.addRestaurant(),
            GlobalMiddleware.handleValidationError,
            RestaurantController.createRestaurant)
    };
    getRouter() {

    };
    patchRouter() {

    };
    deleteRouter() { };
}

export default new RestaurantRouter().router;
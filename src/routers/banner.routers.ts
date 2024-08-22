import { Router } from "express";
import { GlobalMiddleware } from "../middlewares/global.middleware";
import { BannerController } from "../controllers/banner.controller";
import { BannerValidators } from "../validations/banner.validation";
import { Utils } from "../utils/utils";

class BannerRouter {
    public router: Router

    constructor() {
        this.router = Router()
        this.postRouter();
        this.getRouter();
        this.patchRouter();
        this.deleteRouter();
    }

    postRouter() {
        this.router.post(
            '/create/banner',
            GlobalMiddleware.auth,
            GlobalMiddleware.adminRole,
            BannerValidators.addBanner(),
            GlobalMiddleware.handleValidationError,
            new Utils().multer.single('bannerImages'),
            BannerController.addBanner
        );
    };

    getRouter() {
        this.router.get('/',
            BannerController.getAllBanner
        );
    };
    patchRouter() {

    };
    deleteRouter() { };
}


export default new BannerRouter().router;
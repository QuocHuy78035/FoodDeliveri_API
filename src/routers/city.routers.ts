import { Router } from "express";
import cityModel from "../models/city.model";
import { CityController } from "../controllers/city.controller";

class CityRouter {
    public router: Router

    constructor() {
        this.router = Router()
        this.postRouter();
        this.getRouter();
        this.patchRouter();
        this.deleteRouter();
    }

    postRouter() {
    };
    getRouter() {
        this.router.get('/', CityController.getAllCity)
    };
    patchRouter() {
    };
    deleteRouter() { };
}

export default new CityRouter().router;
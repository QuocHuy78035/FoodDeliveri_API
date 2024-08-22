import * as express from 'express';
import mongoose from 'mongoose';
import { getEnvironmentVariable } from './environment/environment';
import UserRouters from './routers/user.routers';
import * as cors from 'cors';
import bannerRouters from './routers/banner.routers';
import cityRouters from './routers/city.routers';
import restaurantRouters from './routers/restaurant.routers';

export class Server {
    public app: express.Application = express();

    constructor() {
        this.setConfigs();
        this.setRoutes();
        this.error404Handler();
        this.handleError();
    }

    setConfigs() {
        this.configBodyParser();
        this.connectMongoDB();
        this.allowCors();
    }

    setRoutes() {
        this.app.use('/src/uploads/restaurantImages', express.static('src/uploads/restaurantImages'))
        this.app.use('/src/uploads/bannerImages', express.static('src/uploads/bannerImages'))
        this.app.use('/api/v1/users', UserRouters)
        this.app.use('/api/v1/banners', bannerRouters)
        this.app.use('/api/v1/cities', cityRouters)
        this.app.use('/api/v1/restaurants', restaurantRouters)
    }

    allowCors() {
        this.app.use(cors());
    }

    connectMongoDB() {
        mongoose.set("strictQuery", false);
        mongoose.connect(getEnvironmentVariable().db_uri, {
            dbName: "food_delivery_db"
        }, () => {
            console.log("Connect to database successfully!!");
        });
        // mongoose.connect(getEnvironmentVariable().db_uri).then(() => {
        //     console.log("Connect to database successfully")
        // })
    }

    configBodyParser() {
        this.app.use(express.json())
        this.app.use(express.urlencoded({ extended: true }));
    }

    error404Handler() {
        this.app.use((req, res) => {
            res.status(404).json({
                message: "Not found",
                status_code: 404
            })
        })
    }

    handleError() {
        this.app.use((err, req, res, next) => {
            const errorStatus = err.errorStatus || 500;
            return res.status(errorStatus).json({
                message: err.message || "Some thing went wrong!",
                status_code: errorStatus
            })
        })
    }
}
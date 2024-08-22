import { Request, Response, NextFunction } from "express";
import cityModel from "../models/city.model";

export class CityController {

    static async addBanner(req: Request, res: Response, next: NextFunction) {
        // const path = `http://localhost:3000/src/uploads/` + req.file.filename;
        // const banner = await new bannerModel({
        //     banner: path
        // }).save();
        // return res.status(201).json({
        //     message: 'Upload banner successfully!',
        //     status_code: 201,
        //     banner
        // })
    }

    static async getAllCity(req: Request, res: Response, next: NextFunction) {
        const cities = await cityModel.find({
            status: 'active'
        });
        return res.status(200).json({
            message: 'Get all city successfully!',
            status_code: 200,
            cities
        })
    }
}